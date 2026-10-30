import type { ReactNode } from 'react'
import styles from './SiteChrome.module.css'

export function navigate(href: string) {
  window.history.pushState({}, '', href)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function isActive(path: string, href: string) {
  if (href === '/') return path === '/' || path === '' || path.startsWith('/work/')
  return path === href || path.startsWith(`${href}/`)
}

export function SiteChrome({
  children,
  path = typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '') || '/' : '/',
}: {
  children: ReactNode
  path?: string
}) {
  const current = path || '/'

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <a
          className={styles.logo}
          href="/"
          aria-label="home"
          onClick={(event) => {
            event.preventDefault()
            navigate('/')
          }}
        >
          <img src="/brand/victoriatsukanova-logo.png" alt="" width={85} height={35} />
        </a>
        <nav className={styles.nav} aria-label="Primary">
          <a
            href="/"
            className={isActive(current, '/') ? styles.active : undefined}
            onClick={(event) => {
              event.preventDefault()
              navigate('/')
            }}
          >
            Work
          </a>
          <a
            href="/about"
            className={isActive(current, '/about') ? styles.active : undefined}
            onClick={(event) => {
              event.preventDefault()
              navigate('/about')
            }}
          >
            About
          </a>
        </nav>
      </header>

      {children}

      <footer className={styles.footer}>
        <h3 className={styles.footerTitle}>Ways to get in touch:</h3>
        <div className={styles.social}>
          <a href="mailto:victoriatsukanova@gmail.com" aria-label="Email">
            <EmailIcon />
          </a>
          <a
            href="https://ca.linkedin.com/in/victoriatsukanova"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://www.behance.net/VictoriaTsukanova"
            target="_blank"
            rel="noreferrer"
            aria-label="Behance"
          >
            <BehanceIcon />
          </a>
          <a
            href="https://github.com/vikatsukanova"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
        </div>
      </footer>
    </div>
  )
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
      />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.94 8.5H3.75V20h3.19V8.5zM5.34 3C4.22 3 3.3 3.92 3.3 5.05c0 1.12.92 2.04 2.05 2.04 1.12 0 2.03-.92 2.03-2.04C7.38 3.92 6.46 3 5.34 3zM20.25 20h-3.18v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95V20H9.88V8.5h3.05v1.57h.04c.42-.8 1.46-1.65 3-1.65 3.21 0 3.8 2.11 3.8 4.86V20z"
      />
    </svg>
  )
}

function BehanceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8.8 11.2c.9-.4 1.4-1.1 1.4-2.1 0-1.7-1.2-2.6-3.4-2.6H2v10.9h5.1c2.3 0 3.8-1.1 3.8-3.1 0-1.4-.7-2.4-2.1-3.1zm-4.3-2.7h2c.9 0 1.4.4 1.4 1.1S7.4 11 6.4 11h-1.9V8.5zm2.2 7.3H4.5v-2.8h2.3c1.1 0 1.7.5 1.7 1.4s-.7 1.4-1.8 1.4zM14.8 7.4h4.7V6h-4.7v1.4zm5.7 3.1c-.7-.8-1.8-1.3-3.2-1.3-2.6 0-4.4 1.8-4.4 4.3 0 2.6 1.8 4.3 4.5 4.3 1.6 0 2.8-.5 3.6-1.5l.1-.1-1.3-1c-.5.6-1.2.9-2.1.9-1.3 0-2.2-.8-2.4-2.1h6.4v-.6c0-1.8-.6-3.1-1.6-4zm-4.7 2.2c.2-1.1 1-1.8 2.1-1.8 1.1 0 1.8.7 1.9 1.8h-4z"
      />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.8c.85 0 1.71.12 2.51.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.59.69.48A10.27 10.27 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"
      />
    </svg>
  )
}
