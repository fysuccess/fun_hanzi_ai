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
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入一个汉字，例如：猫、火、休..."
          className="w-full px-4 md:px-6 py-3 md:py-4 pl-12 md:pl-14 text-base md:text-lg border-2 border-gray-300 dark:border-gray-600 rounded-full 
                     focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     placeholder-gray-400 dark:placeholder-gray-500
                     transition-colors duration-200"
          disabled={loading}
        />
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        {loading && (
          <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
        支持常用3500字查询，输入词组将自动解析第一个字
      </p>
    </form>
  )
}

