import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { Experience } from '../components/Experience'
import { Projects } from '../components/Projects'
import { Skills } from '../components/Skills'
import { Education } from '../components/Education'
import { Certifications } from '../components/Certifications'
import { BlogLink } from '../components/BlogLink'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'

export function Home() {
  return (
    <div style={{ background: '#08080a', minHeight: '100vh', color: '#fff' }}>
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Certifications />
      <BlogLink />
      <Contact />
      <Footer />
    </div>
  )
}
