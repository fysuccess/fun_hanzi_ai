'use client'

import { useState, useCallback, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import HanziCharacter from '@/components/HanziCharacter'
import CharacterInfo from '@/components/CharacterInfo'
import { fetchCharacterData } from '@/lib/api'

export default function HanziHome() {
  const [character, setCharacter] = useState<string>('')
  const [characterData, setCharacterData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSearch = useCallback(async (char: string) => {
    if (!char || char.trim() === '') {
      setError('请输入一个汉字')
      return
    }

    const firstChar = char.trim()[0]
    if (!/[\u4e00-\u9fa5]/.test(firstChar)) {
      setError('请输入一个有效的汉字')
      return
    }

    setCharacter(firstChar)
    setLoading(true)
    setError(null)

    try {
      const data = await fetchCharacterData(firstChar)
      setCharacterData(data)
    } catch (err: any) {
      setError(err.message || '获取汉字信息失败，请稍后重试')
      setCharacterData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
        <div className="text-center mb-8 md:mb-10 fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
            <span className="text-gradient">字趣 AI</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 font-medium">🎨 智能化、可视化的汉字学习平台</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">AI 驱动</span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">笔顺动画</span>
            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">趣味学习</span>
          </div>
          {/* 页面内不展示跨模块导航 */}
        </div>

        <div className="mb-8 md:mb-10">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {error && (
          <div className="mb-6 md:mb-8 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-lg text-sm md:text-base shadow-md slide-in-up">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {character && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="card slide-in-up p-6 md:p-8">
              <div className="mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <span className="text-2xl">✍️</span>
                  笔顺演示
                </h2>
              </div>
              <HanziCharacter char={character} size={isMobile ? 260 : 320} loading={loading} />
            </div>

            <div className="card slide-in-up p-6 md:p-8" style={{ animationDelay: '0.1s' }}>
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 md:h-80">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 dark:border-purple-800"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 absolute top-0 left-0"></div>
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">AI 正在生成内容...</p>
                </div>
              ) : characterData ? (
                <CharacterInfo data={characterData} />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-12 md:py-16 text-sm md:text-base">
                  <div className="text-4xl mb-3">🔍</div>
                  <p>请输入汉字开始学习</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!character && !loading && (
          <div className="text-center py-16 md:py-24 fade-in">
            <div className="mb-6 relative inline-block">
              <div className="text-7xl md:text-8xl pulse">📚</div>
              <div className="absolute -top-2 -right-2 text-3xl">✨</div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">开始你的汉字学习之旅</h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">在上方搜索框输入任意汉字，体验 AI 驱动的智能学习</p>
            {/* 移除跨页面跳转提示 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8">
              {['猫', '火', '休', '学'].map((char, index) => (
                <button
                  key={char}
                  onClick={() => handleSearch(char)}
                  className="group p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 btn-hover"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform">{char}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">点击学习</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
