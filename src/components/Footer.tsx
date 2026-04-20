export function Footer() {
  return (
    <div style={{
      padding: '48px clamp(16px,8vw,140px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
    }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#333', letterSpacing: '0.1em' }}>
        © 2026 DEEPAK KUMAR PRASAD
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#333', letterSpacing: '0.08em' }}>
        DESIGNED & BUILT WITH CARE
      </div>
    </div>
  )
}
