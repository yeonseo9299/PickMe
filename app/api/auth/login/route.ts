import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { createSession, verifyPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const normalizedEmail = String(email ?? '').trim().toLowerCase();
    const db = await getDatabase();
    const user = await db.collection('users').findOne({ email: normalizedEmail });
    if (!user || !verifyPassword(String(password ?? ''), String(user.passwordHash ?? ''))) {
      return NextResponse.json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }
    await createSession({ _id: user._id, email: String(user.email), name: String(user.name) });
    return NextResponse.json({ user: { id: user._id.toString(), name: user.name, email: user.email } });
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json({ message: '로그인에 실패했습니다.' }, { status: 500 });
  }
}
