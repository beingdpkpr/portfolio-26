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
          background: copied ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer',
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          color: copied ? '#fff' : '#555',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '4px 10px',
          transition: 'all 0.2s',
          zIndex: 1,
        }}
        onMouseEnter={e => { if (!copied) e.currentTarget.style.color = '#ccc' }}
        onMouseLeave={e => { if (!copied) e.currentTarget.style.color = '#555' }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className={className}><code>{children}</code></pre>
    </div>
  )
}
