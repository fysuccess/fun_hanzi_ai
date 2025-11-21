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
    <div className="space-y-6">
      {/* 汉字基本信息 */}
      <div className="text-center border-b pb-4">
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-2">
          <span className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            {data.char}
          </span>
          <button
            onClick={handlePlayAudio}
            disabled={isPlaying}
            className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full hover:bg-blue-200 
                     dark:hover:bg-blue-800 transition-colors disabled:opacity-50"
            title="播放发音"
          >
            <Volume2 className={`w-6 h-6 text-blue-600 dark:text-blue-400 ${isPlaying ? 'animate-pulse' : ''}`} />
          </button>
        </div>
        <div className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-semibold">
          {data.pinyin}
        </div>
        {(data.radicals || data.stroke_count) && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {data.radicals && <span>部首：{data.radicals}</span>}
            {data.radicals && data.stroke_count && <span className="mx-2">|</span>}
            {data.stroke_count && <span>笔画数：{data.stroke_count}</span>}
          </div>
        )}
      </div>

      {/* AI 趣味记忆 */}
      {data.ai_content?.story && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">字源故事</h3>
              <p className="text-yellow-800 dark:text-yellow-300 text-sm leading-relaxed">
                {data.ai_content.story}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 巧记口诀 */}
      {data.ai_content?.mnemonic && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">巧记口诀</h3>
              <p className="text-green-800 dark:text-green-300 text-sm leading-relaxed font-medium">
                {data.ai_content.mnemonic}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 组词 */}
      {data.ai_content?.words && data.ai_content.words.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            常用组词
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.ai_content.words.map((word, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 
                         rounded-full text-sm font-medium"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 例句 */}
      {data.ai_content?.sentence && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
          <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">生活例句</h3>
          <p className="text-indigo-800 dark:text-indigo-300 mb-2 text-sm leading-relaxed">
            {data.ai_content.sentence}
          </p>
          {data.ai_content.sentence_pinyin && (
            <p className="text-indigo-600 dark:text-indigo-400 text-xs">
              {data.ai_content.sentence_pinyin}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

