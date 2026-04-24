import { useState } from 'react'

interface CodeBlockProps {
  children?: React.ReactNode
  className?: string
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const text = typeof children === 'string' ? children : String(children ?? '')

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }).catch(() => {})
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={copy}
        style={{
          position: 'absolute', top: 10, right: 10,
          background: copied ? 'var(--surf-hover)' : 'var(--surf)',
          border: '1px solid var(--line-mid)',
          cursor: 'pointer',
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          color: copied ? 'var(--fg)' : 'var(--text-mid)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '4px 10px',
          transition: 'all 0.2s',
          zIndex: 1,
        }}
        onMouseEnter={e => { if (!copied) e.currentTarget.style.color = 'var(--fg-dim)' }}
        onMouseLeave={e => { if (!copied) e.currentTarget.style.color = 'var(--text-mid)' }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className={className}><code>{children}</code></pre>
    </div>
  )
}
