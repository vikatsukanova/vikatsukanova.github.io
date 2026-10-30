import { useEffect, useState } from 'react'
import { AboutPage } from './AboutPage'
import { PixelPage } from './PixelPage'
import { ProjectPage } from './ProjectPage'
import { projectBySlug } from './projects'

function currentPath() {
  const path = window.location.pathname.replace(/\/$/, '')
  return path || '/'
}

function ExternalCaseStudy({ href }: { href: string }) {
  useEffect(() => {
    window.location.replace(href)
  }, [href])
  return null
}

export default function App() {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const sync = () => setPath(currentPath())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  if (path === '/about') return <AboutPage />

  const project = path.match(/^\/work\/([^/]+)$/)
  if (project) {
    const slug = decodeURIComponent(project[1])
    const data = projectBySlug(slug)
    if (data?.caseStudyHref) return <ExternalCaseStudy href={data.caseStudyHref} />
    return <ProjectPage slug={slug} />
  }

  return <PixelPage />
}
