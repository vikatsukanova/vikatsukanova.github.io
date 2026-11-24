import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import styles from './AboutPage.module.css'
import { PixelMosaic } from './PixelMosaic'
import { navigate } from './SiteChrome'
import { SiteHeader } from './SiteHeader'

type Job = {
  id: string
  role: string
  company: string
  dates: string
  location: string
  intro?: string
  callout?: string
  groups?: { title: string; items: string[] }[]
  bullets?: string[]
}

const JOBS: Job[] = [
  {
    id: 'pelmorex',
    role: 'UI/UX Developer',
    company: 'Pelmorex Corp',
    dates: 'Aug 2017 - Present',
    location: 'Toronto, Ontario, Canada - Remote',
    intro:
      'Over 9 years, I drove front-end architecture for ad-tech and analytics platforms. Bridging design and engineering, I scaled legacy apps, built a Next.js BFF, and architected the shared component library.',
    groups: [
      {
        title: 'Design System Architecture',
        items: [
          'Spearheaded the shared MUI Storybook library, acting as primary author for all UI updates.',
          'Engineered foundational UI modules with Vitest coverage and multi-brand theming via centralized tokens.',
          'Led the incremental migration of product surfaces to standardized components.',
          'Elevated peer engineering skills by teaching component patterns and best practices via collaborative code reviews.',
        ],
      },
      {
        title: 'Audience Insights Platform',
        items: [
          'Engineered live B2B SaaS dashboards on a Next.js/TypeScript platform.',
          'Specialized in high-fidelity data visualization via data-dense charts and hierarchical tables prioritizing accuracy.',
          'Architected complex state management (Redux Toolkit, SWR), establishing robust data-fetching and caching patterns.',
          'Architected BFF solutions with API routes, Prisma schemas, and end-to-end CRUD flows.',
          'Shipped an AI-generated insights interface with strict business logic for data accuracy.',
          'Built dynamic data tables with server-side aggregation and automated PDF/CSV/Excel exports.',
          'Implemented Playwright/Vitest testing and ARIA accessibility standards.',
        ],
      },
      {
        title: 'Developer Tooling',
        items: [
          'Integrated an AI-assisted development framework with agent workflows to streamline team engineering.',
        ],
      },
      {
        title: 'Ad Campaign Delivery Platform',
        items: [
          'Scaled a JavaScript SaaS app, developing interactive ad units and dynamic forms.',
          'Designed UI states in Figma, creating a shared style guide prior to formal design systems.',
          'Led a framework upgrade via automated codemods and visual regression testing.',
          'Optimized web performance and browser internals for data-heavy apps, scaling dense interfaces under legacy constraints.',
        ],
      },
    ],
  },
  {
    id: 'ig-frontend',
    role: 'Front-End Developer',
    company: 'Investors Group',
    dates: 'Nov 2016 - Aug 2017',
    location: 'Toronto, Ontario, Canada',
    callout:
      'Translating UI mockups using HTML, CSS+SASS, Jquery in a structured Lean UX environment. Working with UI/UX designers to bridge the gap between graphical design and technical implementation.',
    bullets: [
      'Building reusable code and libraries for future use.',
      'Working with Salesforce and Adobe Experience Manager CMS integration.',
      'Solving cross-browser compatibility issues from IE10 and up.',
      'Helping back-end developers with front-end troubleshooting.',
      'Mobile first development using Foundation, SASS and Gulp.',
      'Using Git for source control.',
      'Front-End Development',
    ],
  },
  {
    id: 'ig-interaction',
    role: 'Interaction Designer',
    company: 'Investors Group',
    dates: 'Aug 2016 - Nov 2016',
    location: 'Toronto, Ontario, Canada',
    intro:
      'Responsible for UI deliverables, screen and micro-interaction layouts, style-guides, multi-screen view states. Providing ongoing assistance to Associate Manager of Interaction Design.',
  },
  {
    id: 'original-fly',
    role: 'Front-End Developer Intern',
    company: 'Original Fly',
    dates: 'Jul 2015',
    location: 'Toronto, Ontario, Canada',
    intro:
      'Responsible for website maintenance, adjustments and development of report web pages for applications.',
  },
]

const EDUCATION = [
  { program: 'Javascript', school: 'HackerYou', dates: '2019' },
  { program: 'Full-Stack', school: 'Juno College', dates: '2019' },
  { program: 'Web Design', school: 'Sheridan College', dates: '2015 - 2016' },
  { program: 'Visual & Creative Arts', school: 'Sheridan College', dates: '2012 - 2014' },
] as const

