import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';

const CATEGORIES = ['음식', '쇼핑', '여가', '기타'];

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  try {
    const { category } = await req.json();
    if (!CATEGORIES.includes(category)) return NextResponse.json({ message: '올바른 카테고리를 선택해주세요.' }, { status: 400 });
    const db = await getDatabase();
    const choices = await db.collection('choices').find({ userId: session.userId, category }).toArray();
    if (!choices.length) return NextResponse.json({ message: `${category} 카테고리에 먼저 선택지를 등록해주세요.` }, { status: 404 });
    const choice = choices[Math.floor(Math.random() * choices.length)];
    const now = new Date();
    const history = await db.collection('decisionHistory').insertOne({
      userId: session.userId,
      choiceId: choice._id,
      result: choice.name,
      category,
      decisionAt: now,
    });
    return NextResponse.json({ historyId: history.insertedId.toString(), choiceId: choice._id.toString(), result: choice.name, category, decisionAt: now.toISOString() });
  } catch (error) {
    console.error('POST /api/decisions error:', error);
    return NextResponse.json({ message: '랜덤 결정에 실패했습니다.' }, { status: 500 });
  }
}
