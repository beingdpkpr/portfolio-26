import type { Testimonial } from '../types'

describe('Testimonial type', () => {
  it('has required fields', () => {
    const t: Testimonial = {
      name: 'Test Person',
      title: 'Engineer',
      company: 'Acme',
      relationship: 'managed directly',
      date: 'Jan 2025',
      text: 'Great work.',
    }
    expect(t.name).toBe('Test Person')
    expect(t.text).toBe('Great work.')
  })

  it('accepts optional linkedinUrl', () => {
    const t: Testimonial = {
      name: 'Test Person',
      title: 'Engineer',
      company: 'Acme',
      relationship: 'managed directly',
      date: 'Jan 2025',
      text: 'Great work.',
      linkedinUrl: 'https://linkedin.com/in/someone',
    }
    expect(t.linkedinUrl).toBe('https://linkedin.com/in/someone')
  })
})