const SKILLS: { label: string; icon: ReactNode }[] = [
  {
    label: 'Brand identity & visual systems',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="8" cy="10" r="3.25" />
        <circle cx="15.5" cy="8.5" r="2.75" />
        <circle cx="14" cy="15.5" r="3" />
      </svg>
    ),
  },
  {
    label: 'UI / UX & product design',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
        <path d="M3.5 9h17M9.5 9v10.5" />
      </svg>
    ),
  },
  {
    label: 'Design systems & component libraries',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: 'Front-end engineering (React, Next.js, TypeScript)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M8 7.5 3.5 12 8 16.5M16 7.5 20.5 12 16 16.5M13.5 5.5 10.5 18.5" />
      </svg>
    ),
  },
  {
    label: 'Web design, typography, color, and layout',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M5 19.5 10.2 4.5h3.6L19 19.5M7.2 14.5h9.6" />
      </svg>
    ),
  },
  {
    label: 'Accessibility, testing, and design–engineering collaboration',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="12" cy="5.5" r="2" />
        <path d="M7 10.5h10M12 10.5v5M8.5 20.5 12 15.5l3.5 5" />
      </svg>
    ),
  },
]

function handleSpaNav(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return
  }
  event.preventDefault()
  navigate(href)
  window.scrollTo({ top: 0, behavior: 'auto' })
}

