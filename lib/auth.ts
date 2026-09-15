import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import { ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';

const COOKIE_NAME = 'pickme_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-local-secret';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type SessionPayload = { userId: string; email: string; name: string; exp: number };

function b64url(input: string | Buffer) {
  return Buffer.from(input).toString('base64url');
}

function sign(value: string) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('base64url');
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(key, 'hex');
  const b = Buffer.from(derived, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function createSession(user: { _id: ObjectId; email: string; name: string }) {
  const payload: SessionPayload = {
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const encoded = b64url(JSON.stringify(payload));
  const token = `${encoded}.${sign(encoded)}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', { httpOnly: true, expires: new Date(0), path: '/' });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature || sign(encoded) !== signature) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.userId || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHORIZED');
  return session;
}

export async function findUserById(userId: string) {
  if (!ObjectId.isValid(userId)) return null;
  const db = await getDatabase();
  return db.collection('users').findOne({ _id: new ObjectId(userId) });
}
