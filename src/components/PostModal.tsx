import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { BlogPost } from '../types'
import { CodeBlock } from './CodeBlock'

interface PostModalProps {
  post: BlogPost
  posts: BlogPost[]
  onClose: () => void
}

export function PostModal({ post, posts, onClose }: PostModalProps) {
  const navigate = useNavigate()
  const closeRef = useRef<HTMLButtonElement>(null)
  const idx = posts.findIndex(p => p.slug === post.slug)
  const prev = posts[idx - 1]
  const next = posts[idx + 1]

  const scrollRef = useRef<HTMLDivElement>(null)
  const [progressFraction, setProgressFraction] = useState(0)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const pct = el.scrollTop / (el.scrollHeight - el.clientHeight)
    setProgressFraction(isNaN(pct) ? 0 : Math.min(1, pct))
  }

  useEffect(() => {
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose])

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
    setProgressFraction(0)
  }, [post.slug])

  const copyLink = () => { navigator.clipboard.writeText(window.location.href).catch(() => {}) }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'var(--bg-overlay)', backdropFilter: 'blur(16px)', overflow: 'auto' }}
      onClick={onClose}
    >
      <div style={{ position: 'sticky', top: 0, zIndex: 1, height: 2, background: 'var(--surf-hi)' }}>
        <div
          data-testid="progress-bar"
          style={{ height: '100%', width: `${progressFraction * 100}%`, background: 'var(--fg)', transition: 'width 0.1s linear' }}
        />
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px 120px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 56 }}>
          <button ref={closeRef} onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-lo)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: 0, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-lo)')}>← Close</button>
          <button onClick={copyLink}
            style={{ background: 'none', border: '1px solid var(--line-mid)', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-lo)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 14px', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = 'var(--line-hi)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-lo)'; e.currentTarget.style.borderColor = 'var(--line-mid)' }}>Copy Link</button>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'var(--text-lo)', border: '1px solid var(--line-mid)', padding: '2px 8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{post.tag}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-dim)' }}>{post.date}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--text-ghost)' }}>{post.readTime}</span>
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(24px,3vw,40px)', color: 'var(--fg)', margin: '0 0 56px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          {post.title}
        </h1>

        <div className="article-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            pre: ({ children }) => {
              const code = (children as React.ReactElement)?.props
              return <CodeBlock className={code?.className}>{code?.children}</CodeBlock>
            },
          }}>{post.content}</ReactMarkdown>
        </div>

        {(prev || next) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginTop: 80, borderTop: '1px solid var(--line)', paddingTop: 40 }}>
            {prev ? (
              <button onClick={() => navigate(`/blog/${prev.slug}`)}
                style={{ background: 'none', border: '1px solid var(--line)', cursor: 'pointer', padding: 24, textAlign: 'left', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surf)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>← Previous</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: 'var(--fg)', lineHeight: 1.3 }}>{prev.title}</div>
              </button>
            ) : <div />}
            {next ? (
              <button onClick={() => navigate(`/blog/${next.slug}`)}
                style={{ background: 'none', border: '1px solid var(--line)', cursor: 'pointer', padding: 24, textAlign: 'right', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surf)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Next →</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: 'var(--fg)', lineHeight: 1.3 }}>{next.title}</div>
              </button>
            ) : <div />}
          </div>
        )}
      </div>
    </div>
  )
}
