import { useEffect, useState } from 'react'
import styles from './PixelPage.module.css'
import { PROJECTS } from './projects'

const ROLES = [
  'a front-end developer',
  'a UI/UX designer',
  'a design systems builder',
  'a product-minded engineer',
] as const

function useTypedRole(words: readonly string[]) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setText(words[0] ?? '')
      return
    }

    const full = words[index] ?? ''
    if (!deleting && text === full) {
      const pause = window.setTimeout(() => setDeleting(true), 1800)
      return () => window.clearTimeout(pause)
    }
    if (deleting && text === '') {
      setDeleting(false)
      setIndex((value) => (value + 1) % words.length)
      return
    }

    const delay = deleting ? 36 : 72
    const tick = window.setTimeout(() => {
      setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1))
    }, delay)
    return () => window.clearTimeout(tick)
  }, [deleting, index, text, words])

  return text
}

const STACK = [
  {
    name: 'Next.js',
    pixels: ['11000011', '11100011', '11110011', '11011011', '11001111', '11000111', '11000011', '11000011'],
  },
  {
    name: 'React',
    pixels: [
      '0001100000110000',
      '0001110001110000',
      '0001111011110000',
      '0001101110110000',
      '0001101110110000',
      '0011111111111000',
      '1111110101111111',
      '1110111111101111',
      '1111110101111111',
      '0011111111111000',
      '0001101110110000',
      '0001101110110000',
      '0001111011110000',
      '0001110001110000',
      '0001100000110000',
      '0000000000000000',
    ],
  },
  {
    name: 'Redux',
    pixels: [
      '0000001111000000',
      '0000011001100000',
      '0000100000100000',
      '0000100000010000',
      '0001000000010000',
      '0001001100000000',
      '0001001111110000',
      '0001000000001100',
      '0111100000000110',
      '0100100000110010',
      '1000110000110001',
      '1000111000100001',
      '1000010001000001',
      '1000000011000001',
      '0110001110000010',
      '0011111001111100',
    ],
  },
  {
    name: 'Storybook',
    pixels: ['01111110', '11000010', '11000000', '01111100', '00000011', '01000011', '01111110', '00000000'],
  },
  {
    name: 'Playwright',
    pixels: [
      '0000000000111100',
      '0000000001111110',
      '0001100011110111',
      '0011110111011011',
      '0110110111111001',
      '0110010111000001',
      '0111110110000011',
      '0011101100011111',
      '0001111111111110',
      '0000111111111100',
      '0000111111111100',
      '0000011111111000',
      '0000001111110000',
      '0000000000000000',
      '0000000000000000',
      '0000000000000000',
    ],
  },
  {
    name: 'Vitest',
    pixels: [
      '0000011110000000',
      '0000111111000000',
      '0001110011100000',
      '0011100001110000',
      '0111000000111000',
      '1110000000011100',
      '1100000000001100',
      '1100000000001100',
      '1110000000011100',
      '0111000000111000',
      '0011100001110000',
      '0001110011100000',
      '0000111111000000',
      '0000011110000000',
      '0000001100000000',
      '0000000000000000',
    ],
  },
  {
    name: 'JavaScript',
    pixels: ['11111110', '10000010', '10000010', '10011010', '10011010', '10000010', '11111110', '00000000'],
  },
  {
    name: 'TypeScript',
    pixels: ['11111111', '10000001', '10111101', '10011001', '10011001', '10111101', '10000001', '11111111'],
  },
  {
    name: 'CSS',
    pixels: ['01111110', '11000011', '11000000', '01111100', '00000011', '11000011', '01111110', '00000000'],
  },
]

const WORK_ART: Record<string, string> = {
  sidestage: '#e8e2d8',
  clinical: '#c5d4ef',
  compass: '#d7ebe3',
  campshare: '#e8d5a8',
  'cheese-factory': '#efd4c0',
  'racquet-science': '#c5e8d2',
  'mission-blue': '#c4ccec',
}

function workFromProject(slug: string) {
  const project = PROJECTS.find((item) => item.slug === slug)
  if (!project) throw new Error(`Missing project: ${slug}`)
  return {
    label: project.label,
    image: project.homeImage ?? project.image,
    presentation: project.homePresentation ?? 'browser',
    slug: project.slug,
    href: project.caseStudyHref ?? `/work/${project.slug}`,
    stack: project.stack.slice(0, 3),
    summary: project.summary,
    artColor: WORK_ART[slug] ?? '#c9d6f5',
  }
}

const WORK = [
  workFromProject('sidestage'),
  workFromProject('clinical'),
  workFromProject('compass'),
  workFromProject('campshare'),
  workFromProject('cheese-factory'),
  workFromProject('racquet-science'),
  workFromProject('mission-blue'),
]

