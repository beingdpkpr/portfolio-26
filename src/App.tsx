import { HashRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Blog } from './pages/Blog'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Blog />} />
      </Routes>
    </HashRouter>
  )
}
