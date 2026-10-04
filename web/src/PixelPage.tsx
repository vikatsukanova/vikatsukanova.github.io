import { useState } from 'react'
import styles from './PixelPage.module.css'
import { PROJECTS } from './projects'

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
    '0000111000000000',
    '0001111000000000',
    '0000111100000000',
    '0000011100000000',
    '0000001100000000',
    '0000000000000000',
    '1100000000000011',
    '1110000000000111',
    '0111000000001110',
    '0011100000011100',
    '0001110000111000',
    '0000111001110000',
    '0000011111100000',
    '0000001111000000',
    '0000000110000000',
    ],
  },
  {
    name: 'JavaScript',
    pixels: ['00000000', '11100111', '00100100', '00100111', '00100001', '00100001', '01100111', '00000000'],
  },
  {
    name: 'TypeScript',
    pixels: ['00000000', '11100111', '01000100', '01000111', '01000001', '01000001', '01000111', '00000000'],
  },
  {
    name: 'CSS',
    pixels: ['11111110', '00000011', '00000011', '11111110', '00000011', '00000011', '11111110', '00000000'],
  },
] as const

type BulletGroup = { title: string; items: readonly string[] }

type Job = {
  id: string
  role: string
  company: string
  dates: string
  location: string
  intro?: string
  callout?: string
  scroll?: boolean
  groups?: readonly BulletGroup[]
  bullets?: readonly string[]
}

const JOBS: readonly Job[] = [
  {
    id: 'pelmorex',
    role: 'UI/UX Developer',
    scroll: true,
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
    intro: 'Responsible for website maintenance, adjustments and development of report web pages for applications.',
  },
]

const EDUCATION = [
  { program: 'Javascript', school: 'HackerYou', dates: '2019' },
  { program: 'Full-Stack', school: 'Juno College', dates: '2019' },
  { program: 'Web Design', school: 'Sheridan College', dates: '2015 - 2016' },
  { program: 'Visual & Creative Arts', school: 'Sheridan College', dates: '2012 - 2014' },
] as const

function workFromProject(slug: string) {
  const project = PROJECTS.find((item) => item.slug === slug)
  if (!project) throw new Error(`Missing project: ${slug}`)
  return { label: project.label, image: project.image, slug: project.slug }
}

const WORK = [
  workFromProject('compass'),
  workFromProject('spendguard'),
  { label: 'Geargrid', image: '/work-geargrid.jpg?v=1' },
  workFromProject('fluenttrack'),
]

const LINKS = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/victoriatsukanova' },
  { name: 'GitHub', url: 'https://github.com/vikatsukanova' },
  { name: 'Resume', url: 'https://www.linkedin.com/in/victoriatsukanova' },
  { name: 'Email', url: 'mailto:victoriatsukanova@gmail.com' },
]

