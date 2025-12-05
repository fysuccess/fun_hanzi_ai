import { NextRequest, NextResponse } from 'next/server'
import { generateMathProblem } from '@/lib/math'

export async function GET(request: NextRequest) {
  try {
    const level = (request.nextUrl.searchParams.get('level') || 'easy') as 'easy' | 'medium' | 'hard'
    if (!['easy', 'medium', 'hard'].includes(level)) {
      return NextResponse.json({ error: '无效的难度级别' }, { status: 400 })
    }

    const problem = await generateMathProblem(level)
    return NextResponse.json(problem)
  } catch (error: any) {
    console.error('生成数学题失败:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
