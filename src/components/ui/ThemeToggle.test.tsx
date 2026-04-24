import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (q: string) => ({ matches: false, media: q, addEventListener: () => {}, removeEventListener: () => {} }),
  })
})

describe('ThemeToggle', () => {
  it('shows moon icon and correct aria-label in dark mode', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button', { name: /switch to light mode/i })
    expect(btn).toBeInTheDocument()
    expect(btn.textContent).toBe('🌙')
  })

  it('switches to sun icon after clicking', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button'))
    const btn = screen.getByRole('button', { name: /switch to dark mode/i })
    expect(btn.textContent).toBe('☀️')
  })
})
