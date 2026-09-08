import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'pickme';

let clientPromise: Promise<MongoClient> | undefined;

declare global {
  // eslint-disable-next-line no-var
  var __pickmeMongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('MONGODB_URI가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global.__pickmeMongoClientPromise) {
      const client = new MongoClient(uri);
      global.__pickmeMongoClientPromise = client.connect();
    }
    return global.__pickmeMongoClientPromise;
  }

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function getDatabase() {
  const client = await getMongoClient();
  return client.db(dbName);
}
