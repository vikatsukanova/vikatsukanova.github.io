import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  BUILD_PROJECT_SLUGS,
  HOME_PROJECT_SLUGS,
  PROJECTS,
  projectBySlug,
} from '../projects'

const PUBLIC_DIR = resolve(process.cwd(), 'public')

function publicAssetExists(assetPath: string) {
  const clean = assetPath.split('?')[0].split('#')[0].replace(/^\//, '')
  return existsSync(resolve(PUBLIC_DIR, clean))
}

describe('projects catalog integrity', () => {
  it('has unique slugs and resolves every featured home and build slug', () => {
    const slugs = PROJECTS.map((project) => project.slug)
    expect(new Set(slugs).size).toBe(slugs.length)

    for (const slug of [...HOME_PROJECT_SLUGS, ...BUILD_PROJECT_SLUGS]) {
      const project = projectBySlug(slug)
      expect(project, `Missing project for slug "${slug}"`).toBeDefined()
      expect(project?.label.trim().length).toBeGreaterThan(0)
      expect(project?.summary.trim().length).toBeGreaterThan(0)
    }
  })

  it('references only local public assets that exist on disk', () => {
    const localAssets = new Set<string>([
      '/brand/victoriatsukanova-logo.png',
      '/brand/CV_Victoria_Tsukanova.pdf',
      '/pixel-portrait.jpg',
    ])

    for (const project of PROJECTS) {
      if (project.image.startsWith('/')) localAssets.add(project.image)
      if (project.homeImage?.startsWith('/')) localAssets.add(project.homeImage)
      if (project.caseStudyHref?.startsWith('/')) localAssets.add(project.caseStudyHref)

      for (const section of project.caseStudy?.sections ?? []) {
        if (section.kind === 'gallery') {
          for (const img of section.images) {
            if (img.src.startsWith('/')) localAssets.add(img.src)
          }
        } else if (section.kind === 'logo') {
          if (section.src.startsWith('/')) localAssets.add(section.src)
        } else if (section.kind === 'featureSplit') {
          if (section.image.src.startsWith('/')) localAssets.add(section.image.src)
        }
      }
    }

    const missing = [...localAssets].filter((asset) => !publicAssetExists(asset))
    expect(missing).toEqual([])
  })
})