function JobCard({ job }: { job: Job }) {
  const [open, setOpen] = useState(false)
  const panelId = `${job.id}-panel`

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.cardButton}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.roleWrap}>
          <span className={styles.toggle} aria-hidden="true">
            {open ? '[-]' : '[+]'}
          </span>
          <span className={styles.role}>{job.role}</span>
        </span>
        <span className={styles.meta}>
          <span className={styles.company}>{job.company}</span>
          <span className={styles.dates}>{job.dates}</span>
        </span>
      </button>
      <div id={panelId} className={open ? styles.panelOpen : styles.panel} aria-hidden={!open}>
        <div className={job.scroll ? `${styles.panelInner} ${styles.panelScroll}` : styles.panelInner}>
          <p className={styles.location}>{job.location}</p>
          {job.intro ? <p className={styles.intro}>{job.intro}</p> : null}
          {job.callout ? <p className={styles.callout}>{job.callout}</p> : null}
          {job.groups ? (
            <div className={styles.groups}>
              {job.groups.map((group) => (
                <div key={group.title}>
                  <h3 className={styles.groupTitle}>{group.title}</h3>
                  <ul className={styles.bullets}>
                    {group.items.map((item) => (
                      <li key={item} className={styles.bullet}>
                        <span aria-hidden="true">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
          {job.bullets ? (
            <ul className={styles.bullets}>
              {job.bullets.map((item) => (
                <li key={item} className={styles.bullet}>
                  <span aria-hidden="true">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export function PixelPage() {
  return (
    <div className={styles.page}>
      <div className={styles.gridBg} aria-hidden="true" />
      <div className={styles.marks} aria-hidden="true">
        <span className={styles.markTl}>+</span>
        <span className={styles.markTr}>:::</span>
        <span className={styles.markBl}>::</span>
        <span className={styles.markBr}>+</span>
      </div>

      <main className={styles.main}>
        <section className={`${styles.hero} ${styles.reveal}`} aria-label="Introduction">
          <div className={styles.heroRow}>
            <div className={styles.copyBlock}>
              <div className={styles.spark}>✤</div>
              <h1 className={styles.name}>
                Victoria
                <br />
                Tsukanova
              </h1>
              <p className={styles.roles}>
                <span>Front-End Developer</span>
                <span className={styles.slash}>|</span>
                <span>Montreal, QC</span>
              </p>
              <p className={styles.lede}>
                I bridge UI/UX design with technical implementation, specializing in scalable
                design systems, modern React architectures, robust automated testing, AI-integrated
                workflows and complex data interfaces.
              </p>
              <ul className={styles.links}>
                {LINKS.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      className={styles.link}
                      {...(link.url.startsWith('http')
                        ? { target: '_blank', rel: 'noreferrer' }
                        : {})}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.portrait}>
              <div className={styles.waver} aria-hidden="true">
                <span className={styles.waveBody} />
                <span className={styles.waveArm} />
              </div>
              <div className={styles.frame}>
                <img
                  src="/pixel-portrait.jpg?v=5"
                  alt="Victoria Tsukanova"
                  className={styles.photo}
                />
              </div>
            </div>
          </div>
          <a className={styles.scrollDown} href="#stack">
            <span className={styles.scrollLabel}>Scroll down</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
        </section>

        <div className={styles.content}>
          <section className={`${styles.stackSection} ${styles.reveal} ${styles.delay1}`} id="stack">
            <span className={styles.stackMark} aria-hidden="true">
              ✕
            </span>
            <div className={styles.titleWrap}>
              <h2 className={styles.sectionTitle}>My Stack</h2>
              <div className={styles.titleRule} />
            </div>
            <div className={styles.stack}>
              {STACK.map((item) => (
                <div key={item.name} className={styles.icon}>
                  <div className={styles.iconBox}>
                  <svg viewBox={`0 0 ${item.pixels[0].length} ${item.pixels.length}`} className={styles.iconSvg} aria-hidden="true">
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

          <section className={`${styles.workSection} ${styles.reveal} ${styles.delay2}`} id="work">
            <div className={styles.titleWrap}>
              <h2 className={styles.sectionTitle}>My Work</h2>
              <div className={styles.titleRule} />
            </div>
            <div className={styles.workGrid}>
              {WORK.map((item) => {
                const card = (
                  <>
                    {'image' in item && item.image ? (
                      <div className={styles.workShot}>
                        <img src={item.image} alt="" />
                      </div>
                    ) : (
                      <div className={styles.workFrame} aria-hidden="true">
                        +
                      </div>
                    )}
                    <p className={styles.workLabel}>{item.label}</p>
                  </>
                )

                if ('slug' in item) {
                  return (
                    <a key={item.label} className={styles.workCard} href={`/work/${item.slug}`}>
                      {card}
                    </a>
                  )
                }

                return (
                  <article key={item.label} className={styles.workCard}>
                    {card}
                  </article>
                )
              })}
            </div>
          </section>

          <div className={`${styles.split} ${styles.reveal} ${styles.delay2}`}>
            <section className={styles.col} id="experience">
              <span className={styles.colMark} aria-hidden="true">
                ▦
              </span>
              <div className={styles.titleWrap}>
                <h2 className={styles.sectionTitle}>Experience</h2>
                <div className={styles.titleRule} />
              </div>
              <div className={styles.cards}>
                {JOBS.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>

            <section className={styles.col} id="education">
              <span className={styles.eduMark} aria-hidden="true">
                ✛
              </span>
              <div className={styles.titleWrap}>
                <h2 className={styles.sectionTitle}>Education</h2>
                <div className={styles.titleRule} />
              </div>
              <div className={styles.cards}>
                {EDUCATION.map((item, index) => (
                  <article
                    key={`${item.school}-${item.program}`}
                    className={index === EDUCATION.length - 1 ? styles.eduLast : styles.eduCard}
                  >
                    {index === EDUCATION.length - 1 ? (
                      <span className={styles.eduCorner} aria-hidden="true">
                        ▤
                      </span>
                    ) : null}
                    <span className={styles.program}>{item.program}</span>
                    <span className={styles.meta}>
                      <span className={styles.company}>{item.school}</span>
                      <span className={styles.dates}>{item.dates}</span>
                    </span>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <p className={styles.footerCopy}>© 2026 Victoria Tsukanova</p>
        <div className={styles.pixelStage} aria-hidden="true">
          <div className={styles.pixelMover}>
            <div className={styles.pixelFace}>
              <div className={styles.pixelHop}>
                <span className={styles.pixelBody} />
                <span className={styles.pixelLegs} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
