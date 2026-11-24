import { useEffect, useState, type MouseEvent } from 'react'
import { navigate } from './SiteChrome'
import styles from './SiteHeader.module.css'

type SiteHeaderProps = {
  currentPath?: '/' | '/about' | '/work'
  onLogoClick?: () => void
}

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return !(
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  )
}

export function SiteHeader({ currentPath, onLogoClick }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainLeftClick(event)) return
    event.preventDefault()

    if (currentPath === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      onLogoClick?.()
      return
    }

    navigate('/')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const handleWorkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainLeftClick(event)) return
    event.preventDefault()

    if (currentPath === '/') {
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    navigate('/')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const handleAboutClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainLeftClick(event)) return
    event.preventDefault()

    if (currentPath === '/about') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    navigate('/about')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.inner}>
        <a
          href="/"
          className={styles.brand}
          aria-label="Victoria Tsukanova homepage"
          onClick={handleLogoClick}
        >
          <img
            src="/brand/victoriatsukanova-logo.png"
            alt=""
            width={85}
            height={35}
            className={styles.logoImg}
          />
        </a>

        <nav className={styles.nav} aria-label="Main navigation">
          <a
            href={currentPath === '/' ? '#work' : '/'}
            className={`${styles.navLink} ${currentPath === '/work' ? styles.navLinkActive : ''}`}
            onClick={handleWorkClick}
          >
            Work
          </a>
          <a
            href="/about"
            className={`${styles.navLink} ${currentPath === '/about' ? styles.navLinkActive : ''}`}
            aria-current={currentPath === '/about' ? 'page' : undefined}
            onClick={handleAboutClick}
          >
            About
          </a>
          <a
            href="https://www.linkedin.com/in/victoriatsukanova"
            target="_blank"
            rel="noreferrer"
            className={styles.navLink}
          >
            LinkedIn
          </a>
          <a
            href="/brand/CV_Victoria_Tsukanova.pdf"
            target="_blank"
            rel="noreferrer"
            className={styles.navLink}
          >
            Resume
          </a>
          <a href="mailto:victoriatsukanova@gmail.com" className={styles.navLink}>
            Say hi
          </a>
        </nav>
      </div>
    </header>
  )
}