const ACCENT = '#d9fa67'

export function PixelPage() {
  const role = useTypedRole(ROLES)

  useEffect(() => {
    document.title = 'Victoria Tsukanova'
  }, [])

  return (
    <div className={styles.page} style={{ ['--accent' as string]: ACCENT }}>
      <a className={styles.skip} href="#work">
        Skip to work
      </a>

      <header className={styles.header}>
        <a className={styles.brand} href="/" aria-label="Victoria Tsukanova homepage">
          <img src="/brand/victoriatsukanova-logo.png" alt="" width={85} height={35} />
        </a>
        <nav aria-label="Main navigation">
          <a href="/about">About</a>
          <div className={styles.navActions}>
            <a className={styles.navButton} href="mailto:victoriatsukanova@gmail.com">
              Say hi
            </a>
            <a
              className={styles.navButton}
              href="https://www.linkedin.com/in/victoriatsukanova"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              className={styles.navButton}
              href="/brand/CV_Victoria_Tsukanova.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Resume
            </a>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero} aria-label="Introduction">
          <div className={styles.headline}>
            <h1>
              Hi, I&apos;m Vika
              <span className={styles.typedLine}>
                <span className={styles.typedRole} aria-live="polite">
                  {role}
                </span>
                <span className={styles.caret} aria-hidden="true" />
              </span>
            </h1>
          </div>

          <div className={styles.heroCopy}>
            <p className={styles.roles}>
              <span>Montreal, QC</span>
            </p>
            <p className={styles.lede}>
              I bridge UI/UX design with technical implementation, specializing in scalable design
              systems, modern React architectures, robust automated testing, AI-integrated
              workflows and complex data interfaces.
            </p>
          </div>

          <a className={styles.roundLink} href="#stack">
            <span>Scroll down</span>
            <b aria-hidden="true">↓</b>
          </a>
        </section>

        <section className={styles.stackSection} id="stack">
          <div className={styles.sectionLabel}>
            <h2>
              My Stack<span className={styles.smallStar}>✳</span>
            </h2>
            <span className={styles.eyebrow}>Tools I build with</span>
          </div>
          <div className={styles.stack}>
            {STACK.map((item) => (
              <div key={item.name} className={styles.icon}>
                <div className={styles.iconBox}>
                  <svg
                    viewBox={`0 0 ${item.pixels[0].length} ${item.pixels.length}`}
                    className={styles.iconSvg}
                    aria-hidden="true"
                  >
                    {item.pixels.map((row, y) =>
                      row.split('').map((cell, x) =>
                        cell === '1' ? (
                          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
                        ) : null,
                      ),
                    )}
                  </svg>
                </div>
                <span className={styles.iconName}>{item.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.workSection} id="work">
          <div className={styles.sectionLabel}>
            <h2>
              My Work<span className={styles.smallStar}>✳</span>
            </h2>
            <span className={styles.eyebrow}>Selected projects & builds</span>
          </div>
          <div className={styles.workGrid}>
            {WORK.map((item, index) => (
              <a key={item.label} className={styles.workCard} href={item.href}>
                <div className={styles.workArt} style={{ background: item.artColor }}>
                  <div className={styles.artGrid} aria-hidden="true" />
                  <span className={styles.projectKicker}>
                    {String(index + 1).padStart(2, '0')} / {item.label}
                  </span>
                  {item.image ? (
                    item.presentation === 'phone' ? (
                      <div className={styles.phoneFrame}>
                        <span className={styles.phoneNotch} aria-hidden="true" />
                        <img src={item.image} alt="" />
                      </div>
                    ) : (
                      <div className={styles.browserFrame}>
                        <div className={styles.browserTop}>
                          <i />
                          <i />
                          <i />
                          <span>{item.label}</span>
                        </div>
                        <img src={item.image} alt="" />
                      </div>
                    )
                  ) : (
                    <div className={styles.workFrame} aria-hidden="true">
                      +
                    </div>
                  )}
                </div>
                <div className={styles.projectInfo}>
                  <div>
                    <div className={styles.chips}>
                      {item.stack.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <h3>{item.label}</h3>
                    <p>{item.summary}</p>
                  </div>
                  <div className={styles.projectCta}>
                    <span>View project</span>
                    <b aria-hidden="true">↗</b>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <a className={styles.brand} href="#">
          <img src="/brand/victoriatsukanova-logo.png" alt="" width={85} height={35} />
        </a>
        <span>© 2026 Victoria Tsukanova</span>
        <a href="#">Back to the top ↑</a>
      </footer>
    </div>
  )
}
