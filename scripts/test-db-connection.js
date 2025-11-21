// MongoDB连接测试脚本
const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env.local' })

const uri = process.env.MONGODB_URI

if (!uri) {
  console.error('❌ 错误: 未找到 MONGODB_URI 环境变量')
  console.log('请确保 .env.local 文件存在并包含 MONGODB_URI')
  process.exit(1)
}

console.log('🔍 正在测试MongoDB连接...')
console.log('连接字符串:', uri.replace(/:[^:@]+@/, ':****@')) // 隐藏密码

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
})

async function testConnection() {
  try {
    console.log('\n⏳ 正在连接...')
    await client.connect()
    console.log('✅ MongoDB连接成功!')
    
    // 测试ping
    await client.db().admin().ping()
    console.log('✅ 数据库ping成功!')
    
    // 列出数据库
    const adminDb = client.db().admin()
    const databases = await adminDb.listDatabases()
    console.log('\n📊 可用数据库:')
    databases.databases.forEach(db => {
      console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`)
    })
    
    // 测试目标数据库
    const dbName = process.env.MONGODB_DB_NAME || 'hanzi'
    const db = client.db(dbName)
    const collections = await db.listCollections().toArray()
    console.log(`\n📁 数据库 "${dbName}" 中的集合:`)
    if (collections.length === 0) {
      console.log('  (空 - 这是正常的，第一次运行时会自动创建)')
    } else {
      collections.forEach(col => {
        console.log(`  - ${col.name}`)
      })
    }
    
    console.log('\n✅ 所有测试通过!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ 连接失败!')
    console.error('错误信息:', error.message)
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 可能的原因:')
      console.error('  1. IP地址无法访问 (172.30.151.83)')
      console.error('  2. 网络连接问题')
      console.error('  3. 防火墙阻止了连接')
    } else if (error.message.includes('authentication failed')) {
      console.error('\n💡 可能的原因:')
      console.error('  1. 用户名或密码错误')
      console.error('  2. authSource参数不正确')
    } else if (error.message.includes('timeout')) {
      console.error('\n💡 可能的原因:')
      console.error('  1. 服务器未响应')
      console.error('  2. 端口27017未开放')
      console.error('  3. 网络延迟过高')
    }
    
    process.exit(1)
  } finally {
    await client.close()
  }
}

testConnection()

