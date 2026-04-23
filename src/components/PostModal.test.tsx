import { render, screen } from '@testing-library/react'
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

function renderModal() {
  return render(
    <MemoryRouter>
      <PostModal post={mockPost} posts={[mockPost]} onClose={() => {}} />
    </MemoryRouter>
  )
}

describe('PostModal', () => {
  it('renders the post title', () => {
    renderModal()
    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })

  it('renders a progress bar starting at 0%', () => {
    renderModal()
    const progressBar = document.querySelector('[style*="width: 0%"]')
    expect(progressBar).toBeInTheDocument()
  })

  it('renders the close button', () => {
    renderModal()
    expect(screen.getByText(/close/i)).toBeInTheDocument()
  })
})
