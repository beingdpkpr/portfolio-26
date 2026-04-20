export interface Experience {
  title: string
  company: string
  period: string
  duration: string
  location: string
  bullets: string[]
}

export interface Project {
  title: string
  tags: string[]
  description: string
  highlight: string
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface AcademicProject {
  title: string
  description: string
  tech: string
}

export interface Education {
  degree: string
  institution: string
  year: string
  detail: string
  gpa: string
  projects?: AcademicProject[]
  achievements?: string[]
}

export interface CourseEntry {
  name: string
  verify: string
}

export interface Certification {
  name: string
  issuer: string
  year: string
  type: 'course' | 'specialization'
  verify: string
  courses?: CourseEntry[]
}

export interface BlogPreview {
  title: string
  date: string
  tag: string
  excerpt: string
  link: string
}

export interface Portfolio {
  name: string
  title: string
  tagline: string
  email: string
  phone: string
  linkedin: string
  linkedinLabel: string
  github: string
  githubLabel: string
  location: string
  about: string
  experience: Experience[]
  projects: Project[]
  skills: SkillGroup[]
  education: Education[]
  certifications: Certification[]
  blog: BlogPreview[]
}

export interface BlogFrontmatter {
  title: string
  date: string
  tag: string
  excerpt: string
  readTime: string
}

export interface BlogPost extends BlogFrontmatter {
  slug: string
  content: string
}

export type FormState = 'idle' | 'sending' | 'success' | 'error'
