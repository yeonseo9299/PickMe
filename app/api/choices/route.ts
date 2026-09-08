import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const userId = new URL(req.url).searchParams.get('userId');
  if (!userId) return NextResponse.json({message:'userId가 필요합니다.'},{status:401});
  try { const db=await getDatabase(); const choices=await db.collection('choices').find({userId}).sort({createdAt:-1}).toArray(); return NextResponse.json({choices:choices.map(c=>({...c,_id:c._id.toString()}))}); }
  catch { return NextResponse.json({message:'선택지 조회에 실패했습니다.'},{status:500}); }
}

export async function POST(req: NextRequest) {
  try { const body=await req.json(); const {userId,name,category}=body; if(!userId)return NextResponse.json({message:'로그인이 필요합니다.'},{status:401}); if(!name?.trim())return NextResponse.json({message:'선택지를 입력해주세요.'},{status:400}); if(name.trim().length>50)return NextResponse.json({message:'선택지는 50자 이하로 입력해주세요.'},{status:400}); const now=new Date(); const db=await getDatabase(); const result=await db.collection('choices').insertOne({userId,name:name.trim(),category:category||'기타',createdAt:now}); return NextResponse.json({choiceId:result.insertedId.toString(),name:name.trim(),category:category||'기타',createdAt:now.toISOString()},{status:201}); }
  catch { return NextResponse.json({message:'선택지 저장에 실패했습니다.'},{status:500}); }
}
