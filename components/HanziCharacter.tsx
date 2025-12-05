'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, PenTool } from 'lucide-react'

interface HanziCharacterProps {
  char: string
  size?: number
  loading?: boolean
}

export default function HanziCharacter({ char, size = 300, loading = false }: HanziCharacterProps) {
  const writerRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isQuizMode, setIsQuizMode] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [actualSize, setActualSize] = useState(size)

  // 响应式调整大小
  useEffect(() => {
    const updateSize = () => {
      if (typeof window !== 'undefined') {
        const isMobile = window.innerWidth < 768
        setActualSize(isMobile ? Math.min(size, 250) : size)
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [size])

  useEffect(() => {
    if (!writerRef.current || !char || loading) return

    // 清理之前的实例
    if (instanceRef.current) {
      // 尝试停止动画
      if (typeof instanceRef.current.cancelAnimation === 'function') {
        instanceRef.current.cancelAnimation()
      } else if (typeof instanceRef.current.stopCharacterAnimation === 'function') {
        instanceRef.current.stopCharacterAnimation()
      }
      instanceRef.current = null
    }
    
    // 清空之前的内容
    if (writerRef.current) {
      writerRef.current.innerHTML = ''
    }

    // 动态导入hanzi-writer
    import('hanzi-writer').then((HanziWriter) => {
      // 再次检查，确保在异步操作期间ref仍然有效
      if (writerRef.current && !instanceRef.current) {
        instanceRef.current = HanziWriter.default.create(writerRef.current, char, {
          width: actualSize,
          height: actualSize,
          padding: 10,
          showOutline: true,
          strokeAnimationSpeed: speed,
          delayBetweenStrokes: 200 / speed,
          radicalColor: '#e74c3c',
          outlineColor: '#ddd',
          strokeColor: '#333',
        })

        // 自动播放动画（仅在非quiz模式）
        if (!isQuizMode) {
          instanceRef.current.loopCharacterAnimation()
          setIsPlaying(true)
        }
        
        // 尝试监听动画完成事件（如果API支持）
        if (instanceRef.current && typeof instanceRef.current.on === 'function') {
          instanceRef.current.on('complete', () => {
            setIsPlaying(false)
          })
        }
      }
    }).catch((err) => {
      console.error('Failed to load hanzi-writer:', err)
    })

    return () => {
      // 清理函数：停止动画并清空内容
      if (instanceRef.current) {
        // 清理高亮定时器和观察器
        const highlightInterval = (instanceRef.current as any).__highlightInterval
        if (highlightInterval) {
          clearInterval(highlightInterval)
        }
        const observer = (instanceRef.current as any).__highlightObserver
        if (observer) {
          observer.disconnect()
        }
        
        if (typeof instanceRef.current.cancelAnimation === 'function') {
          instanceRef.current.cancelAnimation()
        } else if (typeof instanceRef.current.stopCharacterAnimation === 'function') {
          instanceRef.current.stopCharacterAnimation()
        }
        instanceRef.current = null
      }
      if (writerRef.current) {
        writerRef.current.innerHTML = ''
      }
    }
  }, [char, actualSize, loading, speed, isQuizMode])

  const handlePlay = () => {
    if (instanceRef.current) {
      instanceRef.current.animateCharacter()
      setIsPlaying(true)
      // 如果支持事件监听，监听完成事件
      if (typeof instanceRef.current.on === 'function') {
        instanceRef.current.on('complete', () => {
          setIsPlaying(false)
        })
      } else {
        // 否则使用估算时间
        const estimatedDuration = 3000 / speed
        setTimeout(() => {
          setIsPlaying(false)
        }, estimatedDuration)
      }
    }
  }

  const handlePause = () => {
    if (instanceRef.current) {
      // 检查方法是否存在
      if (typeof instanceRef.current.cancelAnimation === 'function') {
        instanceRef.current.cancelAnimation()
      } else if (typeof instanceRef.current.stopCharacterAnimation === 'function') {
        instanceRef.current.stopCharacterAnimation()
      } else {
        // 如果都不支持，清空并重新创建
        if (writerRef.current) {
          writerRef.current.innerHTML = ''
        }
      }
      setIsPlaying(false)
    }
  }

  const handleReplay = () => {
    if (instanceRef.current) {
      instanceRef.current.animateCharacter()
      setIsPlaying(true)
      // 如果支持事件监听，监听完成事件
      if (typeof instanceRef.current.on === 'function') {
        instanceRef.current.on('complete', () => {
          setIsPlaying(false)
        })
      } else {
        // 否则使用估算时间
        const estimatedDuration = 3000 / speed
        setTimeout(() => {
          setIsPlaying(false)
        }, estimatedDuration)
      }
    }
  }

  const handleQuiz = () => {
    if (instanceRef.current && writerRef.current) {
      setIsQuizMode(true)
      setIsPlaying(false)
      
      // 停止当前动画（如果方法存在）
      if (typeof instanceRef.current.cancelAnimation === 'function') {
        instanceRef.current.cancelAnimation()
      } else if (typeof instanceRef.current.stopCharacterAnimation === 'function') {
        instanceRef.current.stopCharacterAnimation()
      }
      
      // 清空并重新初始化以进入quiz模式
      writerRef.current.innerHTML = ''
      
      // 重新导入并创建quiz实例
      import('hanzi-writer').then((HanziWriter) => {
        if (writerRef.current) {
          instanceRef.current = HanziWriter.default.create(writerRef.current, char, {
            width: actualSize,
            height: actualSize,
            padding: 10,
            showOutline: true,
            radicalColor: '#e74c3c',
            outlineColor: '#ddd',
            strokeColor: '#333',
          })
          
          // 启动quiz模式，添加高亮当前笔画的效果
          const quizOptions: any = {
            showHintAfterMisses: 0, // 立即显示提示
            highlightOnComplete: true, // 完成时高亮
            highlightColor: '#4CAF50', // 完成时的颜色
            onComplete: () => {
              // 写对了
              if (writerRef.current) {
                writerRef.current.classList.add('celebration')
                setTimeout(() => {
                  writerRef.current?.classList.remove('celebration')
                }, 500)
              }
            },
            onMistake: () => {
              // 写错了
              if (writerRef.current) {
                writerRef.current.classList.add('shake')
                setTimeout(() => {
                  writerRef.current?.classList.remove('shake')
                }, 500)
              }
            },
          }
          
          // 添加高亮当前笔画的功能
          const writerInstance = instanceRef.current
          if (writerInstance && writerRef.current) {
            // 等待SVG渲染完成
            setTimeout(() => {
              const highlightCurrentStroke = () => {
                if (!writerRef.current || !isQuizMode) return
                
                const svg = writerRef.current.querySelector('svg')
                if (!svg) return
                
                // 移除之前的高亮
                const prevHighlights = svg.querySelectorAll('.current-stroke-highlight')
                prevHighlights.forEach((el) => {
                  const path = el as SVGPathElement
                  path.style.stroke = ''
                  path.style.strokeWidth = ''
                  path.style.filter = ''
                  path.style.opacity = ''
                  path.classList.remove('current-stroke-highlight')
                })
                
                // 查找所有笔画路径（排除背景网格线）
                const allPaths = Array.from(svg.querySelectorAll('path')).filter(path => {
                  // 排除可能是网格线的路径（通常很短或很细）
                  const pathEl = path as SVGPathElement
                  const d = pathEl.getAttribute('d') || ''
                  return d.length > 10 // 只处理真正的笔画路径
                })
                
                // 找到第一个未完成的笔画
                let found = false
                for (let i = 0; i < allPaths.length; i++) {
                  const path = allPaths[i] as SVGPathElement
                  
                  // 跳过已经高亮的笔画
                  if (path.classList.contains('current-stroke-highlight')) {
                    continue
                  }
                  
                  // 获取路径的实际属性
                  const strokeAttr = path.getAttribute('stroke')
                  const strokeWidthAttr = path.getAttribute('stroke-width')
                  const computedStyle = window.getComputedStyle(path)
                  const stroke = computedStyle.stroke || strokeAttr
                  const opacity = parseFloat(computedStyle.opacity) || 1
                  
                  // 检查是否是未完成的笔画
                  // 未完成的笔画通常是：灰色(#ddd, rgb(221,221,221))、浅色或低透明度
                  const isGray = stroke && (
                    stroke.includes('221, 221, 221') ||
                    stroke.includes('200, 200, 200') ||
                    stroke.includes('187, 187, 187') ||
                    stroke.toLowerCase().includes('gray') ||
                    stroke === '#ddd' ||
                    stroke === '#dddddd' ||
                    stroke === 'rgb(221, 221, 221)' ||
                    stroke === 'rgb(200, 200, 200)'
                  )
                  
                  const isUnfinished = isGray || opacity < 0.9
                  
                  if (isUnfinished) {
                    // 高亮这个笔画 - 使用更明显的效果
                    path.setAttribute('stroke', '#FF6B6B')
                    path.setAttribute('stroke-width', '6')
                    path.style.stroke = '#FF6B6B'
                    path.style.strokeWidth = '6'
                    path.style.filter = 'drop-shadow(0px 0px 12px rgba(255, 107, 107, 1))'
                    path.style.opacity = '1'
                    path.style.transition = 'all 0.3s ease'
                    path.style.animation = 'stroke-pulse 1.5s ease-in-out infinite'
                    path.classList.add('current-stroke-highlight')
                    found = true
                    break // 只高亮第一个未完成的笔画
                  }
                }
                
                // 如果没找到未完成的笔画，高亮第一个笔画（可能是所有笔画都已完成，重新开始）
                if (!found && allPaths.length > 0) {
                  const firstPath = allPaths[0] as SVGPathElement
                  firstPath.setAttribute('stroke', '#FF6B6B')
                  firstPath.setAttribute('stroke-width', '6')
                  firstPath.style.stroke = '#FF6B6B'
                  firstPath.style.strokeWidth = '6'
                  firstPath.style.filter = 'drop-shadow(0px 0px 12px rgba(255, 107, 107, 1))'
                  firstPath.style.opacity = '1'
                  firstPath.style.transition = 'all 0.3s ease'
                  firstPath.style.animation = 'stroke-pulse 1.5s ease-in-out infinite'
                  firstPath.classList.add('current-stroke-highlight')
                }
              }
              
              // 立即执行一次
              highlightCurrentStroke()
              
              // 使用MutationObserver监听SVG变化
              const observer = new MutationObserver(() => {
                highlightCurrentStroke()
              })
              
              const svg = writerRef.current.querySelector('svg')
              if (svg) {
                observer.observe(svg, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['style', 'class']
                })
                
                // 也使用定时器作为备用（每500ms检查一次）
                const highlightInterval = setInterval(() => {
                  if (!writerRef.current || !isQuizMode) {
                    clearInterval(highlightInterval)
                    observer.disconnect()
                    return
                  }
                  highlightCurrentStroke()
                }, 500)
                
                // 保存以便清理
                ;(writerInstance as any).__highlightInterval = highlightInterval
                ;(writerInstance as any).__highlightObserver = observer
              }
            }, 500) // 等待500ms确保SVG已渲染
          }
          
          instanceRef.current.quiz(quizOptions)
        }
      }).catch((err) => {
        console.error('Failed to load hanzi-writer for quiz:', err)
        setIsQuizMode(false)
      })
    }
  }

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">笔顺演示</h2>
      
      {/* 田字格背景容器 */}
      <div 
        ref={writerRef} 
        className="tian-zi-ge border-2 border-red-400 rounded-lg bg-white dark:bg-gray-900 mx-auto"
        style={{ width: actualSize, height: actualSize, maxWidth: '100%' }}
      />

      {/* 控制按钮 */}
      <div className="mt-4 md:mt-6 flex flex-wrap gap-2 md:gap-3 justify-center">
        {!isQuizMode ? (
          <>
            {isPlaying ? (
            <button
              onClick={handlePause}
              className="px-3 md:px-4 py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         transition-colors flex items-center gap-1 md:gap-2"
            >
              <Pause className="w-4 h-4" />
              <span className="hidden sm:inline">暂停</span>
            </button>
            ) : (
              <button
                onClick={handlePlay}
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         transition-colors flex items-center gap-1 md:gap-2"
              >
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">播放</span>
              </button>
            )}
            <button
              onClick={handleReplay}
              className="px-3 md:px-4 py-2 text-sm md:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 
                       transition-colors flex items-center gap-1 md:gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">重播</span>
            </button>
            <button
              onClick={handleQuiz}
              className="px-3 md:px-4 py-2 text-sm md:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                       transition-colors flex items-center gap-1 md:gap-2"
            >
              <PenTool className="w-4 h-4" />
              <span className="hidden sm:inline">描红练习</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              // 先清空内容并销毁当前实例
              if (instanceRef.current) {
                // 尝试停止动画
                if (typeof instanceRef.current.cancelAnimation === 'function') {
                  instanceRef.current.cancelAnimation()
                } else if (typeof instanceRef.current.stopCharacterAnimation === 'function') {
                  instanceRef.current.stopCharacterAnimation()
                }
                instanceRef.current = null
              }
              if (writerRef.current) {
                writerRef.current.innerHTML = ''
              }
              // 设置状态，让useEffect处理重新创建
              setIsQuizMode(false)
              setIsPlaying(false)
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
                     transition-colors"
          >
            退出练习模式
          </button>
        )}
      </div>

      {/* 速度控制 */}
      {!isQuizMode && (
        <div className="mt-3 md:mt-4 flex items-center gap-2 md:gap-3 flex-wrap justify-center">
          <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">速度：</span>
          <div className="flex gap-1 md:gap-2">
            {[0.5, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm transition-colors ${
                  speed === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

