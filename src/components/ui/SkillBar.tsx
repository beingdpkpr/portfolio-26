import { useInView } from '../../hooks/useInView'

interface SkillBarProps {
  label: string
  delay?: number
}

export function SkillBar({ label, delay = 0 }: SkillBarProps) {
  const [ref, vis] = useInView(0.1)
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 6, height: 6,
        background: vis ? 'var(--fg)' : 'transparent',
        border: '1px solid var(--line-hi)',
        flexShrink: 0,
        transition: `all 0.4s ease ${delay + 0.2}s`,
      }} />
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 14,
        color: vis ? 'var(--fg-dim)' : 'var(--text-dim)',
        transition: `color 0.4s ease ${delay + 0.2}s`,
      }}>
        {label}
      </span>
    </div>
  )
}
