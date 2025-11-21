import OpenAI from 'openai'
import { pinyin as getPinyinFromLib } from 'pinyin-pro'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_API_KEY 
    ? 'https://api.deepseek.com/v1'
    : undefined,
})

export interface AICharacterContent {
  story: string
  mnemonic: string
  words: string[]
  sentence: string
  sentence_pinyin: string
}

export async function generateCharacterContent(char: string): Promise<AICharacterContent> {
  const prompt = `你是一位专业的汉字教育专家，擅长用生动、童趣的语言给小学生讲解汉字。

请分析汉字："${char}"。

要求：
1. story: 50字以内，结合字形结构或象形来源的趣味讲解。
2. mnemonic: 一句顺口溜（10-15字）。
3. words: 2个常用组词（数组格式）。
4. sentence: 1个简单造句，适合7岁儿童理解。
5. sentence_pinyin: 造句对应的拼音。

请严格按照以下JSON格式输出，不要包含任何其他文字：
{
  "story": "...",
  "mnemonic": "...",
  "words": ["词1", "词2"],
  "sentence": "...",
  "sentence_pinyin": "..."
}`

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的汉字教育专家，输出严格的JSON格式，不要包含任何markdown标记。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('AI返回内容为空')
    }

    // 清理可能的markdown代码块标记
    const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    const result = JSON.parse(cleanedContent) as AICharacterContent

    // 验证必需字段
    if (!result.story || !result.mnemonic || !result.words || !result.sentence) {
      throw new Error('AI返回数据格式不完整')
    }

    return result
  } catch (error: any) {
    console.error('AI生成失败:', error)
    // 返回默认内容
    return {
      story: `${char}字是一个有趣的汉字，让我们一起学习它的写法吧！`,
      mnemonic: `记住${char}字，多写多练。`,
      words: [`${char}字`, `${char}词`],
      sentence: `这是一个关于${char}字的例句。`,
      sentence_pinyin: `zhè shì yí gè guān yú ${char} zì de lì jù.`,
    }
  }
}

export function getPinyin(char: string): string {
  try {
    return getPinyinFromLib(char, { toneType: 'symbol' })
  } catch {
    return ''
  }
}

