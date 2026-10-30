import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  BUILD_PROJECT_SLUGS,
  HOME_PROJECT_SLUGS,
  projectBySlug,
  type CaseStudyAtomicCard,
  type CaseStudyChapter,
  type CaseStudyPrevNextSection,
  type CaseStudySection,
  type Project,
} from './projects'
import styles from './ProjectPage.module.css'

type LightboxShot = { src: string; alt: string }

const LightboxContext = createContext<(shot: LightboxShot) => void>(() => {})

function ImageLightbox({
  shot,
  onClose,
}: {
  shot: LightboxShot | null
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (shot) {
      if (!dialog.open) dialog.showModal()
      return
    }

    if (dialog.open) dialog.close()
  }, [shot])

  return (
    <dialog
      ref={dialogRef}
      className={styles.shotLightbox}
      aria-label="Expanded mockup"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
    >
      <form method="dialog" className={styles.shotLightboxBar}>
        <button type="submit" className={styles.shotLightboxClose} aria-label="Close">
          Close
        </button>
      </form>
      {shot ? <img src={shot.src} alt={shot.alt} /> : null}
    </dialog>
  )
}

function ZoomableShot({
  src,
  alt,
  loading,
  label,
}: {
  src: string
  alt: string
  loading?: 'lazy' | 'eager'
  label?: string
}) {
  const open = useContext(LightboxContext)
  const expandLabel = label || (alt ? `Expand ${alt}` : 'Expand mockup')

  return (
    <button
      type="button"
      className={styles.expandShot}
      aria-label={expandLabel}
      onClick={() => open({ src, alt })}
    >
      <img src={src} alt={alt} loading={loading} />
    </button>
  )
}

