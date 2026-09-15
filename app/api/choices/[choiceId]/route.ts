import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ choiceId: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  try {
    const { choiceId } = await params;
    if (!ObjectId.isValid(choiceId)) return NextResponse.json({ message: '잘못된 선택지입니다.' }, { status: 400 });
    const { name, category } = await req.json();
    const trimmedName = String(name ?? '').trim();
    if (!trimmedName) return NextResponse.json({ message: '선택지를 입력해주세요.' }, { status: 400 });
    const db = await getDatabase();
    const r = await db.collection('choices').updateOne(
      { _id: new ObjectId(choiceId), userId: session.userId },
      { $set: { name: trimmedName, ...(category ? { category } : {}) } },
    );
    if (!r.matchedCount) return NextResponse.json({ message: '선택지를 찾을 수 없습니다.' }, { status: 404 });
    return NextResponse.json({ message: '수정되었습니다.' });
  } catch (error) {
    console.error('PATCH /api/choices error:', error);
    return NextResponse.json({ message: '선택지 수정에 실패했습니다.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ choiceId: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  try {
    const { choiceId } = await params;
    if (!ObjectId.isValid(choiceId)) return NextResponse.json({ message: '잘못된 선택지입니다.' }, { status: 400 });
    const db = await getDatabase();
    const r = await db.collection('choices').deleteOne({ _id: new ObjectId(choiceId), userId: session.userId });
    if (!r.deletedCount) return NextResponse.json({ message: '선택지를 찾을 수 없습니다.' }, { status: 404 });
    return NextResponse.json({ message: '삭제되었습니다.' });
  } catch (error) {
    console.error('DELETE /api/choices error:', error);
    return NextResponse.json({ message: '선택지 삭제에 실패했습니다.' }, { status: 500 });
  }
}
