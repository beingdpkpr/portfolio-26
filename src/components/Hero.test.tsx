import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Hero } from './Hero'

function renderHero() {
  return render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>
  )
}

describe('Hero', () => {
  it('renders a résumé download link', () => {
    renderHero()
    const link = screen.getByRole('link', { name: /résumé/i })
    expect(link).toBeInTheDocument()
  })

  it('résumé link has download attribute', () => {
    renderHero()
    const link = screen.getByRole('link', { name: /résumé/i })
    expect(link).toHaveAttribute('download', 'Deepak_Kumar_Prasad_Resume.pdf')
  })

  it('résumé link points to the PDF', () => {
    renderHero()
    const link = screen.getByRole('link', { name: /résumé/i })
    expect(link.getAttribute('href')).toContain('deepak_prasad_26.pdf')
  })
})
