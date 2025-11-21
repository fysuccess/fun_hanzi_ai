export interface CharacterData {
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
  visit_count?: number
}

export async function fetchCharacterData(char: string): Promise<CharacterData> {
  const response = await fetch(`/api/character?char=${encodeURIComponent(char)}`)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '请求失败' }))
    throw new Error(error.message || error.error || '获取汉字信息失败')
  }
  
  const data = await response.json()
  
  // 如果返回的是错误信息但状态码是200（数据库连接失败但功能可用）
  if (data.error && data.message) {
    console.warn('数据库连接警告:', data.message)
    // 继续返回数据，因为AI功能仍可用
  }
  
  return data
}

