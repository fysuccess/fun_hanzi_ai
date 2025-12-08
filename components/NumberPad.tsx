'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

interface NumberPadProps {
  onInput: (value: string) => void
  onDelete: () => void
  onClear: () => void
  onClose: () => void
  currentValue: string
  questionNumber: number
  show: boolean
}

export default function NumberPad({ 
  onInput, 
  onDelete, 
  onClear, 
  onClose, 
  currentValue, 
  questionNumber,
  show 
}: NumberPadProps) {
  const buttons = [
    '7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
    '0', '.', '/'
  ]

  const overlayRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: -1, y: -1 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  // 检测是否为移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 初始化位置
  useEffect(() => {
    if (show && overlayRef.current && position.x === -1) {
      const rect = overlayRef.current.getBoundingClientRect()
      if (isMobile) {
        // 手机端：底部居中
        const initialX = (window.innerWidth - rect.width) / 2
        const initialY = window.innerHeight - rect.height - 16
        setPosition({ x: initialX, y: initialY })
      } else {
        // 桌面端：右侧边缘
        const initialX = window.innerWidth - rect.width - 150
        const initialY = 100
        setPosition({ x: initialX, y: initialY })
      }
    }
  }, [show, isMobile])

  // 重置位置当关闭时
  useEffect(() => {
    if (!show) {
      setPosition({ x: -1, y: -1 })
    }
  }, [show])

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true)
    setDragStart({ x: clientX, y: clientY })
    setInitialPosition(position)
  }, [position])

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (isDragging) {
      const deltaX = clientX - dragStart.x
      const deltaY = clientY - dragStart.y
      
      const newX = initialPosition.x + deltaX
      const newY = initialPosition.y + deltaY
      
      // 限制在视窗内
      const maxX = window.innerWidth - (overlayRef.current?.offsetWidth || 0)
      const maxY = window.innerHeight - (overlayRef.current?.offsetHeight || 0)
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }
  }, [isDragging, dragStart, initialPosition])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // 鼠标事件
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      handleDragStart(e.clientX, e.clientY)
      e.preventDefault()
    }
  }

  // 触摸事件
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      const touch = e.touches[0]
      handleDragStart(touch.clientX, touch.clientY)
    }
  }

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0]
      handleDragMove(touch.clientX, touch.clientY)
      e.preventDefault()
    }
  }, [isDragging, handleDragMove])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleDragMove(e.clientX, e.clientY)
  }, [handleDragMove])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleDragEnd)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleDragEnd)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleDragEnd)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleDragEnd)
      }
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleDragEnd])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div 
        ref={overlayRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          left: position.x >= 0 ? `${position.x}px` : '50%',
          top: position.y >= 0 ? `${position.y}px` : (isMobile ? 'auto' : '100px'),
          bottom: position.y < 0 && isMobile ? '16px' : undefined,
          transform: position.x < 0 ? 'translateX(-50%)' : undefined,
        }}
        className={`fixed bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-6 w-56 sm:w-80 pointer-events-auto animate-in ${isMobile ? 'slide-in-from-bottom' : 'slide-in-from-right'} duration-300 ${isDragging ? 'cursor-grabbing' : ''}`}
      >
        {/* 标题栏（可拖动） */}
        <div className="flex justify-between items-center mb-2 sm:mb-4 drag-handle cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="text-gray-400 dark:text-gray-500 hidden sm:block">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="7" cy="5" r="1.5"/>
                <circle cx="13" cy="5" r="1.5"/>
                <circle cx="7" cy="10" r="1.5"/>
                <circle cx="13" cy="10" r="1.5"/>
                <circle cx="7" cy="15" r="1.5"/>
                <circle cx="13" cy="15" r="1.5"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-lg text-gray-800 dark:text-gray-100">
                第 {questionNumber} 题
              </h3>
              <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                拖动标题栏移动位置
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm sm:text-base"
          >
            ✕
          </button>
        </div>

        {/* 显示当前输入 */}
        <div className="mb-3 sm:mb-6 p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">当前答案</div>
            <div className="text-xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 min-h-[1.5rem] sm:min-h-[2.5rem] flex items-center justify-center">
              {currentValue || '_'}
            </div>
          </div>
        </div>

        {/* 数字键盘 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2 sm:mb-4">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => onInput(btn)}
              className="h-10 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 border sm:border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg active:scale-95 transition-all font-bold text-lg sm:text-2xl text-gray-800 dark:text-gray-100 shadow-sm"
            >
              {btn}
            </button>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <button
            onClick={onDelete}
            className="h-10 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all font-bold text-sm sm:text-base text-white shadow-md"
          >
            ←
          </button>
          <button
            onClick={onClear}
            className="col-span-2 h-10 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:scale-95 transition-all font-bold text-sm sm:text-base text-white shadow-md"
          >
            清空
          </button>
        </div>
      </div>
    </div>
  )
}