function navigate(href: string) {
  window.history.pushState({}, '', href)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

const SWATCH: Record<string, string> = {
  critical: styles.swatch_critical,
  warning: styles.swatch_warning,
  stable: styles.swatch_stable,
  brand: styles.swatch_brand,
}

function cleanTitle(title: string) {
  return title.replace(/^\/+|\/+$/g, '').trim()
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function padChapter(index: number) {
  return String(index + 1).padStart(2, '0')
}

function chapterLabel(index: number, title: string) {
  const cleaned = cleanTitle(title)
  const short = cleaned.length > 22 ? `${cleaned.slice(0, 20)}…` : cleaned
  return `${padChapter(index)} ${short}`
}

function isLeadGallery(section: CaseStudySection | undefined) {
  return (
    section?.kind === 'gallery' &&
    !cleanTitle(section.title) &&
    !section.title.toLowerCase().includes('wireframe')
  )
}

function isNavSection(section: CaseStudySection) {
  if (section.kind === 'prevNext') return false
  if (!('title' in section)) return false
  return Boolean(cleanTitle(section.title))
}

function deriveChapters(sections: readonly CaseStudySection[]): CaseStudyChapter[] {
  const chapters: CaseStudyChapter[] = []
  const used = new Set<string>()

  sections.forEach((section) => {
    if (!isNavSection(section) || !('title' in section)) return
    const title = cleanTitle(section.title)
    let id = slugify(title) || `section-${chapters.length + 1}`
    if (used.has(id)) id = `${id}-${chapters.length + 1}`
    used.add(id)
    chapters.push({ id, label: chapterLabel(chapters.length, title) })
  })

  return chapters
}

function sectionChapterId(
  section: CaseStudySection,
  chapters: readonly CaseStudyChapter[],
  titledIndex: number,
) {
  if (!isNavSection(section)) return undefined
  return chapters[titledIndex]?.id
}

function Headline({
  text,
  emphasis,
  fallback,
}: {
  text?: string
  emphasis?: string
  fallback: string
}) {
  const source = text?.trim() || fallback
  const lines = source.split('\n')

  return (
    <h1 className={styles.title}>
      {lines.map((line, lineIndex) => {
        const nodes: ReactNode[] = []
        if (emphasis && line.includes(emphasis)) {
          const parts = line.split(emphasis)
          parts.forEach((part, partIndex) => {
            if (part) nodes.push(part)
            if (partIndex < parts.length - 1) {
              nodes.push(
                <em key={`${lineIndex}-${partIndex}`} className={styles.titleEm}>
                  {emphasis}
                </em>,
              )
            }
          })
        } else {
          nodes.push(line)
        }

        return (
          <span key={lineIndex}>
            {lineIndex > 0 ? <br /> : null}
            {nodes}
          </span>
        )
      })}
    </h1>
  )
}

function SplitHeader({
  index,
  title,
  children,
}: {
  index: number
  title: string
  children?: ReactNode
}) {
  const cleaned = cleanTitle(title)
  if (!cleaned && !children) return null

  return (
    <div className={styles.split}>
      <div>
        {cleaned ? (
          <>
            <span className={styles.eyebrow}>
              {padChapter(index)} / {cleaned}
            </span>
            <h2 className={styles.heading}>{cleaned}</h2>
          </>
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  )
}

function AtomicPreview({ preview }: { preview: CaseStudyAtomicCard['preview'] }) {
  if (preview === 'atoms') {
    return (
      <div className={styles.previewBox}>
        <span className={styles.fakeBtn}>Primary</span>
        <div className={styles.chipRow}>
          <span className={`${styles.chip} ${styles.chipStable}`}>Published</span>
          <span className={`${styles.chip} ${styles.chipWarn}`}>In progress</span>
        </div>
      </div>
    )
  }

  if (preview === 'molecules') {
    return (
      <div className={styles.metricCard}>
        <div className={styles.metricTop}>
          <div>
            <p className={styles.metricTitle}>LDL-C</p>
            <p className={styles.metricSub}>Cholesterol</p>
          </div>
          <span className={`${styles.chip} ${styles.chipCritical}`}>High</span>
        </div>
        <p className={styles.metricValue}>
          4.2 <span>mmol/L</span>
        </p>
      </div>
    )
  }

  return (
    <div className={styles.organismPreview}>
      <div className={styles.organismRow}>
        <span className={styles.organismAvatar} />
        <span className={styles.organismLines}>
          <span />
          <span />
        </span>
      </div>
    </div>
  )
}

function CaseStudyBlock({
  section,
  chapterIndex,
  sectionId,
}: {
  section: CaseStudySection
  chapterIndex: number
  sectionId?: string
}) {
  if (section.kind === 'prevNext') return null

  const titled = isNavSection(section)
  const index = titled ? chapterIndex : -1

  switch (section.kind) {
    case 'prose':
      return (
        <section className={styles.section} id={sectionId}>
          <SplitHeader index={index} title={section.title}>
            {section.body.map((paragraph, i) => (
              <p key={paragraph} className={i === 0 ? styles.lead : styles.body}>
                {paragraph}
              </p>
            ))}
          </SplitHeader>
        </section>
      )

    case 'gallery': {
      const isWireframes = section.title.toLowerCase().includes('wireframe')
      const gallery = (
        <div
          className={`${styles.gallery} ${
            section.layout === 'long'
              ? styles.galleryLong
              : section.layout === 'stack'
                ? styles.galleryStack
                : styles.galleryRow
          }`}
        >
          {section.images.map((image) => (
            <figure key={image.src} className={styles.galleryItem}>
              <ZoomableShot src={image.src} alt={image.alt} loading="lazy" />
              {image.caption ? <figcaption>{image.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      )

      if (!titled) {
        return (
          <section className={`${styles.section} ${styles.sectionLead}`}>
            {section.intro ? <p className={styles.lead}>{section.intro}</p> : null}
            {gallery}
          </section>
        )
      }

      return (
        <section
          className={`${styles.section} ${isWireframes ? styles.wireframes : ''}`}
          id={sectionId}
        >
          <SplitHeader index={index} title={section.title}>
            {section.intro ? <p className={styles.lead}>{section.intro}</p> : null}
          </SplitHeader>
          {gallery}
        </section>
      )
    }

    case 'typography':
      return (
        <section className={styles.section} id={sectionId}>
          <SplitHeader index={index} title={section.title} />
          <div className={styles.typeSpecimens}>
            {section.fonts.map((font) => (
              <div key={font.name} className={styles.fontCard} style={{ fontFamily: font.family }}>
                <p className={styles.fontBig}>Aa</p>
                <p className={styles.fontName}>{font.name}</p>
                <p className={styles.fontDetails}>
                  abcdefghijklmnopqrstuvwxyz
                  <br />
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  1234567890
                </p>
              </div>
            ))}
          </div>
        </section>
      )

    case 'tokenGrid':
      return (
        <section className={styles.section} id={sectionId}>
          <SplitHeader index={index} title={section.title}>
            {section.intro?.map((paragraph, i) => (
              <p key={paragraph} className={i === 0 ? styles.lead : styles.body}>
                {paragraph}
              </p>
            ))}
          </SplitHeader>
          <div className={styles.colors}>
            {section.tokens.map((token) => (
              <div key={token.label} className={styles.colorSet}>
                <div
                  className={`${styles.color} ${token.swatch ? SWATCH[token.swatch] ?? '' : ''}`}
                  style={token.hex ? { background: token.hex } : undefined}
                  aria-hidden="true"
                />
                <p>{token.detail}</p>
              </div>
            ))}
          </div>
          {section.typeScale?.length ? (
            <div className={styles.typeScale}>
              {section.typeScale.map((row) => (
                <div key={row.token} className={styles.typeRow}>
                  <span className={styles.typeSample} data-level={row.label}>
                    {row.sample}
                  </span>
                  <span className={styles.tokenDetail}>{row.token}</span>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      )

    case 'logo':
      return (
        <section className={styles.section} id={sectionId}>
          <SplitHeader index={index} title={section.title} />
          <div className={styles.logoPanel}>
            <ZoomableShot src={section.src} alt={section.alt} />
          </div>
        </section>
      )

    case 'featureSplit':
      return (
        <section
          className={`${styles.section} ${styles.featureSplit} ${
            section.tone === 'muted' ? styles.featureMuted : ''
          } ${section.imageSide === 'right' ? styles.featureImageRight : ''}`}
          id={sectionId}
        >
          {titled ? <SplitHeader index={index} title={section.title} /> : null}
          <div className={styles.featureGrid}>
            <figure className={styles.featureImage}>
              <ZoomableShot
                src={section.image.src}
                alt={section.image.alt}
                loading="lazy"
              />
            </figure>
            <div className={styles.featureCopy}>
              {section.lead ? <p className={styles.featureLead}>{section.lead}</p> : null}
              {section.body?.map((paragraph) => (
                <p key={paragraph} className={styles.body}>
                  {paragraph}
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className={styles.list}>
                  {section.bullets.map((item) => (
                    <li key={item}>
                      <span aria-hidden="true">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </section>
      )

    case 'atomicCards':
      return (
        <section className={styles.section} id={sectionId}>
          <SplitHeader index={index} title={section.title}>
            <p className={styles.lead}>{section.intro}</p>
          </SplitHeader>
          <div className={styles.atomicGrid}>
            {section.cards.map((card) => (
              <article key={card.title} className={styles.atomicCard}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <AtomicPreview preview={card.preview} />
              </article>
            ))}
          </div>
        </section>
      )

    case 'numberedList':
      return (
        <section className={styles.section} id={sectionId}>
          <SplitHeader index={index} title={section.title} />
          <ol className={styles.numbered}>
            {section.items.map((item, itemIndex) => (
              <li key={item.title}>
                <span className={styles.num}>{itemIndex + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p className={styles.body}>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )

    case 'dx':
      return (
        <section className={styles.section} id={sectionId}>
          <SplitHeader index={index} title={section.title}>
            <p className={styles.lead}>{section.body}</p>
          </SplitHeader>
          <ul className={styles.list}>
            {section.points.map((point) => (
              <li key={point}>
                <span aria-hidden="true">—</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )

    default:
      return null
  }
}

function ThinProjectBody({ project }: { project: Project }) {
  return (
    <>
      {project.features.length ? (
        <section className={styles.section} id="features">
          <SplitHeader index={0} title="What it does">
            <ul className={styles.list}>
              {project.features.map((item) => (
                <li key={item}>
                  <span aria-hidden="true">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SplitHeader>
        </section>
      ) : null}
      {project.built.length ? (
        <section className={styles.section} id="built">
          <SplitHeader index={project.features.length ? 1 : 0} title="How it was built">
            <ul className={styles.list}>
              {project.built.map((item) => (
                <li key={item}>
                  <span aria-hidden="true">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SplitHeader>
        </section>
      ) : null}
    </>
  )
}

function neighborsFor(slug: string, explicit?: CaseStudyPrevNextSection) {
  const order = [...HOME_PROJECT_SLUGS, ...BUILD_PROJECT_SLUGS].filter((item) =>
    projectBySlug(item),
  )
  const index = order.indexOf(slug as (typeof order)[number])
  const fromOrder =
    index >= 0
      ? {
          previous: index > 0 ? { slug: order[index - 1] } : undefined,
          next: index < order.length - 1 ? { slug: order[index + 1] } : undefined,
        }
      : { previous: undefined, next: undefined }

  return {
    previous: explicit?.previous ?? fromOrder.previous,
    next: explicit?.next ?? fromOrder.next,
  }
}

function useChapterObserver(chapterIds: readonly string[]) {
  const [activeId, setActiveId] = useState(chapterIds[0] ?? '')
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!chapterIds.length) return

    const sections = chapterIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!sections.length) return

    const setActive = (id: string) => {
      setActiveId(id)
      const nav = navRef.current
      if (!nav) return
      nav.querySelectorAll('a[href^="#"]').forEach((link) => {
        const active = link.getAttribute('href') === `#${id}`
        link.classList.toggle(styles.chapterActive, active)
      })
    }

    setActive(chapterIds[0])

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [chapterIds])

  return { activeId, navRef }
}

export function ProjectPage({ slug }: { slug: string }) {
  const project = projectBySlug(slug)
  const [lightbox, setLightbox] = useState<LightboxShot | null>(null)
  const openLightbox = useCallback((shot: LightboxShot) => setLightbox(shot), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    document.title = project ? `${project.label} — Victoria Tsukanova` : 'Victoria Tsukanova'
    window.scrollTo(0, 0)
  }, [project])

  useEffect(() => {
    setLightbox(null)
  }, [slug])

  const sections = project?.caseStudy?.sections ?? []
  const first = sections[0]
  const leadGallery = isLeadGallery(first) ? first : undefined
  const contentSections = leadGallery ? sections.slice(1) : sections
  const explicitPrevNext = sections.find(
    (section): section is CaseStudyPrevNextSection => section.kind === 'prevNext',
  )

  const chapters = useMemo(() => {
    if (!project) return []
    if (project.caseStudy?.chapters?.length) return [...project.caseStudy.chapters]
    if (project.caseStudy) {
      const all = project.caseStudy.sections
      const lead = isLeadGallery(all[0])
      return deriveChapters(lead ? all.slice(1) : all)
    }
    const thin: CaseStudyChapter[] = []
    if (project.features.length) thin.push({ id: 'features', label: '01 Features' })
    if (project.built.length) {
      thin.push({
        id: 'built',
        label: `${padChapter(thin.length)} Build`,
      })
    }
    return thin
  }, [project])

  const chapterIds = useMemo(() => chapters.map((chapter) => chapter.id), [chapters])
  const { activeId, navRef } = useChapterObserver(chapterIds)
  const neighbors = neighborsFor(slug, explicitPrevNext)

  const eyebrow = project
    ? `${project.label} · ${project.stack[0] ?? 'Product Design'}`
    : ''

  let titledCursor = -1

  return (
    <LightboxContext.Provider value={openLightbox}>
    <div className={styles.page}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <main id="main" className={styles.main}>
        {project ? (
          <>
            <section className={styles.hero}>
              <a
                className={styles.back}
                href="/"
                onClick={(event) => {
                  event.preventDefault()
                  navigate('/')
                }}
              >
                ← Home
              </a>
              <div className={styles.eyebrow}>{eyebrow}</div>
              <div className={styles.heroline}>
                <div className={styles.heroCopy}>
                  <Headline
                    text={project.caseStudy?.headline}
                    emphasis={project.caseStudy?.headlineEmphasis}
                    fallback={project.label}
                  />
                  <p className={styles.intro}>
                    {project.caseStudy?.outcome ?? project.summary}
                  </p>
                  <dl className={styles.meta}>
                    {project.role ? (
                      <div>
                        <dt>Role</dt>
                        <dd>{project.role}</dd>
                      </div>
                    ) : null}
                    {project.client ? (
                      <div>
                        <dt>Client</dt>
                        <dd>{project.client}</dd>
                      </div>
                    ) : null}
                    {project.collaborators ? (
                      <div>
                        <dt>Collaborators</dt>
                        <dd>{project.collaborators}</dd>
                      </div>
                    ) : null}
                  </dl>
                  {project.site ? (
                    <a
                      className={styles.launch}
                      href={project.site}
                      target={project.site.startsWith('http') ? '_blank' : undefined}
                      rel={project.site.startsWith('http') ? 'noreferrer' : undefined}
                    >
                      {project.site.startsWith('http') ? 'Launch demo' : 'Launch site'}
                    </a>
                  ) : null}
                </div>
                <figure className={styles.heroShot}>
                  <ZoomableShot
                    src={project.image}
                    alt=""
                    label={`Expand ${project.label} mockup`}
                  />
                </figure>
              </div>
            </section>

            {project.caseStudy?.preface ? (
              <div className={styles.contextPreface}>
                <span className={styles.eyebrow}>Preface</span>
                <p className={styles.contextIntro}>{project.caseStudy.preface}</p>
              </div>
            ) : null}

            <div className={styles.caseLayout}>
              {chapters.length ? (
                <nav
                  ref={navRef}
                  className={styles.chapterNav}
                  aria-label="Case study chapters"
                >
                  {chapters.map((chapter) => (
                    <a
                      key={chapter.id}
                      href={`#${chapter.id}`}
                      className={activeId === chapter.id ? styles.chapterActive : undefined}
                      onClick={(event) => {
                        event.preventDefault()
                        document.getElementById(chapter.id)?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                      }}
                    >
                      {chapter.label}
                    </a>
                  ))}
                </nav>
              ) : (
                <div />
              )}

              <div className={styles.caseContent}>
                {leadGallery ? (
                  <CaseStudyBlock section={leadGallery} chapterIndex={-1} />
                ) : null}

                {project.caseStudy ? (
                  contentSections.map((section, index) => {
                    if (isNavSection(section)) titledCursor += 1
                    const chapterIndex = titledCursor
                    const sectionId = sectionChapterId(section, chapters, chapterIndex)
                    return (
                      <CaseStudyBlock
                        key={`${section.kind}-${index}`}
                        section={section}
                        chapterIndex={chapterIndex}
                        sectionId={sectionId}
                      />
                    )
                  })
                ) : (
                  <ThinProjectBody project={project} />
                )}

                <nav className={styles.prevNext} aria-label="More case studies">
                  {neighbors.previous ? (
                    <a
                      href={`/work/${neighbors.previous.slug}`}
                      onClick={(event) => {
                        event.preventDefault()
                        const href =
                          projectBySlug(neighbors.previous!.slug)?.caseStudyHref ??
                          `/work/${neighbors.previous!.slug}`
                        if (href.startsWith('/demos/')) {
                          window.location.assign(href)
                          return
                        }
                        navigate(href)
                      }}
                    >
                      ← Previous
                    </a>
                  ) : (
                    <span />
                  )}
                  <a
                    href="/"
                    onClick={(event) => {
                      event.preventDefault()
                      navigate('/')
                    }}
                  >
                    All work
                  </a>
                  {neighbors.next ? (
                    <a
                      href={`/work/${neighbors.next.slug}`}
                      onClick={(event) => {
                        event.preventDefault()
                        const href =
                          projectBySlug(neighbors.next!.slug)?.caseStudyHref ??
                          `/work/${neighbors.next!.slug}`
                        if (href.startsWith('/demos/')) {
                          window.location.assign(href)
                          return
                        }
                        navigate(href)
                      }}
                    >
                      Next →
                    </a>
                  ) : (
                    <span />
                  )}
                </nav>
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
      {project ? (
        <footer className={styles.footer}>
          <span>Vika Tsukanova · {project.label}</span>
          <a href="#main">Back to top ↑</a>
        </footer>
      ) : null}
      <ImageLightbox shot={lightbox} onClose={closeLightbox} />
    </div>
    </LightboxContext.Provider>
  )
}
