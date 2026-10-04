import { useEffect } from 'react'
import home from './PixelPage.module.css'
import { projectBySlug } from './projects'
import styles from './ProjectPage.module.css'

export function ProjectPage({ slug }: { slug: string }) {
  const project = projectBySlug(slug)

  useEffect(() => {
    document.title = project ? `${project.label} — Victoria Tsukanova` : 'Victoria Tsukanova'
    window.scrollTo(0, 0)
  }, [project])

  return (
    <div className={`${home.page} ${styles.shell}`}>
      <div className={home.gridBg} aria-hidden="true" />
      <main className={styles.main}>
        <a className={styles.back} href="/#work">
          <svg className={styles.backArrow} viewBox="0 0 16 16" aria-hidden="true">
            <path d="M10 2.5 4.5 8 10 13.5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          Back
        </a>
        {project ? (
          <>
            <h1 className={styles.title}>{project.label}</h1>
            <div className={styles.layout}>
              <div className={styles.side}>
                <ul className={styles.tags} aria-label="Stack">
                  {project.stack.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <figure className={styles.shot}>
                  <img src={project.image} alt="" />
                </figure>
                {project.site ? (
                  <a className={home.link} href={project.site} target="_blank" rel="noreferrer">
                    Visit site
                  </a>
                ) : null}
              </div>
              <div className={styles.info} tabIndex={0}>
                <section className={styles.section}>
                  <h2 className={styles.heading}>About</h2>
                  <div className={styles.rule} />
                  <p className={styles.body}>{project.summary}</p>
                </section>
                <section className={styles.section}>
                  <h2 className={styles.heading}>What it does</h2>
                  <div className={styles.rule} />
                  <ul className={styles.list}>
                    {project.features.map((item) => (
                      <li key={item}>
                        <span aria-hidden="true">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                <section className={styles.section}>
                  <h2 className={styles.heading}>How it was built</h2>
                  <div className={styles.rule} />
                  <ul className={styles.list}>
                    {project.built.map((item) => (
                      <li key={item}>
                        <span aria-hidden="true">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                {project.demo?.length ? (
                  <section className={styles.section}>
                    <h2 className={styles.heading}>On the demo</h2>
                    <div className={styles.rule} />
                    <ul className={styles.list}>
                      {project.demo.map((item) => (
                        <li key={item}>
                          <span aria-hidden="true">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>
            </div>
          </>
        ) : (
          <section className={styles.section}>
            <h1 className={styles.title}>Not found</h1>
            <p className={styles.body}>This project page is not up yet.</p>
          </section>
        )}
      </main>
      <footer className={home.footer}>
        <p className={home.footerCopy}>© 2026 Victoria Tsukanova</p>
      </footer>
    </div>
  )
}