function JobCard({ job }: { job: Job }) {
  const [open, setOpen] = useState(false)
  const panelId = `${job.id}-panel`

  return (
    <article className={styles.jobCard}>
      <button
        type="button"
        className={styles.jobButton}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.jobRoleWrap}>
          <span className={styles.jobToggle} aria-hidden="true">
            {open ? '[-]' : '[+]'}
          </span>
          <span className={styles.jobRole}>{job.role}</span>
        </span>
        <span className={styles.jobMeta}>
          <span className={styles.jobCompany}>{job.company}</span>
          <span className={styles.jobDates}>{job.dates}</span>
        </span>
      </button>

      <div
        id={panelId}
        className={open ? styles.jobPanelOpen : styles.jobPanel}
        aria-hidden={!open}
      >
        <div className={styles.jobPanelClip}>
          <div className={styles.jobPanelInner}>
            <p className={styles.jobLocation}>{job.location}</p>
            {job.intro ? <p className={styles.jobIntro}>{job.intro}</p> : null}
            {job.callout ? <p className={styles.jobCallout}>{job.callout}</p> : null}
            {job.groups ? (
              <div className={styles.jobGroups}>
                {job.groups.map((group) => (
                  <div key={group.title}>
                    <h3 className={styles.jobGroupTitle}>{group.title}</h3>
                    <ul className={styles.jobBullets}>
                      {group.items.map((item) => (
                        <li key={item} className={styles.jobBullet}>
                          <span className={styles.jobBulletDot} aria-hidden="true">
                            •
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
            {job.bullets ? (
              <ul className={styles.jobBullets}>
                {job.bullets.map((item) => (
                  <li key={item} className={styles.jobBullet}>
                    <span className={styles.jobBulletDot} aria-hidden="true">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

export function AboutPage() {
  useEffect(() => {
    document.title = 'About — Victoria Tsukanova'
    const prevHtmlBg = document.documentElement.style.backgroundColor
    const prevBodyBg = document.body.style.backgroundColor
    document.documentElement.style.backgroundColor = '#F1F4F3'
    document.body.style.backgroundColor = '#F1F4F3'

    const id = window.location.hash.slice(1)
    if (id) {
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo(0, 0)
    }

    return () => {
      document.documentElement.style.backgroundColor = prevHtmlBg
      document.body.style.backgroundColor = prevBodyBg
    }
  }, [])

  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#about">
        Skip to about
      </a>

      <SiteHeader currentPath="/about" />

      <main id="about">
        <div className={styles.inner}>
          <section
            className={`${styles.row} ${styles.rowLeadTop}`}
            aria-labelledby="about-heading"
          >
            <div className={styles.portraitCard}>
              <img
                className={styles.portraitImg}
                src="/pixel-portrait.jpg?v=5"
                alt="Victoria Tsukanova"
                width={768}
                height={1024}
              />
            </div>

            <div className={styles.rowBody}>
              <h1 id="about-heading" className={styles.leadHeading}>
                I bridge UI/UX design with technical implementation, specializing in scalable design
                systems, modern React architectures, robust automated testing, AI-integrated
                workflows and complex data interfaces.
              </h1>
              <p className={`${styles.body} ${styles.bodyMuted}`}>
                My path started in visual and creative arts at Sheridan College, then moved into web
                design — learning how typography, color, and layout become interfaces people actually
                use. That curiosity pulled me deeper into front-end engineering: Full-Stack at Juno
                College, JavaScript at HackerYou, and years of shipping production UI.
              </p>
              <p className={`${styles.body} ${styles.bodyMuted}`}>
                For the last nine years I&apos;ve worked as a UI/UX developer at Pelmorex, bridging
                design and engineering on ad-tech and analytics platforms. Day to day that means design
                systems and shared component libraries, data-dense dashboards, multi-step product
                flows, and the craft of getting interface details right from Figma through React and
                into testing.
              </p>
              <p className={`${styles.body} ${styles.bodyMuted}`}>
                Alongside product work, I still love branding and editorial design. Selected design
                projects include Campshare, Cheese Factory, Racquet Science, Mission Blue, and a
                clinical assessment interface; builds include Compass. Across all of it I care about
                calm visual hierarchy, semantic color, and work that holds up from first mockup
                through production UI.
              </p>
            </div>
          </section>

          <section className={styles.row} id="skills" aria-labelledby="skills-heading">
            <h2 id="skills-heading" className={styles.lab}>
              Key skills
            </h2>
            <div className={styles.rowBody}>
              <ul className={styles.skillsGrid}>
                {SKILLS.map((skill) => (
                  <li key={skill.label} className={styles.skillCard}>
                    <span className={styles.skillIcon}>{skill.icon}</span>
                    <span className={styles.skillLabel}>{skill.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className={styles.bandWrap}>
          <PixelMosaic grid="caseMid" />
        </div>

        <div className={styles.inner}>
          <section className={styles.row} id="experience" aria-labelledby="experience-heading">
            <h2 id="experience-heading" className={styles.lab}>
              Experience
            </h2>
            <div className={styles.rowBody}>
              <div className={styles.jobList}>
                {JOBS.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          </section>

          <section
            className={`${styles.row} ${styles.rowLast}`}
            id="education"
            aria-labelledby="education-heading"
          >
            <h2 id="education-heading" className={styles.lab}>
              Education
            </h2>
            <div className={styles.rowBody}>
              <div className={styles.eduGrid}>
                {EDUCATION.map((item) => (
                  <article key={`${item.school}-${item.program}`} className={styles.eduCard}>
                    <span className={styles.eduProgram}>{item.program}</span>
                    <span className={styles.eduMeta}>
                      <span className={styles.eduSchool}>{item.school}</span>
                      <span className={styles.eduDates}>{item.dates}</span>
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className={`${styles.bandWrap} ${styles.bandWrapFooter}`}>
          <PixelMosaic grid="caseFooter" />
        </div>
      </main>

      <footer className={styles.siteFooter}>
        <div className={styles.footerInner}>
          <div>
            <h2 className={styles.footerHeading}>Ways to get in touch</h2>
            <a href="mailto:victoriatsukanova@gmail.com" className={styles.footerSayHi}>
              <span>Say hi</span>
              <span className={styles.footerArrow} aria-hidden="true">
                →
              </span>
            </a>
          </div>

          <div className={styles.footerBottom}>
            <div className={styles.footerLinks}>
              <a href="/" onClick={(event) => handleSpaNav(event, '/')}>
                Work
              </a>
              <a
                href="https://www.linkedin.com/in/victoriatsukanova"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a href="https://github.com/vikatsukanova" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a
                href="https://www.behance.net/VictoriaTsukanova"
                target="_blank"
                rel="noreferrer"
              >
                Behance
              </a>
              <a href="/brand/CV_Victoria_Tsukanova.pdf" target="_blank" rel="noreferrer">
                Resume
              </a>
              <a href="#about">Back to the top ↑</a>
            </div>
            <p className={styles.footerCopy}>© 2026 Victoria Tsukanova</p>
          </div>
        </div>
      </footer>

      <svg className={styles.grain} aria-hidden="true">
        <filter id="about-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#about-grain)" />
      </svg>
    </div>
  )
}
