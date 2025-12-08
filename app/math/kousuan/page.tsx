'use client'

import { useState, useEffect, useRef } from 'react'
import { KousuanProblem, KousuanType, generateKousuanProblems, calculateScore } from '@/lib/kousuan'
import NumberPad from '@/components/NumberPad'

const COUNT_OPTIONS = [10, 20, 30, 40, 50] as const
type CountOption = (typeof COUNT_OPTIONS)[number]

// 难度等级
type DifficultyLevel = '初级' | '中级' | '高级'
const DIFFICULTY_LEVELS: Record<DifficultyLevel, KousuanType[]> = {
  '初级': [
    '5以内加法', '5以内减法', '5以内加减法',
    '10以内加法', '10以内减法', '10以内加减法'
  ],
  '中级': [
    '5以内加减法填括号', '5以内加减法填括号混合',
    '10以内加减法填括号', '10以内加减法填括号混合',
    '20以内不进位加法', '20以内不退位减法',
    '20以内加法', '20以内减法', '20以内加减法'
  ],
  '高级': [
    '20以内进位加法', '20以内退位减法', '20以内进位加法和退位减法',
    '20以内加减法填括号', '20以内加减法填括号混合',
    '100以内加法', '100以内减法', '100以内加减法',
    '100以内加减法填括号', '100以内加减法填括号混合'
  ]
}

const ALL_TYPES: KousuanType[] = [
  '5以内加法',
  '5以内减法',
  '5以内加减法',
  '5以内加减法填括号',
  '5以内加减法填括号混合',
  '10以内加法',
  '10以内减法',
  '10以内加减法',
  '10以内加减法填括号',
  '10以内加减法填括号混合',
  '20以内不进位加法',
  '20以内不退位减法',
  '20以内进位加法',
  '20以内退位减法',
  '20以内进位加法和退位减法',
  '20以内加法',
  '20以内减法',
  '20以内加减法',
  '20以内加减法填括号',
  '20以内加减法填括号混合',
  '100以内加法',
  '100以内减法',
  '100以内加减法',
  '100以内加减法填括号',
  '100以内加减法填括号混合',
]

