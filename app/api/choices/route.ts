import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';

const CATEGORIES = ['음식', '쇼핑', '여가', '기타'];

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  const category = new URL(req.url).searchParams.get('category');
  if (category && !CATEGORIES.includes(category)) return NextResponse.json({ message: '올바른 카테고리가 아닙니다.' }, { status: 400 });
  try {
    const db = await getDatabase();
    const query: { userId: string; category?: string } = { userId: session.userId };
    if (category) query.category = category;
    const choices = await db.collection('choices').find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ choices: choices.map((c) => ({ ...c, _id: c._id.toString() })) });
  } catch (error) {
    console.error('GET /api/choices error:', error);
    return NextResponse.json({ message: '선택지 조회에 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  try {
    const body = await req.json();
    const { name, category } = body;
    const trimmedName = String(name ?? '').trim();
    if (!trimmedName) return NextResponse.json({ message: '선택지를 입력해주세요.' }, { status: 400 });
    if (trimmedName.length > 50) return NextResponse.json({ message: '선택지는 50자 이하로 입력해주세요.' }, { status: 400 });
    if (!CATEGORIES.includes(category)) return NextResponse.json({ message: '올바른 카테고리를 선택해주세요.' }, { status: 400 });
    const now = new Date();
    const db = await getDatabase();
    const result = await db.collection('choices').insertOne({ userId: session.userId, name: trimmedName, category, createdAt: now });
    return NextResponse.json({ choiceId: result.insertedId.toString(), name: trimmedName, category, createdAt: now.toISOString() }, { status: 201 });
  } catch (error) {
    console.error('POST /api/choices error:', error);
    return NextResponse.json({ message: '선택지 저장에 실패했습니다.' }, { status: 500 });
  }
}
