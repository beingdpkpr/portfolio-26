import { useTheme } from '../../hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 1100,
        width: 44, height: 44, borderRadius: '50%',
        background: 'var(--surf-hover)',
        border: '1px solid var(--line)',
        cursor: 'pointer', fontSize: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surf-hi)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--surf-hover)')}
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