export default function KousuanPage() {
  const [count, setCount] = useState<CountOption>(10)
  const [selectedTypes, setSelectedTypes] = useState<KousuanType[]>(ALL_TYPES)
  const [problems, setProblems] = useState<KousuanProblem[]>([])
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<{ correct: number; total: number; percentage: number } | null>(null)
  const [generating, setGenerating] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0) // 秒
  const [timerActive, setTimerActive] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | '自定义'>('自定义')
  const [showPrintDialog, setShowPrintDialog] = useState(false)
  const [useNumberPad, setUseNumberPad] = useState(false)
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 初始化生成题目
  useEffect(() => {
    console.log('Initial generate, count=', count, 'selectedTypes=', selectedTypes.length)
    generateNewProblems()
  }, [])

  // 计时器效果
  useEffect(() => {
    if (timerActive && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [timerActive, submitted])

  // 开始计时
  const startTimer = () => {
    setTimeElapsed(0)
    setTimerActive(true)
  }

  // 停止计时
  const stopTimer = () => {
    setTimerActive(false)
  }

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const generateNewProblems = () => {
    console.log('generateNewProblems', count, selectedTypes)
    setGenerating(true)
    const newProblems = generateKousuanProblems(count, selectedTypes)
    console.log('newProblems', newProblems)
    setProblems(newProblems)
    setUserAnswers(newProblems.map(() => ''))
    setSubmitted(false)
    setScore(null)
    setTimeElapsed(0)
    setTimerActive(false)
    setGenerating(false)
  }

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[index] = value
    setUserAnswers(newAnswers)
  }

  const handleNumberPadInput = (value: string) => {
    if (activeInputIndex === null) return
    const newAnswers = [...userAnswers]
    newAnswers[activeInputIndex] = (newAnswers[activeInputIndex] || '') + value
    setUserAnswers(newAnswers)
  }

  const handleNumberPadDelete = () => {
    if (activeInputIndex === null) return
    const newAnswers = [...userAnswers]
    newAnswers[activeInputIndex] = newAnswers[activeInputIndex].slice(0, -1)
    setUserAnswers(newAnswers)
  }

  const handleNumberPadClear = () => {
    if (activeInputIndex === null) return
    const newAnswers = [...userAnswers]
    newAnswers[activeInputIndex] = ''
    setUserAnswers(newAnswers)
  }

  const handleSubmit = () => {
    stopTimer()
    const updatedProblems = problems.map((p, idx) => {
      const userAns = userAnswers[idx].trim()
      const correct = userAns === String(p.answer)
      return { ...p, userAnswer: userAns, correct }
    })
    setProblems(updatedProblems)
    setSubmitted(true)
    const calculated = calculateScore(updatedProblems)
    setScore(calculated)
    
    // 播放音效
    playSound(calculated.percentage >= 80 ? 'success' : 'complete')
  }

  const toggleType = (type: KousuanType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
    setSelectedDifficulty('自定义')
  }

  const selectAllTypes = () => {
    setSelectedTypes(ALL_TYPES)
    setSelectedDifficulty('自定义')
  }

  const clearAllTypes = () => {
    setSelectedTypes([])
    setSelectedDifficulty('自定义')
  }

  // 选择难度等级
  const selectDifficulty = (level: DifficultyLevel) => {
    setSelectedDifficulty(level)
    setSelectedTypes(DIFFICULTY_LEVELS[level])
  }

  // 播放音效
  const playSound = (type: 'correct' | 'wrong' | 'success' | 'complete') => {
    // 在实际应用中，这里会播放音效
    // 为了简化，我们只记录日志
    console.log(`播放音效: ${type}`)
  }

  // 打印题目
  const handlePrint = () => {
    setShowPrintDialog(true)
    // 在实际应用中，这里会打开打印对话框
    setTimeout(() => {
      window.print()
      setShowPrintDialog(false)
    }, 100)
  }

  // 计算进度
  const progress = problems.length > 0 
    ? Math.round((userAnswers.filter(a => a !== '').length / problems.length) * 100)
    : 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2"><span className="text-gradient">口算题练习</span></h1>
          <p className="text-gray-600 dark:text-gray-300">涵盖25种加减法类型，适合5-8岁儿童巩固计算能力</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧控制面板 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6 slide-in-up">
              <h2 className="text-xl font-bold mb-4">📊 出题设置</h2>
              
              {/* 计时器 */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">⏱️ 计时器</h3>
                    <div className="text-2xl font-bold text-gradient mt-1">{formatTime(timeElapsed)}</div>
                  </div>
                  <div className="flex gap-2">
                    {!timerActive && !submitted && problems.length > 0 && (
                      <button
                        onClick={startTimer}
                        className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition btn-hover"
                      >
                        开始计时
                      </button>
                    )}
                    {timerActive && (
                      <button
                        onClick={stopTimer}
                        className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition btn-hover"
                      >
                        停止计时
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">题目数量</h3>
                <div className="flex flex-wrap gap-2">
                  {COUNT_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setCount(opt)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all btn-hover ${count === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                      {opt}题
                    </button>
                  ))}
                </div>
              </div>

              {/* 输入方式选择 */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">输入方式</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUseNumberPad(false)}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-medium border transition-all btn-hover ${!useNumberPad ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    ⌨️ 系统键盘
                  </button>
                  <button
                    onClick={() => setUseNumberPad(true)}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-medium border transition-all btn-hover ${useNumberPad ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    🔢 数字小键盘
                  </button>
                </div>
              </div>

              {/* 难度选择 */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">难度等级</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(['初级', '中级', '高级', '自定义'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => level === '自定义' ? setSelectedDifficulty('自定义') : selectDifficulty(level)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all btn-hover ${selectedDifficulty === level ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {selectedDifficulty !== '自定义' ? `已选择 ${selectedDifficulty} 难度 (${DIFFICULTY_LEVELS[selectedDifficulty].length} 种类型)` : '自定义选择类型'}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">题目类型</h3>
                  <div className="flex gap-2">
                    <button onClick={selectAllTypes} className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800 hover:bg-green-200 btn-hover">全选</button>
                    <button onClick={clearAllTypes} className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-800 hover:bg-red-200 btn-hover">清空</button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">已选择 {selectedTypes.length} 种类型</p>
                <div className="max-h-60 overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 gap-2">
                    {ALL_TYPES.map(type => {
                      const difficulty = Object.entries(DIFFICULTY_LEVELS).find(([_, types]) => 
                        types.includes(type)
                      )?.[0] as DifficultyLevel | undefined
                      
                      return (
                        <label key={type} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => toggleType(type)}
                            className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm flex-grow">{type}</span>
                          {difficulty && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              difficulty === '初级' ? 'bg-green-100 text-green-800' :
                              difficulty === '中级' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {difficulty}
                            </span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={generateNewProblems}
                  disabled={generating || selectedTypes.length === 0}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
                >
                  {generating ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      生成中...
                    </span>
                  ) : '生成新题目'}
                </button>
                
                {/* 进度条 */}
                {problems.length > 0 && !submitted && (
                  <div className="mt-2 mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>答题进度</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleSubmit}
                  disabled={submitted || userAnswers.some(a => a === '')}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
                >
                  {submitted ? '已提交' : '提交答案'}
                </button>
                
                <button
                  onClick={handlePrint}
                  disabled={problems.length === 0}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
                >
                  🖨️ 打印题目
                </button>
                
                {submitted && score && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 celebration">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">{score.percentage}%</div>
                      <div className="text-gray-600 dark:text-gray-300">正确率</div>
                      <div className="mt-2 text-sm">
                        答对 <span className="font-bold text-green-600">{score.correct}</span> 题 / 共 <span className="font-bold">{score.total}</span> 题
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        用时: {formatTime(timeElapsed)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 fade-in">
              <h3 className="font-bold mb-2">📝 使用说明</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-center mr-2 flex-shrink-0">1</span>
                  <span>选择题目数量（10-50题）和难度等级</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-green-100 text-green-800 rounded-full text-center mr-2 flex-shrink-0">2</span>
                  <span>选择题目类型或使用预设难度</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full text-center mr-2 flex-shrink-0">3</span>
                  <span>点击"生成新题目"开始练习</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-purple-100 text-purple-800 rounded-full text-center mr-2 flex-shrink-0">4</span>
                  <span>在右侧输入答案，可点击"开始计时"记录时间</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-red-100 text-red-800 rounded-full text-center mr-2 flex-shrink-0">5</span>
                  <span>完成后点击"提交答案"查看成绩</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-indigo-100 text-indigo-800 rounded-full text-center mr-2 flex-shrink-0">6</span>
                  <span>绿色表示正确，红色表示错误，可打印题目</span>
                </li>
              </ul>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-2">🎯 难度说明</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm">初级：5-10以内加减法</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                    <span className="text-sm">中级：20以内加减法及填括号</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <span className="text-sm">高级：进位退位及100以内加减法</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧题目区域 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 slide-in-up">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold">📝 口算题</h2>
                  <div className="text-sm text-gray-500 mt-1">
                    共 <span className="font-bold">{problems.length}</span> 题
                    {!submitted && problems.length > 0 && (
                      <span className="ml-3">
                        已答: <span className="font-bold text-blue-600">{userAnswers.filter(a => a !== '').length}</span> 题
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {problems.length > 0 && !submitted && (
                    <div className="flex items-center bg-blue-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">进度:</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold ml-2">{progress}%</span>
                    </div>
                  )}
                  
                  {timerActive && (
                    <div className="flex items-center bg-purple-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">⏱️</span>
                      <span className="font-bold">{formatTime(timeElapsed)}</span>
                    </div>
                  )}
                  
                  {submitted && score && (
                    <div className="flex items-center bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 px-3 py-2 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">成绩:</span>
                      <span className="font-bold text-green-600">{score.percentage}%</span>
                    </div>
                  )}
                </div>
              </div>

              {problems.length === 0 ? (
                <div className="text-center py-16 text-gray-500 fade-in">
                  <div className="text-6xl mb-6 animate-bounce">🧮</div>
                  <p className="text-xl mb-2">还没有题目哦</p>
                  <p className="text-gray-400">点击左侧的"生成新题目"开始练习吧！</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {problems.map((problem, idx) => {
                    const isCorrect = submitted && problem.correct
                    const isWrong = submitted && problem.correct === false
                    const difficulty = Object.entries(DIFFICULTY_LEVELS).find(([_, types]) => 
                      types.includes(problem.type)
                    )?.[0] as DifficultyLevel | undefined
                    
                    return (
                      <div
                        key={idx}
                        onClick={() => useNumberPad && !submitted && setActiveInputIndex(idx)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-green-100 dark:shadow-green-900/30' : isWrong ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-red-100 dark:shadow-red-900/30' : activeInputIndex === idx && useNumberPad ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-300' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'} ${useNumberPad && !submitted ? 'cursor-pointer' : ''}`}
                      >
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold mr-3 ${
                            difficulty === '初级' ? 'bg-green-100 text-green-800' :
                            difficulty === '中级' ? 'bg-yellow-100 text-yellow-800' :
                            difficulty === '高级' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {idx + 1}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-lg font-semibold mb-1">{problem.question}</div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    {problem.type}
                                  </span>
                                  {difficulty && (
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      difficulty === '初级' ? 'bg-green-100 text-green-800' :
                                      difficulty === '中级' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {difficulty}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {submitted && (
                                <div className={`text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                  {isCorrect ? '✓' : '✗'}
                                </div>
                              )}
                            </div>
                            <div className="mt-3">
                              <input
                                type="text"
                                value={userAnswers[idx]}
                                onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                onFocus={() => !useNumberPad && setActiveInputIndex(idx)}
                                disabled={submitted}
                                readOnly={useNumberPad && !submitted}
                                className={`w-full px-4 py-2 rounded-lg border ${isCorrect ? 'border-green-500 bg-green-50' : isWrong ? 'border-red-500 bg-red-50' : activeInputIndex === idx ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'} dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${useNumberPad && !submitted ? 'cursor-pointer pointer-events-none' : ''}`}
                                placeholder={useNumberPad ? "点击题目卡片输入" : "输入答案"}
                              />
                              {submitted && (
                                <div className="mt-2 text-sm">
                                  <span className="text-gray-600">你的答案: </span>
                                  <span className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                    {problem.userAnswer || '未填写'}
                                  </span>
                                  {!isCorrect && (
                                    <span className="ml-3 text-gray-600">
                                      正确答案: <span className="font-bold text-blue-600">{problem.answer}</span>
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {problems.length > 0 && !submitted && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={userAnswers.some(a => a === '')}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
                  >
                    提交答案
                  </button>
                  <p className="mt-2 text-sm text-gray-500">
                    {userAnswers.filter(a => a !== '').length} / {problems.length} 题已填写
                  </p>
                </div>
              )}

              {submitted && score && (
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 celebration">
                  <div className="text-center">
                    <div className="text-4xl mb-4">
                      {score.percentage >= 90 ? '🎉' : score.percentage >= 70 ? '👍' : '💪'}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">练习完成！</h3>
                    <div className="text-5xl font-bold text-gradient bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-2">
                      {score.percentage}%
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      答对 <span className="font-bold text-green-600">{score.correct}</span> 题，共 {score.total} 题
                    </p>
                    <div className="text-sm text-gray-500 mb-4">
                      用时: {formatTime(timeElapsed)}
                    </div>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={generateNewProblems}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition btn-hover"
                      >
                        再来一组
                      </button>
                      <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 text-white hover:opacity-90 transition btn-hover"
                      >
                        回到顶部
                      </button>
                      <button
                        onClick={handlePrint}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition btn-hover"
                      >
                        打印题目
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 悬浮数字小键盘 */}
      {useNumberPad && activeInputIndex !== null && !submitted && (
        <NumberPad
          show={true}
          onInput={handleNumberPadInput}
          onDelete={handleNumberPadDelete}
          onClear={handleNumberPadClear}
          onClose={() => setActiveInputIndex(null)}
          currentValue={userAnswers[activeInputIndex] || ''}
          questionNumber={activeInputIndex + 1}
        />
      )}
    </main>
  )
}
