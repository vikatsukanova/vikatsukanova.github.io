import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { PixelMosaic, type PixelMosaicHandle } from './PixelMosaic'
import styles from './PortfolioHome.module.css'
import { PROJECTS } from './projects'
import { navigate } from './navigation'
import { SiteHeader } from './SiteHeader'

const ROLES = [
  'a front-end developer',
  'a UI/UX designer',
  'a design systems builder',
  'a product-minded engineer',
] as const

function useTypedRole(words: readonly string[]) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? (words[0] ?? '')
      : '',
  )
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const full = words[index] ?? ''
    if (!deleting && text === full) {
      const pause = window.setTimeout(() => setDeleting(true), 1800)
      return () => window.clearTimeout(pause)
    }
    if (deleting && text === '') {
      const next = window.setTimeout(() => {
        setDeleting(false)
        setIndex((value) => (value + 1) % words.length)
      }, 60)
      return () => window.clearTimeout(next)
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
] as const

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
    isSpaRoute: !project.caseStudyHref,
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

type WorkItem = (typeof WORK)[number]

function handleSpaClick(event: MouseEvent<HTMLAnchorElement>, href: string, isSpaRoute: boolean) {
  if (!isSpaRoute) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return
  }
  event.preventDefault()
  navigate(href)
  window.scrollTo({ top: 0, behavior: 'auto' })
}

function ProjectPreview({ item }: { item: WorkItem }) {
  return (
    <div className={styles.previewStage} style={{ backgroundColor: item.artColor }}>
      <div className={styles.previewStageGrid} aria-hidden="true" />
      {item.presentation === 'phone' ? (
        <div className={styles.phoneFrame}>
          <span className={styles.phoneNotch} aria-hidden="true" />
          <img src={item.image} alt="" loading="lazy" />
        </div>
      ) : (
        <div className={styles.browserFrame}>
          <div className={styles.browserTop}>
            <i />
            <i />
            <i />
            <span>{item.label}</span>
          </div>
          <img src={item.image} alt="" loading="lazy" />
        </div>
      )}
    </div>
  )
}

