'use client'

import { useState, useCallback, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import HanziCharacter from '@/components/HanziCharacter'
import CharacterInfo from '@/components/CharacterInfo'
import { fetchCharacterData } from '@/lib/api'

export default function Home() {
  const [character, setCharacter] = useState<string>('')
  const [characterData, setCharacterData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // 检测移动端
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

    // 如果输入的是词组，取第一个字
    const firstChar = char.trim()[0]
    
    // 验证是否为汉字
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-6xl">
        {/* 头部标题 */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-2">
            字趣 AI
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
            智能化、可视化的汉字学习平台
          </p>
        </div>

        {/* 搜索栏 */}
        <div className="mb-6 md:mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm md:text-base">
            {error}
          </div>
        )}

        {/* 内容区域 */}
        {character && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* 左侧：笔画动画 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
              <HanziCharacter 
                char={character} 
                size={isMobile ? 250 : 300}
                loading={loading}
              />
            </div>

            {/* 右侧：汉字信息 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
              {loading ? (
                <div className="flex items-center justify-center h-48 md:h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : characterData ? (
                <CharacterInfo data={characterData} />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8 md:py-12 text-sm md:text-base">
                  请输入汉字开始学习
                </div>
              )}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!character && !loading && (
          <div className="text-center py-12 md:py-16">
            <div className="text-5xl md:text-6xl mb-4">📚</div>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 px-4">
              在上方输入一个汉字，开始你的学习之旅
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
