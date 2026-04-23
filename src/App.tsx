import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Blog } from './pages/Blog'
import { sendVisitorAlert } from './lib/emailjs'

const VISITED_KEY = 'dp_visited'

async function notifyFirstVisit(): Promise<void> {
  if (localStorage.getItem(VISITED_KEY)) return

  try {
    const res = await fetch('https://ipapi.co/json/')
    const geo = await res.json()
    await sendVisitorAlert({
      visitor_ip:      geo.ip ?? 'unknown',
      visitor_city:    geo.city ?? 'unknown',
      visitor_country: geo.country_name ?? 'unknown',
      visitor_isp:     geo.org ?? 'unknown',
      visitor_ua:      navigator.userAgent,
      visited_at:      new Date().toISOString(),
      page_url:        window.location.href,
    })
  } catch {
    // silently swallow — visitor experience must not be affected
  } finally {
    localStorage.setItem(VISITED_KEY, '1')
  }
}

export default function App() {
  useEffect(() => { notifyFirstVisit() }, [])

  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Blog />} />
      </Routes>
    </HashRouter>
  )
}
