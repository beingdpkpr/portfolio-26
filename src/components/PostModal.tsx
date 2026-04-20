import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { BlogPost } from '../types'

interface PostModalProps {
  post: BlogPost
  allPosts: BlogPost[]
  onClose: () => void
}

export function PostModal({ post, allPosts, onClose }: PostModalProps) {
  const navigate = useNavigate()
  const idx = allPosts.findIndex(p => p.slug === post.slug)
  const prev = idx < allPosts.length - 1 ? allPosts[idx + 1] : null
  const next = idx > 0 ? allPosts[idx - 1] : null

  const close = useCallback(() => {
    navigate('/blog', { replace: true })
    onClose()
  }, [navigate, onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
    }
  }, [close])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => undefined)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0f0f11', border: '1px solid rgba(255,255,255,0.1)',
          maxWidth: 720, width: '100%', maxHeight: '85vh', overflowY: 'auto',
          padding: 'clamp(32px,5vw,64px)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <button
            autoFocus
            onClick={close}
            style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.1em', padding: 0 }}>
            ← BACK TO BLOG
          </button>
          <button
            onClick={copyLink}
            title="Copy link"
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#555', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.1em', padding: '5px 12px', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
            COPY LINK
          </button>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#555', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 10px', letterSpacing: '0.12em' }}>{post.tag}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#444' }}>{post.date}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#444' }}>{post.readTime}</span>
        </div>

        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(24px,3vw,36px)', color: '#fff', margin: '0 0 24px', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          {post.title}
        </h1>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: '#666', lineHeight: 1.8, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 32 }}>
          {post.excerpt}
        </p>

        {/* Body */}
        <div className="article-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        {/* Prev / Next */}
        {(prev || next) && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            {prev ? (
              <button onClick={() => navigate(`/blog/${prev.slug}`)} style={{
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0,
              }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#444', letterSpacing: '0.12em', marginBottom: 6 }}>← PREVIOUS</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: '#888' }}>{prev.title}</div>
              </button>
            ) : <div />}
            {next && (
              <button onClick={() => navigate(`/blog/${next.slug}`)} style={{
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right', padding: 0,
              }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#444', letterSpacing: '0.12em', marginBottom: 6 }}>NEXT →</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: '#888' }}>{next.title}</div>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
