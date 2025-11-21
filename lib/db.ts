import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri = process.env.MONGODB_URI
const options = {
  serverSelectionTimeoutMS: 5000, // 5秒超时
  connectTimeoutMS: 10000, // 10秒连接超时
  socketTimeoutMS: 45000, // 45秒socket超时
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // 开发模式下，使用全局变量避免重复连接
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // 生产模式
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise
  // 使用环境变量中的数据库名，默认为'hanzi'
  const dbName = process.env.MONGODB_DB_NAME || 'hanzi'
  return client.db(dbName)
}

export interface CharacterDocument {
  _id?: string
  char: string
  pinyin: string
  radicals?: string
  stroke_count?: number
  ai_content: {
    story: string
    mnemonic: string
    words: string[]
    sentence: string
    sentence_pinyin: string
  }
  created_at?: Date
  visit_count?: number
}

