import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  try {
    const db = await getDatabase();
    const history = await db.collection('decisionHistory').find({ userId: session.userId }).sort({ decisionAt: -1 }).limit(100).toArray();
    return NextResponse.json({ history: history.map((item) => ({ ...item, _id: item._id.toString(), choiceId: item.choiceId?.toString?.() ?? String(item.choiceId) })) });
  } catch (error) {
    console.error('GET /api/history error:', error);
    return NextResponse.json({ message: '결정 기록을 불러오지 못했습니다.' }, { status: 500 });
  }
}
