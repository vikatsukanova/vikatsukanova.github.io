import { useEffect, useState } from 'react'
import { PixelPage } from './PixelPage'
import { ProjectPage } from './ProjectPage'

function currentPath() {
  const path = window.location.pathname.replace(/\/$/, '')
  return path || '/'
}

export default function App() {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const sync = () => setPath(currentPath())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  const project = path.match(/^\/work\/([^/]+)$/)
  if (project) return <ProjectPage slug={decodeURIComponent(project[1])} />
  return <PixelPage />
}
