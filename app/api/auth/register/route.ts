import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { createSession, hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    const normalizedEmail = String(email ?? '').trim().toLowerCase();
    const normalizedName = String(name ?? '').trim();

    if (!normalizedName) return NextResponse.json({ message: '이름을 입력해주세요.' }, { status: 400 });
    if (!normalizedEmail || !normalizedEmail.includes('@')) return NextResponse.json({ message: '올바른 이메일을 입력해주세요.' }, { status: 400 });
    if (String(password ?? '').length < 6) return NextResponse.json({ message: '비밀번호는 6자 이상이어야 합니다.' }, { status: 400 });

    const db = await getDatabase();
    const users = db.collection('users');
    const existing = await users.findOne({ email: normalizedEmail });
    if (existing) return NextResponse.json({ message: '이미 가입된 이메일입니다.' }, { status: 409 });

    const now = new Date();
    const result = await users.insertOne({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash: hashPassword(String(password)),
      createdAt: now,
    });
    const user = { _id: result.insertedId, email: normalizedEmail, name: normalizedName };
    await createSession(user);
    return NextResponse.json({ user: { id: result.insertedId.toString(), name: normalizedName, email: normalizedEmail } }, { status: 201 });
  } catch (error) {
    console.error('POST /api/auth/register error:', error);
    return NextResponse.json({ message: '회원가입에 실패했습니다.' }, { status: 500 });
  }
}
