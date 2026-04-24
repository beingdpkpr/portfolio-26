import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

function mockMatchMedia(prefersLight: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: prefersLight && query === '(prefers-color-scheme: light)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  })
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    mockMatchMedia(false)
  })

  it('defaults to dark when no preference stored', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
  })

  it('reads saved light theme from localStorage', () => {
    localStorage.setItem('dp_theme', 'light')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('toggles dark→light and persists to localStorage', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('light')
    expect(localStorage.getItem('dp_theme')).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('toggles light→dark and removes data-theme attribute', () => {
    localStorage.setItem('dp_theme', 'light')
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
  })

  it('detects prefers-color-scheme: light when no localStorage', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })
})
