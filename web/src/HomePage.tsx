import { useEffect, useState } from 'react'
import { buildProjects, homeProjects, type Project } from './projects'
import { SiteChrome, navigate } from './SiteChrome'
import styles from './HomePage.module.css'

const PILL_WORDS = ['brand', 'interface', 'product'] as const

function ProjectCard({
  project,
  index,
  eager,
}: {
  project: Project
  index: number
  eager?: boolean
}) {
  return (
    <li className={styles.card} style={{ animationDelay: `${0.04 * index}s` }}>
      <a
        href={`/work/${project.slug}`}
        className={styles.cardLink}
        onClick={(event) => {
          event.preventDefault()
          navigate(`/work/${project.slug}`)
        }}
      >
        <div className={styles.thumb}>
          <img
            src={project.homeImage ?? project.image}
            alt=""
            loading={eager ? 'eager' : 'lazy'}
          />
        </div>
        <h3 className={styles.title}>
          {project.label}
          {project.caseStudy ? ' — Case Study' : ''}
        </h3>
        <p className={styles.tags}>{project.stack.slice(0, 4).join(', ')}</p>
      </a>
    </li>
  )
}

export function HomePage() {
  const [pillIndex, setPillIndex] = useState(0)
  const projects = homeProjects()
  const builds = buildProjects()

  useEffect(() => {
    document.title = 'Victoria Tsukanova'
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const id = window.setInterval(() => {
      setPillIndex((i) => (i + 1) % PILL_WORDS.length)
    }, 2200)
    return () => window.clearInterval(id)
  }, [])

  return (
    <SiteChrome path="/">
      <main>
        <section className={styles.hero} aria-labelledby="hero-line">
          <h1 id="hero-line" className={styles.hello}>
            Hello! I&apos;m Vika, a
          </h1>
          <h1 className={styles.roleLine}>
            <span className={styles.pill} aria-live="polite">
              {PILL_WORDS[pillIndex]}
            </span>{' '}
            designer
          </h1>
        </section>

        <section id="work" className={styles.work} aria-labelledby="work-heading">
          <div className={styles.sectionHead}>
            <h2 id="work-heading">Selected work</h2>
            <p>Branding, product UI, and design-system case studies.</p>
          </div>
          <ul className={styles.grid}>
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} eager={index < 2} />
            ))}
          </ul>
        </section>

        <section id="builds" className={styles.work} aria-labelledby="builds-heading">
          <div className={styles.sectionHead}>
            <h2 id="builds-heading">Selected builds</h2>
            <p>Front-end and full-stack product work I designed and shipped.</p>
          </div>
          <ul className={styles.grid}>
            {builds.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </ul>
        </section>
      </main>
    </SiteChrome>
  )
}
