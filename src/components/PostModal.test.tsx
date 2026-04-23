import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PostModal } from './PostModal'
import type { BlogPost } from '../types'

const mockPost: BlogPost = {
  slug: 'test-post',
  title: 'Test Post',
  date: 'Jan 2025',
  tag: 'Architecture',
  excerpt: 'A test post.',
  readTime: '2 min read',
  content: 'Hello world',
}

function renderModal(post = mockPost) {
  return render(
    <MemoryRouter>
      <PostModal post={post} posts={[mockPost]} onClose={() => {}} />
    </MemoryRouter>
  )
}

describe('PostModal', () => {
  it('renders the post title', () => {
    renderModal()
    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })

  it('renders progress bar at 0% on mount', () => {
    renderModal()
    const bar = screen.getByTestId('progress-bar')
    expect(bar).toBeInTheDocument()
    expect(bar).toHaveStyle('width: 0%')
  })

  it('updates progress bar on scroll', () => {
    renderModal()
    const overlay = document.querySelector('[style*="overflow: auto"]') as HTMLElement
    Object.defineProperty(overlay, 'scrollTop', { value: 500, configurable: true })
    Object.defineProperty(overlay, 'scrollHeight', { value: 1000, configurable: true })
    Object.defineProperty(overlay, 'clientHeight', { value: 500, configurable: true })
    fireEvent.scroll(overlay)
    const bar = screen.getByTestId('progress-bar')
    expect(bar).toHaveStyle('width: 100%')
  })

  it('renders the close button', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })
})
