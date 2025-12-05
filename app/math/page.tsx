'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { buildOptions } from '@/lib/math-options'

type MathLevel = 'easy' | 'medium' | 'hard'
type MathProblem = { question: string; answer: string; level: MathLevel }

const LevelButton = ({ level, active, onClick }: { level: MathLevel; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
      active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    }`}
  >
    {level === 'easy' ? '⭐️ 启蒙小试' : level === 'medium' ? '🚀 挑战进阶' : '💡 数学精英'}
  </button>
)

export default function MathGeniusPage() {
  const [level, setLevel] = useState<MathLevel>('easy')
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<string[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setResult(null)
    setUserAnswer('')
    setOptions([])
    try {
      const res = await fetch(`/api/math?level=${level}`)
      if (!res.ok) throw new Error('生成失败')
      const p = (await res.json()) as MathProblem
      setProblem(p)
      setOptions(buildOptions(p.answer, level))
      // speak question when ready
      setTimeout(() => speakQuestion(p.question), 100)
    } catch (e) {
      setProblem({ question: '生成题目失败，请重试', answer: '', level })
    } finally {
      setLoading(false)
    }
  }

  const chooseOption = (opt: string) => {
    if (!problem) return
    const normalize = (v: string) => v.trim()
    const ok = normalize(opt) === normalize(problem.answer)
    setUserAnswer(opt)
    setResult(ok ? 'correct' : 'wrong')
    // Speak feedback
    if (ok) {
      speak('太棒了！你答对啦！')
    } else {
      speak('没关系，再试试别的选项吧！')
    }
  }

  useEffect(() => {
    const timer = timerRef.current
    return () => {
      if (timer) clearTimeout(timer)
      // stop speech when leaving
      try { window.speechSynthesis?.cancel() } catch {}
    }
  }, [])

  const speakQuestion = (text?: string) => {
    const content = (text ?? problem?.question ?? '').trim()
    if (!content) return
    speak(content)
  }
  const speak = (content: string) => {
    try {
      window.speechSynthesis?.cancel()
      const utter = new SpeechSynthesisUtterance(content)
      utter.lang = 'zh-CN'
      utter.rate = 0.95
      utter.pitch = 1.0
      utterRef.current = utter
      window.speechSynthesis?.speak(utter)
    } catch {}
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2"><span className="text-gradient">数学小天才</span></h1>
          <p className="text-gray-600 dark:text-gray-300">趣味练习加减乘除、分数和小数，适合5-8岁儿童</p>
        </div>

        <div className="flex gap-2 justify-center mb-6">
          <LevelButton level="easy" active={level === 'easy'} onClick={() => setLevel('easy')} />
          <LevelButton level="medium" active={level === 'medium'} onClick={() => setLevel('medium')} />
          <LevelButton level="hard" active={level === 'hard'} onClick={() => setLevel('hard')} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">当前难度：{level}</div>
            <button
              onClick={handleGenerate}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? '生成中...' : '生成新题目'}
            </button>
          </div>

          <div className="text-center py-6">
            {problem ? (
              <div>
                <div className="text-2xl font-semibold mb-4">{problem.question}</div>
                <div className="mb-4">
                  <button onClick={() => speakQuestion()} className="px-3 py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 transition">
                    🔊 朗读题目
                  </button>
                </div>
                {/* 选项卡片 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => chooseOption(opt)}
                      className={`p-4 rounded-2xl shadow transition text-lg font-bold 
                        ${result && opt === userAnswer && result === 'correct' ? 'bg-green-500 text-white scale-105' : ''}
                        ${result && opt === userAnswer && result === 'wrong' ? 'bg-red-500 text-white shake' : ''}
                        ${!result || opt !== userAnswer ? 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-indigo-50' : ''}
                      `}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {result === 'correct' && (
                  <div className="mt-4 flex flex-col items-center gap-3">
                    <div className="text-green-600 text-lg">👍 太棒了！你答对啦！</div>
                    <button onClick={handleGenerate} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
                      下一题
                    </button>
                  </div>
                )}
                {result === 'wrong' && (
                  <div className="mt-4 text-red-600 text-lg">😢 没关系，再试试别的选项吧！</div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">点击“生成新题目”开始练习</div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
