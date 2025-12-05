'use client'

import { useState } from 'react'
import { Volume2, BookOpen, Lightbulb, FileText } from 'lucide-react'
import type { CharacterData } from '@/lib/api'

interface CharacterInfoProps {
  data: CharacterData
}

export default function CharacterInfo({ data }: CharacterInfoProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(data.char)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.8
      utterance.pitch = 1

      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)

      window.speechSynthesis.speak(utterance)
    } else {
      alert('您的浏览器不支持语音播放功能')
    }
  }

  return (
    <div className="space-y-5">
      {/* 汉字基本信息 - 优化设计 */}
      <div className="text-center pb-5 border-b-2 border-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800">
        <div className="flex items-center justify-center gap-4 mb-3">
          <span className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {data.char}
          </span>
          <button
            onClick={handlePlayAudio}
            disabled={isPlaying}
            className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 
                     rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50
                     hover:scale-110 btn-hover"
            title="播放发音"
          >
            <Volume2 className={`w-6 h-6 text-purple-600 dark:text-purple-400 ${isPlaying ? 'animate-pulse' : ''}`} />
          </button>
        </div>
        <div className="text-2xl md:text-3xl font-bold mb-3">
          <span className="text-gradient">{data.pinyin}</span>
        </div>
        {(data.radicals || data.stroke_count) && (
          <div className="flex items-center justify-center gap-4 text-sm">
            {data.radicals && (
              <span className="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 font-medium">
                部首：{data.radicals}
              </span>
            )}
            {data.stroke_count && (
              <span className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 font-medium">
                笔画：{data.stroke_count}
              </span>
            )}
          </div>
        )}
      </div>

      {/* AI 趣味记忆 - 增强设计 */}
      {data.ai_content?.story && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 
                       rounded-xl p-5 border-2 border-yellow-200 dark:border-yellow-800 shadow-md slide-in-up">
          <div className="flex items-start gap-3">
            <div className="text-2xl mt-0.5 flex-shrink-0">📖</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                字源故事
                <span className="text-xs px-2 py-0.5 bg-yellow-200 dark:bg-yellow-800 rounded-full">AI生成</span>
              </h3>
              <p className="text-yellow-800 dark:text-yellow-300 text-sm md:text-base leading-relaxed">
                {data.ai_content.story}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 巧记口诀 - 增强设计 */}
      {data.ai_content?.mnemonic && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 
                       rounded-xl p-5 border-2 border-green-200 dark:border-green-800 shadow-md slide-in-up"
          style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start gap-3">
            <div className="text-2xl mt-0.5 flex-shrink-0">💡</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-green-900 dark:text-green-200 mb-2">巧记口诀</h3>
              <p className="text-green-800 dark:text-green-300 text-sm md:text-base leading-relaxed font-medium 
                          bg-green-100 dark:bg-green-900/40 px-4 py-3 rounded-lg border-l-4 border-green-500">
                "{data.ai_content.mnemonic}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 组词 - 优化设计 */}
      {data.ai_content?.words && data.ai_content.words.length > 0 && (
        <div className="slide-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-xl">📝</span>
            常用组词
          </h3>
          <div className="flex flex-wrap gap-3">
            {data.ai_content.words.map((word, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-br from-purple-100 to-blue-100 
                         dark:from-purple-900/40 dark:to-blue-900/40 
                         text-purple-800 dark:text-purple-200 
                         rounded-full text-sm md:text-base font-medium shadow-sm
                         hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 例句 - 增强设计 */}
      {data.ai_content?.sentence && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 
                       rounded-xl p-5 border-2 border-indigo-200 dark:border-indigo-800 shadow-md slide-in-up"
          style={{ animationDelay: '0.3s' }}>
          <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-200 mb-3 flex items-center gap-2">
            <span className="text-xl">💬</span>
            生活例句
          </h3>
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
            <p className="text-indigo-900 dark:text-indigo-200 mb-2 text-sm md:text-base leading-relaxed font-medium">
              {data.ai_content.sentence}
            </p>
            {data.ai_content.sentence_pinyin && (
              <p className="text-indigo-600 dark:text-indigo-400 text-xs md:text-sm italic">
                {data.ai_content.sentence_pinyin}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

