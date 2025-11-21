import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SearchBar from '@/components/SearchBar'

describe('SearchBar', () => {
  const mockOnSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('应该渲染搜索框', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    expect(screen.getByPlaceholderText(/输入一个汉字/)).toBeInTheDocument()
  })

  it('应该在输入后500ms触发搜索（防抖）', async () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const input = screen.getByPlaceholderText(/输入一个汉字/)

    fireEvent.change(input, { target: { value: '猫' } })
    
    expect(mockOnSearch).not.toHaveBeenCalled()
    
    jest.advanceTimersByTime(500)
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('猫')
    })
  })

  it('应该显示加载状态', () => {
    render(<SearchBar onSearch={mockOnSearch} loading={true} />)
    const input = screen.getByPlaceholderText(/输入一个汉字/)
    expect(input).toBeDisabled()
  })

  it('应该在提交表单时触发搜索', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const input = screen.getByPlaceholderText(/输入一个汉字/)
    const form = input.closest('form')

    fireEvent.change(input, { target: { value: '火' } })
    fireEvent.submit(form!)

    expect(mockOnSearch).toHaveBeenCalledWith('火')
  })
})

