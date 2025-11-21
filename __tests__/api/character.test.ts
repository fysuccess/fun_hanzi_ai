import { GET } from '@/app/api/character/route'
import { NextRequest } from 'next/server'

// Mock dependencies
jest.mock('@/lib/db', () => ({
  getDb: jest.fn(),
}))

jest.mock('@/lib/ai', () => ({
  generateCharacterContent: jest.fn(),
  getPinyin: jest.fn(() => 'māo'),
}))

describe('/api/character', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('应该返回400当没有提供char参数', async () => {
    const request = new NextRequest('http://localhost:3000/api/character')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('请提供汉字参数')
  })

  it('应该返回400当提供的不是汉字', async () => {
    const request = new NextRequest('http://localhost:3000/api/character?char=abc')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('请输入有效的汉字')
  })

  it('应该从缓存返回数据当字符已存在', async () => {
    const { getDb } = require('@/lib/db')
    const mockCollection = {
      findOne: jest.fn().mockResolvedValue({
        char: '猫',
        pinyin: 'māo',
        ai_content: {
          story: '测试故事',
          mnemonic: '测试口诀',
          words: ['小猫', '熊猫'],
          sentence: '测试句子',
          sentence_pinyin: 'cè shì jù zi',
        },
        visit_count: 5,
      }),
      updateOne: jest.fn().mockResolvedValue({}),
    }

    getDb.mockResolvedValue({
      collection: jest.fn(() => mockCollection),
    })

    const request = new NextRequest('http://localhost:3000/api/character?char=猫')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.char).toBe('猫')
    expect(data.pinyin).toBe('māo')
    expect(mockCollection.findOne).toHaveBeenCalledWith({ char: '猫' })
    expect(mockCollection.updateOne).toHaveBeenCalled()
  })

  it('应该调用AI生成新数据当字符不存在', async () => {
    const { getDb } = require('@/lib/db')
    const { generateCharacterContent } = require('@/lib/ai')

    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(null),
      insertOne: jest.fn().mockResolvedValue({}),
    }

    getDb.mockResolvedValue({
      collection: jest.fn(() => mockCollection),
    })

    generateCharacterContent.mockResolvedValue({
      story: '新故事',
      mnemonic: '新口诀',
      words: ['新词1', '新词2'],
      sentence: '新句子',
      sentence_pinyin: 'xīn jù zi',
    })

    const request = new NextRequest('http://localhost:3000/api/character?char=新')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.char).toBe('新')
    expect(generateCharacterContent).toHaveBeenCalledWith('新')
    expect(mockCollection.insertOne).toHaveBeenCalled()
  })
})

