'use client'

import { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  onSearch: (char: string) => void
  loading?: boolean
}

export default function SearchBar({ onSearch, loading = false }: SearchBarProps) {
  const [input, setInput] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 防抖处理
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (input.trim()) {
      timeoutRef.current = setTimeout(() => {
        onSearch(input)
      }, 500)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [input, onSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSearch(input)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入一个汉字，例如：猫、火、休..."
          className="w-full px-6 md:px-8 py-4 md:py-5 pl-14 md:pl-16 text-base md:text-lg 
                     border-2 border-gray-200 dark:border-gray-700 rounded-full 
                     focus:outline-none focus:border-purple-500 dark:focus:border-purple-400
                     focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     placeholder-gray-400 dark:placeholder-gray-500
                     shadow-lg hover:shadow-xl
                     transition-all duration-300
                     group-hover:border-purple-300 dark:group-hover:border-purple-600"
          disabled={loading}
        />
        <Search className="absolute left-5 md:left-6 top-1/2 transform -translate-y-1/2 
                          text-gray-400 dark:text-gray-500 w-5 h-5 md:w-6 md:h-6
                          group-focus-within:text-purple-500 transition-colors" />
        {loading && (
          <div className="absolute right-5 md:right-6 top-1/2 transform -translate-y-1/2">
            <div className="relative">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-200 dark:border-purple-800"></div>
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-purple-600 absolute top-0 left-0"></div>
            </div>
          </div>
        )}
      </div>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-2">
        <span>💡</span>
        <span>支持常用3500字查询，输入词组将自动解析第一个字</span>
      </p>
    </form>
  )
}

