import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { Experience } from '../components/Experience'
import { Projects } from '../components/Projects'
import { Skills } from '../components/Skills'
import { Education } from '../components/Education'
import { Certifications } from '../components/Certifications'
import { Testimonials } from '../components/Testimonials'
import { BlogLink } from '../components/BlogLink'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { ThemeToggle } from '../components/ui/ThemeToggle'

export function Home() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    const attempt = (tries: number) => {
      const el = document.getElementById(id)
      if (el) {
        window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' })
      } else if (tries > 0) {
        setTimeout(() => attempt(tries - 1), 100)
      }
    }
    attempt(10)
  }, [hash])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--fg)' }}>
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Certifications />
      <Testimonials />
      <BlogLink />
      <Contact />
      <Footer />
      <ThemeToggle />
    </div>
  )
}
