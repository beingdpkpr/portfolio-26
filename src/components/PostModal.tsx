import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { BlogPost } from '../types'

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

  useEffect(() => {
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => {
      document.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(8,8,10,0.94)', backdropFilter: 'blur(16px)', overflow: 'auto' }}
      onClick={onClose}
    >
      <div
        style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px 120px' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 56 }}>
          <button
            ref={closeRef}
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', padding: 0, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#555')}
          >← Close</button>
          <button
            onClick={copyLink}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 14px', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
          >Copy Link</button>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#555', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{post.tag}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#444' }}>{post.date}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#333' }}>{post.readTime}</span>
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(24px,3vw,40px)', color: '#fff', margin: '0 0 56px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          {post.title}
        </h1>

        <div className="article-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        {(prev || next) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginTop: 80, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 40 }}>
            {prev ? (
              <button
                onClick={() => navigate(`/blog/${prev.slug}`)}
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', padding: 24, textAlign: 'left', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#444', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>← Previous</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: '#fff', lineHeight: 1.3 }}>{prev.title}</div>
              </button>
            ) : <div />}
            {next ? (
              <button
                onClick={() => navigate(`/blog/${next.slug}`)}
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', padding: 24, textAlign: 'right', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#444', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Next →</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: '#fff', lineHeight: 1.3 }}>{next.title}</div>
              </button>
            ) : <div />}
          </div>
        )}
      </div>
    </div>
  )
}
