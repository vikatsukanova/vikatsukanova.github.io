import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'

function renderAt(path: string) {
  window.history.pushState({}, '', path)
  return render(<App />)
}

describe('Portfolio routes and core UI', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('renders the homepage with the <vt/> logo header, Stack carousel, and Work cards', () => {
    renderAt('/')

    const brandLink = screen.getByRole('link', { name: 'Victoria Tsukanova homepage' })
    expect(brandLink).toHaveAttribute('href', '/')
    expect(brandLink.querySelector('img')).toHaveAttribute(
      'src',
      '/brand/victoriatsukanova-logo.png',
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hi, I'm Vika")
    expect(screen.getByRole('heading', { name: 'My Stack' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'My Work' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Compass' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'SideStage' })).toBeInTheDocument()
  })

  it('renders the About page with portrait, opening statement, skills, and interactive experience accordions', () => {
    renderAt('/about')

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /I bridge UI\/UX design with technical implementation/i,
    )
    expect(screen.getByAltText('Victoria Tsukanova')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Key skills' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument()

    const pelmorexToggle = screen.getByRole('button', { name: /UI\/UX Developer/i })
    expect(pelmorexToggle).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(pelmorexToggle)
    expect(pelmorexToggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders a case study page with split hero title, metadata, and zoomable hero mockup', () => {
    renderAt('/work/compass')

    expect(screen.getByRole('heading', { level: 1, name: 'Compass' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Expand Compass mockup' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '← All work' })).toBeInTheDocument()
  })

  it('renders a graceful not-found state for unknown project slugs', () => {
    renderAt('/work/non-existent-case-study')

    expect(screen.getByRole('heading', { level: 1, name: 'Not found' })).toBeInTheDocument()
  })
})