export function PixelPage() {
  const role = useTypedRole(ROLES)
  const [heroAnimKey, setHeroAnimKey] = useState(0)

  const pageRef = useRef<HTMLDivElement | null>(null)
  const heroMosaicRef = useRef<PixelMosaicHandle | null>(null)
  const trackWrapRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const leftBtnRef = useRef<HTMLButtonElement | null>(null)
  const rightBtnRef = useRef<HTMLButtonElement | null>(null)
  const magBtnRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    document.title = 'Victoria Tsukanova'
    const prevHtmlBg = document.documentElement.style.backgroundColor
    const prevBodyBg = document.body.style.backgroundColor
    document.documentElement.style.backgroundColor = '#F1F4F3'
    document.body.style.backgroundColor = '#F1F4F3'
    return () => {
      document.documentElement.style.backgroundColor = prevHtmlBg
      document.body.style.backgroundColor = prevBodyBg
    }
  }, [])

  // Scroll reveal observer
  useEffect(() => {
    const root = pageRef.current
    if (!root) return

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal="true"]'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((item) => item.classList.add(styles.revealVisible))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealVisible)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  // Stack horizontal auto-scroll + arrow controls
  useEffect(() => {
    const trackWrap = trackWrapRef.current
    const track = trackRef.current
    const leftBtn = leftBtnRef.current
    const rightBtn = rightBtnRef.current
    if (!trackWrap || !track) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const originalCount = STACK.length
    const getSingleSetWidth = () => {
      const cards = track.querySelectorAll<HTMLElement>('[data-stack-card="true"]')
      if (originalCount > 0 && cards[originalCount] && cards[0]) {
        return cards[originalCount].offsetLeft - cards[0].offsetLeft
      }
      return track.scrollWidth / 3
    }

    let isPaused = false
    let manualScrollTimer: number | null = null
    let floatScroll = trackWrap.scrollLeft
    let rafId = 0

    const pauseTemporarily = (ms = 900) => {
      isPaused = true
      if (manualScrollTimer !== null) window.clearTimeout(manualScrollTimer)
      manualScrollTimer = window.setTimeout(() => {
        floatScroll = trackWrap.scrollLeft
        isPaused = false
      }, ms)
    }

    const onLeftClick = () => {
      const singleSetWidth = getSingleSetWidth()
      if (trackWrap.scrollLeft < 320 && singleSetWidth > 0) {
        trackWrap.scrollLeft += singleSetWidth
      }
      pauseTemporarily(850)
      trackWrap.scrollBy({ left: -320, behavior: 'smooth' })
    }

    const onRightClick = () => {
      pauseTemporarily(850)
      trackWrap.scrollBy({ left: 320, behavior: 'smooth' })
    }

    const onPointerEnter = () => {
      isPaused = true
    }

    const onPointerLeave = () => {
      floatScroll = trackWrap.scrollLeft
      isPaused = false
    }

    const onTouchStart = () => {
      isPaused = true
    }

    const onTouchEnd = () => {
      pauseTemporarily(1200)
    }

    leftBtn?.addEventListener('click', onLeftClick)
    rightBtn?.addEventListener('click', onRightClick)
    trackWrap.addEventListener('pointerenter', onPointerEnter)
    trackWrap.addEventListener('pointerleave', onPointerLeave)
    trackWrap.addEventListener('touchstart', onTouchStart, { passive: true })
    trackWrap.addEventListener('touchend', onTouchEnd, { passive: true })

    if (!prefersReducedMotion) {
      let lastTime = performance.now()
      const step = (now: number) => {
        const dt = Math.min(now - lastTime, 40)
        lastTime = now

        if (!isPaused) {
          const singleSetWidth = getSingleSetWidth()
          floatScroll += (dt / 1000) * 46
          if (singleSetWidth > 0 && floatScroll >= singleSetWidth) {
            floatScroll -= singleSetWidth
          }
          trackWrap.scrollLeft = floatScroll
        }
        rafId = window.requestAnimationFrame(step)
      }
      rafId = window.requestAnimationFrame(step)
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      if (manualScrollTimer !== null) window.clearTimeout(manualScrollTimer)
      leftBtn?.removeEventListener('click', onLeftClick)
      rightBtn?.removeEventListener('click', onRightClick)
      trackWrap.removeEventListener('pointerenter', onPointerEnter)
      trackWrap.removeEventListener('pointerleave', onPointerLeave)
      trackWrap.removeEventListener('touchstart', onTouchStart)
      trackWrap.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  // Subtle magnetic pull on Hero CTA
  useEffect(() => {
    const magBtn = magBtnRef.current
    if (!magBtn || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e: PointerEvent) => {
      const rect = magBtn.getBoundingClientRect()
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.18
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.18
      magBtn.style.transform = `translate(${dx}px, ${dy}px)`
    }

    const onLeave = () => {
      magBtn.style.transform = ''
    }

    magBtn.addEventListener('pointermove', onMove)
    magBtn.addEventListener('pointerleave', onLeave)
    return () => {
      magBtn.removeEventListener('pointermove', onMove)
      magBtn.removeEventListener('pointerleave', onLeave)
    }
  }, [heroAnimKey])

  const handleReplayHero = () => {
    heroMosaicRef.current?.replay()
    setHeroAnimKey((k) => k + 1)
  }

  return (
    <div ref={pageRef} className={styles.page}>
      <a className={styles.skip} href="#work">
        Skip to work
      </a>

      <SiteHeader currentPath="/" onLogoClick={handleReplayHero} />

      <main id="top">
        {/* HERO SECTION WITH 40-COL INTERACTIVE PIXEL MOSAIC */}
        <section className={styles.heroSection} aria-label="Introduction">
          <div className={styles.heroMosaicWrap}>
            <PixelMosaic
              ref={heroMosaicRef}
              grid="hero"
              className={styles.heroPixelGrid}
            />

            <div className={styles.heroContent} key={heroAnimKey}>
              <h1 className={styles.heroTitle}>
                <span className={styles.lineMask}>
                  <span className={styles.lineInner} style={{ '--d': '0.28s' } as CSSProperties}>
                    Hi, I&apos;m Vika
                  </span>
                </span>
                <span className={styles.lineMask}>
                  <span
                    className={`${styles.lineInner} ${styles.typedLine}`}
                    style={{ '--d': '0.42s' } as CSSProperties}
                  >
                    <span className={styles.typedRole} aria-live="polite">
                      {role}
                    </span>
                    <span className={styles.caret} aria-hidden="true" />
                  </span>
                </span>
              </h1>
              <div className={styles.heroCtaWrap}>
                <a ref={magBtnRef} href="#work" className={styles.btnPrimary}>
                  <span>Scroll down</span>
                  <span className={styles.btnArrow} aria-hidden="true">
                    ↓
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* MY STACK HORIZONTAL CAROUSEL */}
        <section className={`${styles.section} ${styles.stackCarouselSection}`} id="stack">
          <div className={styles.container}>
            <p className={`${styles.sectionKicker} ${styles.revealItem}`} data-reveal="true">
              Tools I build with
            </p>
            <div className={`${styles.sectionHeaderRow} ${styles.revealItem}`} data-reveal="true">
              <h2 className={styles.sectionTitle}>My Stack</h2>
              <div className={styles.scrollControls} aria-label="Stack carousel controls">
                <button
                  ref={leftBtnRef}
                  type="button"
                  className={styles.scrollBtn}
                  aria-label="Scroll stack left"
                >
                  ←
                </button>
                <button
                  ref={rightBtnRef}
                  type="button"
                  className={styles.scrollBtn}
                  aria-label="Scroll stack right"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div ref={trackWrapRef} className={styles.stackTrackWrap}>
            <div ref={trackRef} className={styles.stackTrack}>
              {[0, 1, 2].map((copyIdx) =>
                STACK.map((item) => (
                  <article
                    key={`${copyIdx}-${item.name}`}
                    className={styles.stackCard}
                    data-stack-card="true"
                    aria-hidden={copyIdx > 0 || undefined}
                  >
                    <div className={styles.stackIconBox}>
                      <svg
                        viewBox={`0 0 ${item.pixels[0].length} ${item.pixels.length}`}
                        className={styles.stackIconSvg}
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
                    <h3 className={styles.stackCardTitle}>{item.name}</h3>
                  </article>
                )),
              )}
            </div>
          </div>
        </section>

        {/* PIXEL DIVIDER */}
        <div className={styles.pixelDividerWrap}>
          <PixelMosaic grid="divider1" />
        </div>

        {/* MY WORK (SPLIT CARDS FOR ALL PROJECTS) */}
        <section className={styles.caseStudiesSection} id="work">
          <div className={styles.container}>
            <p className={`${styles.sectionKicker} ${styles.revealItem}`} data-reveal="true">
              Selected projects &amp; builds
            </p>
            <h2 className={`${styles.sectionTitle} ${styles.revealItem}`} data-reveal="true">
              My Work
            </h2>

            <div className={styles.caseStudiesStack}>
              {WORK.map((item, idx) => (
                <a
                  key={item.slug}
                  href={item.href}
                  className={`${styles.caseCard} ${styles.revealItem}`}
                  style={{ '--stagger': Math.min(idx, 2) } as CSSProperties}
                  data-reveal="true"
                  onClick={(event) => handleSpaClick(event, item.href, item.isSpaRoute)}
                >
                  <div className={styles.caseVisualPane}>
                    <ProjectPreview item={item} />
                  </div>
                  <div className={styles.caseBodyPane}>
                    <span className={styles.caseTag}>
                      {String(idx + 1).padStart(2, '0')} / {item.stack[0] ?? item.label}
                    </span>
                    <h3 className={styles.caseTitle}>{item.label}</h3>
                    <p className={styles.caseSummary}>{item.summary}</p>
                    <p className={styles.caseSubnote}>{item.stack.join(' · ')}</p>
                    <span className={styles.caseLink}>
                      <span>View project</span>
                      <span className={styles.linkArrow} aria-hidden="true">
                        ↗
                      </span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER PIXEL HORIZON TRANSITION */}
        <div className={styles.pixelHorizonWrap}>
          <PixelMosaic grid="horizon" />
        </div>
      </main>

      {/* GREEN CTA FOOTER */}
      <footer className={styles.siteFooter}>
        <div className={`${styles.container} ${styles.footerInner}`}>
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
              <a
                href="/about"
                className={styles.footerLink}
                onClick={(event) => handleSpaClick(event, '/about', true)}
              >
                About
              </a>
              <a
                href="https://www.linkedin.com/in/victoriatsukanova"
                target="_blank"
                rel="noreferrer"
                className={styles.footerLink}
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/vikatsukanova"
                target="_blank"
                rel="noreferrer"
                className={styles.footerLink}
              >
                GitHub
              </a>
              <a
                href="https://www.behance.net/VictoriaTsukanova"
                target="_blank"
                rel="noreferrer"
                className={styles.footerLink}
              >
                Behance
              </a>
              <a
                href="/brand/CV_Victoria_Tsukanova.pdf"
                target="_blank"
                rel="noreferrer"
                className={styles.footerLink}
              >
                Resume
              </a>
              <a href="#top" className={styles.footerLink}>
                Back to the top ↑
              </a>
            </div>
            <p className={styles.footerCopy}>© 2026 Victoria Tsukanova</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
