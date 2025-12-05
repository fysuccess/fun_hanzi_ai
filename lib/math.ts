import OpenAI from 'openai'

export type MathLevel = 'easy' | 'medium' | 'hard'

export interface MathProblem {
  question: string
  answer: string
  level: MathLevel
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_API_KEY ? 'https://api.deepseek.com/v1' : undefined,
})

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function fallbackGenerate(level: MathLevel): MathProblem {
  if (level === 'easy') {
    // Word problem with addition or subtraction, 0-20, subtraction non-negative
    const isAdd = Math.random() < 0.6 // more addition for easy
    const names = ['小明', '小红', '小刚', '小丽']
    const items = ['苹果', '香蕉', '气球', '铅笔', '糖果']
    const name = names[randomInt(0, names.length - 1)]
    const item = items[randomInt(0, items.length - 1)]
    const a = randomInt(0, 10)
    const b = randomInt(1, 10)
    if (isAdd) {
      const question = `${name}有${a}个${item}，${name === '小明' ? '妈妈' : '老师'}又给了他${b}个，现在${name}有几个${item}？`
      return { question, answer: String(a + b), level }
    } else {
      const x = Math.max(a, b)
      const y = Math.min(a, b)
      const question = `${name}有${x}个${item}，他送出了${y}个，现在还剩几个${item}？`
      return { question, answer: String(x - y), level }
    }
  }

  if (level === 'medium') {
    // mix + - * / within 0-20; division must be integer; multiplication result <=20
    const ops = ['+', '-', '*', '/'] as const
    const op = ops[randomInt(0, ops.length - 1)]
    if (op === '+') {
      const a = randomInt(0, 20)
      const b = randomInt(0, 20)
      return { question: `${a} + ${b} = ?`, answer: String(a + b), level }
    }
    if (op === '-') {
      const a = randomInt(0, 20)
      const b = randomInt(0, 20)
      const x = Math.max(a, b)
      const y = Math.min(a, b)
      return { question: `${x} - ${y} = ?`, answer: String(x - y), level }
    }
    if (op === '*') {
      // ensure result <= 20
      const factors: Array<[number, number]> = []
      for (let i = 0; i <= 20; i++) {
        for (let j = 0; j <= 20; j++) {
          if (i * j <= 20) factors.push([i, j])
        }
      }
      const [a, b] = factors[randomInt(0, factors.length - 1)]
      return { question: `${a} × ${b} = ?`, answer: String(a * b), level }
    }
    // division integer
    const divisor = randomInt(1, 10)
    const quotient = randomInt(0, 10)
    const dividend = divisor * quotient
    return { question: `${dividend} ÷ ${divisor} = ?`, answer: String(quotient), level }
  }

  // hard: fractions (1/2, 1/4, etc.) and one-decimal numbers up to 100
  const useFraction = Math.random() < 0.5
  if (useFraction) {
    const denominators = [2, 4]
    const d1 = denominators[randomInt(0, denominators.length - 1)]
    const d2 = denominators[randomInt(0, denominators.length - 1)]
    const n1 = randomInt(1, d1 - 1)
    const n2 = randomInt(1, d2 - 1)
    // simple addition of fractions
    const question = `${n1}/${d1} + ${n2}/${d2} = ?`
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
    const lcm = (a: number, b: number) => (a * b) / gcd(a, b)
    const L = lcm(d1, d2)
    const sumNum = n1 * (L / d1) + n2 * (L / d2)
    // present answer as simplified fraction
    const g = gcd(sumNum, L)
    const ans = `${sumNum / g}/${L / g}`
    return { question, answer: ans, level }
  } else {
    const ops = ['+', '-', '*'] as const
    const op = ops[randomInt(0, ops.length - 1)]
    const toOneDecimal = (n: number) => Math.round(n * 10) / 10
    const a = toOneDecimal(randomInt(0, 100) + randomInt(0, 9) / 10)
    const b = toOneDecimal(randomInt(0, 100) + randomInt(0, 9) / 10)
    if (op === '+') {
      return { question: `${a} + ${b} = ?`, answer: String(toOneDecimal(a + b)), level }
    }
    if (op === '-') {
      const x = Math.max(a, b)
      const y = Math.min(a, b)
      return { question: `${x} - ${y} = ?`, answer: String(toOneDecimal(x - y)), level }
    }
    return { question: `${a} × ${b} = ?`, answer: String(toOneDecimal(a * b)), level }
  }
}

export async function generateMathProblem(level: MathLevel): Promise<MathProblem> {
  // For easy level, prefer local generator to ensure variety and child-friendly wording
  if (level === 'easy') {
    return fallbackGenerate(level)
  }
  // Try AI first for medium/hard; fall back to local generator
  try {
    const promptByLevel: Record<MathLevel, string> = {
      easy:
        '请生成一个适合5岁孩子的加法或减法题目，数字都在20以内，减法结果不为负。严格返回JSON格式：{"question":"<题目>","answer":"<答案>"}。不要任何多余文字。',
      medium:
        '请生成一个数字在20以内的加、减、乘、除混合运算题目。除法必须整除，乘法结果不超过20。严格返回JSON格式：{"question":"<题目>","answer":"<答案>"}。不要任何多余文字。',
      hard:
        '请生成一个涉及100以内分数(如1/2,1/4)或一位小数的加减乘除运算题目。严格返回JSON格式：{"question":"<题目>","answer":"<答案>"}。不要任何多余文字。',
    }

    const completion = await openai.chat.completions.create({
      model: process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '你是一位面向儿童的数学题生成器。只返回严格的JSON，无任何其他文本、标点或代码块。',
        },
        { role: 'user', content: promptByLevel[level] },
      ],
      temperature: 0.3,
      max_tokens: 200,
    })

    const content = completion.choices[0]?.message?.content?.trim()
    if (!content) throw new Error('Empty AI content')

    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    const parsed = JSON.parse(cleaned) as { question: string; answer: string }

    if (!parsed?.question || !parsed?.answer) throw new Error('Invalid AI format')

    return { question: parsed.question, answer: String(parsed.answer), level }
  } catch (e) {
    const fb = fallbackGenerate(level)
    return fb
  }
}
