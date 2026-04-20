import type { ReactNode, CSSProperties } from 'react'
import { useInView } from '../../hooks/useInView'

interface RevealProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  style?: CSSProperties
}

const transforms: Record<string, string> = {
  up: 'translateY(32px)',
  left: 'translateX(-32px)',
  right: 'translateX(32px)',
  none: 'none',
}

export function Reveal({ children, delay = 0, direction = 'up', style }: RevealProps) {
  const [ref, vis] = useInView()
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'none' : transforms[direction],
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
