import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react'
import { PixelMosaic } from './PixelMosaic'
import {
  BUILD_PROJECT_SLUGS,
  HOME_PROJECT_SLUGS,
  projectBySlug,
  type CaseStudyAtomicCard,
  type CaseStudyPrevNextSection,
  type CaseStudySection,
  type Project,
} from './projects'
import styles from './ProjectPage.module.css'
import { navigate } from './navigation'
import { SiteHeader } from './SiteHeader'

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

function handleProjectNav(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return
  }
  if (href.startsWith('/demos/') || href.startsWith('http') || href.startsWith('mailto:')) {
    return
  }
  event.preventDefault()
  navigate(href)
  window.scrollTo({ top: 0, behavior: 'auto' })
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
      <div className={styles.previewBox}>
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
    <div className={styles.previewBox}>
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

function CaseStudyRow({
  section,
  isFirst,
  isLast,
}: {
  section: CaseStudySection
  isFirst: boolean
  isLast: boolean
}) {
  if (section.kind === 'prevNext') return null

  const label = 'title' in section ? cleanTitle(section.title) : ''
  const id = label ? slugify(label) : undefined
  const rowClasses = `${styles.row} ${isFirst ? styles.rowLeadTop : ''} ${
    isLast ? styles.rowLast : ''
  }`

  switch (section.kind) {
    case 'prose':
      return (
        <section className={rowClasses} id={id}>
          <span className={styles.lab}>{label || 'Overview'}</span>
          <div className={styles.rowBody}>
            {section.body.map((paragraph, i) => (
              <p
                key={paragraph}
                className={i === 0 ? styles.body : `${styles.body} ${styles.bodyMuted}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )

    case 'gallery': {
      const count = section.images.length
      const gridClass =
        section.layout === 'long'
          ? `${styles.galleryGrid} ${styles.galleryLong}`
          : count === 1 || section.layout === 'stack'
            ? `${styles.galleryGrid} ${styles.gallerySingle}`
            : count === 2 || count === 4
              ? `${styles.galleryGrid} ${styles.galleryTwo}`
              : styles.galleryGrid

      return (
        <section className={rowClasses} id={id}>
          <span className={styles.lab}>{label || 'Screens'}</span>
          <div className={styles.rowBody}>
            {section.intro ? <p className={styles.body}>{section.intro}</p> : null}
            <div className={gridClass}>
              {section.images.map((image) => (
                <figure key={image.src} className={styles.galleryFigure}>
                  <div className={styles.card}>
                    <ZoomableShot src={image.src} alt={image.alt} loading="lazy" />
                  </div>
                  {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'typography':
      return (
        <section className={rowClasses} id={id}>
          <span className={styles.lab}>{label || 'Typography'}</span>
          <div className={styles.rowBody}>
            <div className={styles.typeGrid}>
              {section.fonts.map((font) => (
                <div
                  key={font.name}
                  className={styles.panel}
                  style={{ fontFamily: font.family }}
                >
                  <p className={styles.fontBig}>Aa</p>
                  <p className={`${styles.lab} ${styles.fontName}`}>{font.name}</p>
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
          </div>
        </section>
      )

    case 'tokenGrid':
      return (
        <section className={rowClasses} id={id}>
          <span className={styles.lab}>{label || 'Tokens'}</span>
          <div className={styles.rowBody}>
            {section.intro?.map((paragraph) => (
              <p key={paragraph} className={styles.body}>
                {paragraph}
              </p>
            ))}
            <div className={styles.panel}>
              <div className={styles.tokGrid}>
                {section.tokens.map((token) => (
                  <div key={token.label} className={styles.tok}>
                    <span
                      className={`${styles.tokSwatch} ${
                        token.swatch ? (SWATCH[token.swatch] ?? '') : ''
                      }`}
                      style={token.hex ? { background: token.hex } : undefined}
                      aria-hidden="true"
                    />
                    <span className={styles.tokLabel}>{token.label}</span>
                    {token.detail && token.detail !== token.label ? (
                      <span className={styles.tokDetail}>{token.detail}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            {section.typeScale?.length ? (
              <div className={`${styles.panel} ${styles.typeScale}`}>
                {section.typeScale.map((row) => (
                  <div key={row.token} className={styles.typeScaleRow}>
                    <span className={styles.typeScaleMeta}>
                      {row.label} · {row.token}
                    </span>
                    <span className={styles.typeSample} data-level={row.label}>
                      {row.sample}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      )

    case 'logo':
      return (
        <section className={rowClasses} id={id}>
          <span className={styles.lab}>{label || 'Logo'}</span>
          <div className={styles.rowBody}>
            <div className={styles.logoPanel}>
              <ZoomableShot src={section.src} alt={section.alt} />
            </div>
          </div>
        </section>
      )

    case 'featureSplit':
      return (
        <section className={rowClasses} id={id}>
          <span className={styles.lab}>{label || 'Feature'}</span>
          <div className={styles.rowBody}>
            <div
              className={`${styles.featurePanel} ${
                section.imageSide === 'right' ? styles.featurePanelRight : ''
              }`}
            >
              <figure className={styles.featureMedia}>
                <ZoomableShot src={section.image.src} alt={section.image.alt} loading="lazy" />
              </figure>
              <div className={styles.featureCopy}>
                {section.lead ? <h3 className={styles.featureLead}>{section.lead}</h3> : null}
                {section.body?.map((paragraph) => (
                  <p key={paragraph} className={styles.featureText}>
                    {paragraph}
                  </p>
                ))}
                {section.bullets?.length ? (
                  <ul className={styles.featureBullets}>
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      )

    case 'atomicCards':
      return (
        <section className={rowClasses} id={id}>
          <span className={styles.lab}>{label || 'Components'}</span>
          <div className={styles.rowBody}>
            <p className={styles.body}>{section.intro}</p>
            <div className={styles.atomicGrid}>
              {section.cards.map((card) => (
                <article key={card.title} className={styles.atomicCard}>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <AtomicPreview preview={card.preview} />
                </article>
              ))}
            </div>
          </div>
        </section>
      )

    case 'numberedList':
      return (
        <section className={rowClasses} id={id}>
          <span className={styles.lab}>{label || 'Highlights'}</span>
          <div className={styles.rowBody}>
            <div className={styles.statGrid}>
              {section.items.map((item, itemIndex) => (
                <article key={item.title} className={styles.statCard}>
                  <span className={styles.statNum}>
                    {String(itemIndex + 1).padStart(2, '0')}
                  </span>
                  <h3 className={styles.statTitle}>{item.title}</h3>
                  <p className={styles.statDesc}>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )

    case 'dx':
      return (
        <section className={rowClasses} id={id}>
          <span className={styles.lab}>{label || 'Engineering'}</span>
          <div className={styles.rowBody}>
            <p className={styles.body}>{section.body}</p>
            <ul className={styles.bodyList}>
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
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
        <section className={`${styles.row} ${styles.rowLeadTop}`} id="features">
          <span className={styles.lab}>What it does</span>
          <div className={styles.rowBody}>
            <ul className={styles.bodyList}>
              {project.features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
      {project.built.length ? (
        <section className={`${styles.row} ${styles.rowLast}`} id="built">
          <span className={styles.lab}>How it was built</span>
          <div className={styles.rowBody}>
            <ul className={styles.bodyList}>
              {project.built.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  )
}

function projectHref(slug: string) {
  return projectBySlug(slug)?.caseStudyHref ?? `/work/${slug}`
}

function neighborsFor(slug: string, explicit?: CaseStudyPrevNextSection) {
  const order = [...HOME_PROJECT_SLUGS, ...BUILD_PROJECT_SLUGS].filter((item) =>
    projectBySlug(item),
  )
  const index = order.indexOf(slug as (typeof order)[number])
  const prevSlug =
    explicit?.previous?.slug ??
    (index > 0 ? order[index - 1] : order[order.length - 1])
  const nextSlug =
    explicit?.next?.slug ??
    (index >= 0 && index < order.length - 1 ? order[index + 1] : order[0])

  return {
    index: index >= 0 ? index + 1 : 1,
    previous: prevSlug && prevSlug !== slug ? projectBySlug(prevSlug) : undefined,
    next: nextSlug && nextSlug !== slug ? projectBySlug(nextSlug) : undefined,
  }
}

function ProjectPageInner({ slug }: { slug: string }) {
  const project = projectBySlug(slug)
  const [lightbox, setLightbox] = useState<LightboxShot | null>(null)

  const openLightbox = useCallback((shot: LightboxShot) => setLightbox(shot), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    document.title = project ? `${project.label} — Victoria Tsukanova` : 'Victoria Tsukanova'
    window.scrollTo(0, 0)

    const prevHtmlBg = document.documentElement.style.backgroundColor
    const prevBodyBg = document.body.style.backgroundColor
    document.documentElement.style.backgroundColor = '#F1F4F3'
    document.body.style.backgroundColor = '#F1F4F3'
    return () => {
      document.documentElement.style.backgroundColor = prevHtmlBg
      document.body.style.backgroundColor = prevBodyBg
    }
  }, [project])

  const allSections = project?.caseStudy?.sections ?? []
  const explicitPrevNext = allSections.find(
    (section): section is CaseStudyPrevNextSection => section.kind === 'prevNext',
  )
  const visibleSections = allSections.filter((section) => section.kind !== 'prevNext')
  const neighbors = neighborsFor(slug, explicitPrevNext)

  // Place the mid-page pixel band after the opening narrative/gallery section(s)
  const midBandIndex = visibleSections.length >= 4 ? 2 : -1

  return (
    <LightboxContext.Provider value={openLightbox}>
      <div className={styles.page}>
        <a className={styles.skip} href="#main">
          Skip to content
        </a>

        <SiteHeader currentPath="/work" />

        <main id="main">
          {project ? (
            <>
              <div className={styles.inner}>
                <section
                  className={styles.heroSplit}
                  aria-label={`${project.label} overview`}
                >
                  <div className={styles.heroCopy}>
                    <a
                      className={`${styles.lab} ${styles.ul} ${styles.heroBack}`}
                      href="/"
                      onClick={(event) => handleProjectNav(event, '/')}
                    >
                      ← All work
                    </a>
                    <div className={styles.heroKickerRow}>
                      <span className={`${styles.lab} ${styles.heroKicker}`}>
                        Case study {String(neighbors.index).padStart(2, '0')}
                        {project.stack[0] ? ` · ${project.stack[0]}` : ''}
                      </span>
                    </div>
                    <h1 className={styles.title}>{project.label}</h1>
                    <p className={styles.subtitle}>
                      {project.caseStudy?.outcome ?? project.summary}
                    </p>
                    {project.site ? (
                      <div className={styles.heroActions}>
                        <a
                          className={styles.heroPrimaryBtn}
                          href={project.site}
                          target={project.site.startsWith('http') ? '_blank' : undefined}
                          rel={project.site.startsWith('http') ? 'noreferrer' : undefined}
                        >
                          {project.site.startsWith('http') ? 'Launch demo ↗' : 'Launch site ↗'}
                        </a>
                      </div>
                    ) : null}
                  </div>

                  <figure className={styles.heroMediaCard}>
                    <ZoomableShot
                      src={project.image}
                      alt={`${project.label} hero mockup`}
                      label={`Expand ${project.label} mockup`}
                      loading="eager"
                    />
                  </figure>
                </section>

                <div className={styles.metaBar}>
                  {project.role ? (
                    <div className={styles.metaItem}>
                      <span className={styles.lab}>Role</span>
                      <span>{project.role}</span>
                    </div>
                  ) : null}
                  {project.stack.length ? (
                    <div className={styles.metaItem}>
                      <span className={styles.lab}>Stack</span>
                      <span>{project.stack.join(' · ')}</span>
                    </div>
                  ) : null}
                  {project.client ? (
                    <div className={styles.metaItem}>
                      <span className={styles.lab}>Client</span>
                      <span>{project.client}</span>
                    </div>
                  ) : null}
                  {project.collaborators ? (
                    <div className={styles.metaItem}>
                      <span className={styles.lab}>Collaborators</span>
                      <span>{project.collaborators}</span>
                    </div>
                  ) : null}
                  {project.site ? (
                    <div className={styles.metaItem}>
                      <span className={styles.lab}>Links</span>
                      <div className={styles.metaLinks}>
                        <a
                          className={styles.ul}
                          href={project.site}
                          target={project.site.startsWith('http') ? '_blank' : undefined}
                          rel={project.site.startsWith('http') ? 'noreferrer' : undefined}
                        >
                          {project.site.startsWith('http') ? 'Launch demo ↗' : 'Launch site ↗'}
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* 4-row pixel band transitioning into the case study body */}
              <div className={`${styles.bandWrap} ${styles.bandWrapTop}`}>
                <PixelMosaic grid="caseTop" />
              </div>

              {project.caseStudy?.preface ? (
                <div className={styles.inner}>
                  <section className={`${styles.row} ${styles.rowLeadTop}`} id="preface">
                    <span className={styles.lab}>Preface</span>
                    <div className={styles.rowBody}>
                      <p className={styles.body}>{project.caseStudy.preface}</p>
                    </div>
                  </section>
                </div>
              ) : null}

              {project.caseStudy ? (
                visibleSections.map((section, index) => {
                  const isFirst = index === 0 && !project.caseStudy?.preface
                  const isLast = index === visibleSections.length - 1
                  return (
                    <Fragment key={`${section.kind}-${index}`}>
                      {index === midBandIndex ? (
                        <div className={styles.bandWrap}>
                          <PixelMosaic grid="caseMid" />
                        </div>
                      ) : null}
                      <div className={styles.inner}>
                        <CaseStudyRow
                          section={section}
                          isFirst={isFirst}
                          isLast={isLast}
                        />
                      </div>
                    </Fragment>
                  )
                })
              ) : (
                <div className={styles.inner}>
                  <ThinProjectBody project={project} />
                </div>
              )}

              {/* 6-row pixel band transitioning into the green Next case study footer */}
              <div className={`${styles.bandWrap} ${styles.bandWrapFooter}`}>
                <PixelMosaic grid="caseFooter" />
              </div>

              <footer className={styles.footerBannerWrap}>
                {neighbors.next ? (
                  <a
                    className={styles.nextBanner}
                    href={projectHref(neighbors.next.slug)}
                    onClick={(event) =>
                      handleProjectNav(event, projectHref(neighbors.next!.slug))
                    }
                  >
                    <span className={styles.lab}>Next case study</span>
                    <span className={styles.nextTitle}>{neighbors.next.label} →</span>
                  </a>
                ) : (
                  <a
                    className={styles.nextBanner}
                    href="/"
                    onClick={(event) => handleProjectNav(event, '/')}
                  >
                    <span className={styles.lab}>Portfolio</span>
                    <span className={styles.nextTitle}>All work →</span>
                  </a>
                )}

                <div className={styles.footerSub}>
                  <div className={styles.footerSubLinks}>
                    {neighbors.previous ? (
                      <a
                        href={projectHref(neighbors.previous.slug)}
                        onClick={(event) =>
                          handleProjectNav(event, projectHref(neighbors.previous!.slug))
                        }
                      >
                        ← Previous: {neighbors.previous.label}
                      </a>
                    ) : null}
                    <a href="/" onClick={(event) => handleProjectNav(event, '/')}>
                      All work
                    </a>
                    <a href="#main">Back to top ↑</a>
                  </div>
                  <span>© 2026 Victoria Tsukanova</span>
                </div>
              </footer>
            </>
          ) : (
            <div className={`${styles.inner} ${styles.notFound}`}>
              <h1 className={styles.title}>Not found</h1>
              <p className={styles.body}>This project page is not up yet.</p>
            </div>
          )}
        </main>

        <svg className={styles.grain} aria-hidden="true">
          <filter id="case-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#case-grain)" />
        </svg>

        <ImageLightbox shot={lightbox} onClose={closeLightbox} />
      </div>
    </LightboxContext.Provider>
  )
}

export function ProjectPage({ slug }: { slug: string }) {
  return <ProjectPageInner key={slug} slug={slug} />
}
