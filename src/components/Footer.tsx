export function Footer() {
  return (
    <div style={{
      padding: '48px clamp(16px,8vw,140px)',
      borderTop: '1px solid var(--line)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
    }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text-ghost)', letterSpacing: '0.1em' }}>
        © 2026 DEEPAK KUMAR PRASAD
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text-ghost)', letterSpacing: '0.08em' }}>
        DESIGNED & BUILT WITH CARE
      </div>
    </div>
  )
}
