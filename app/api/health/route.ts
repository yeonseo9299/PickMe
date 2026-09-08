import { NextResponse } from 'next/server';
import { getDatabase, getMongoClient } from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await getMongoClient();
    await client.db('admin').command({ ping: 1 });

    const db = await getDatabase();
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      connected: true,
      database: db.databaseName,
      collections: collections.map((collection) => collection.name),
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);

    return NextResponse.json(
      {
        connected: false,
        message: 'MongoDB 연결에 실패했습니다.',
        detail: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
