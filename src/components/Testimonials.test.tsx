import { render, screen } from '@testing-library/react'
import { Testimonials } from './Testimonials'

describe('Testimonials', () => {
  beforeEach(() => render(<Testimonials />))

  it('renders the section heading', () => {
    expect(screen.getByText(/what colleagues say/i)).toBeInTheDocument()
  })

  it('renders all four testimonial names', () => {
    expect(screen.getByText('Rahul Bajaj')).toBeInTheDocument()
    expect(screen.getByText('Yashad Kasar')).toBeInTheDocument()
    expect(screen.getByText('Vinayak Samant')).toBeInTheDocument()
    expect(screen.getByText('Dhanesh Pai')).toBeInTheDocument()
  })

  it('renders LinkedIn links only for LinkedIn recommendations', () => {
    const links = screen.getAllByRole('link', { name: /view on linkedin/i })
    expect(links).toHaveLength(3)
    links.forEach(link => {
      expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/dpkpr1/details/recommendations/?detailScreenTabIndex=0')
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  it('does not render a LinkedIn link for the LOR testimonial', () => {
    const dhaneshCard = screen.getByText('Dhanesh Pai').closest('div')
    const link = dhaneshCard?.querySelector('a')
    expect(link).toBeNull()
  })
})
