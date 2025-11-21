import { getPinyin } from '@/lib/ai'

describe('AI工具函数', () => {
  it('应该正确获取拼音', () => {
    const pinyin = getPinyin('猫')
    expect(pinyin).toBeTruthy()
    expect(typeof pinyin).toBe('string')
  })

  it('应该在出错时返回空字符串', () => {
    // 测试异常情况
    const pinyin = getPinyin('')
    expect(pinyin).toBe('')
  })
})

