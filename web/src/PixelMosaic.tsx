import { useEffect, useImperativeHandle, useRef, type Ref } from 'react'

export type GridName =
  | 'hero'
  | 'heroMobile'
  | 'divider1'
  | 'divider2'
  | 'horizon'
  | 'caseTop'
  | 'caseMid'
  | 'caseFooter'

export type PixelMosaicHandle = {
  replay: () => void
}

function hashCell(x: number, y: number, s: number) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 2246822519)) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}

const BAND_PALETTE = ['c', 'P', 'b', 'B', 'G'] as const

function generateBand(seed: number, rows: number, density: (r: number, n: number) => number) {
  const out: string[] = []
  for (let r = 0; r < rows; r++) {
    let line = ''
    for (let c = 0; c < 40; c++) {
      const on = hashCell(c, r, seed) < density(r, rows)
      if (!on) {
        line += '.'
      } else if (hashCell(c, r, seed + 2) < 0.03) {
        line += 'L'
      } else {
        line += BAND_PALETTE[Math.floor(hashCell(c, r, seed + 1) * 5)] ?? 'c'
      }
    }
    out.push(line)
  }
  return out
}

// Exact 40-column pixel grids matching the layout architecture (+ 16x29 portrait hero for mobile)
const GRIDS: Record<GridName, readonly string[]> = {
  hero: [
    '.G.G.G..G.G.G.G...G..G...G...G.G..G...G.',
    'GGGGGGGGG..G.G....b..c....G...G.GGGGGGGG',
    'BBBBGGBBGG..b...c......P...b..G.GGGGBGGG',
    'BbBBBBbBBc.P................P.cBBbBBBBbB',
    'bbBBBBbbc......................cbbBBBBbb',
    'bbbBbbbbP......................PbbbbBbbb',
    'bbbbBbbPc......................cPbbbBbbb',
    'bbb.bbPPc......................cPPbb.bbb',
    'PbbbbbPPc......................cPPbbbbbP',
    'PP.bbPPPc......................cPPPbb.PP',
    'PPPbbPPc........................cPPbbPPP',
    'PPPPbPPc........................cPPbPPPP',
    'PPPb.bPPc......................cPPb.bPPP',
    'PPbbbbPPc......................cPPbbbbPP',
    'PPbbBBbPP......................PPbBBbbPP',
    'bbbbBBBPPPb..................bPPPBBBbbbb',
    'bbbbBBPBBb.b................b.bBBPBBbbbb',
    'BBBBbbBBBG..G..b.P....P.b..G..GBBBbbBBBB',
    'GBBBBbBBBB.GG.B.bb.cc.bb.B.GG.BBBBbBBBBG',
    'GGGBbBBBB.BB.GGGG.Bccb.GGGG.BB.BBBBbBGGG',
    'GGGBBBB.G..BB..GB..BBB.B.Bb.b.BGG...bbBB',
    'cGbbc.PPbbcbBcbGBBb.ccbbPbbBBcBBcPbcGGBP',
    '.PP.B.GcBPbc.cc..GPbbbbb..BBPGcPbG.GP.c.',
    'c.BBb..bBPPc..c.cbGcP.c..PBb.G..P..P.bBG',
    '.c.P....b.b.....c.bbBb...GP...c.b.G.BP..',
  ],
  heroMobile: [
    '.G.G.G..G.G.G.G.',
    'GGGGGG..b.G.GGGG',
    'BBBGGB.c..G.GGGB',
    'BbBBb.P....P.bBB',
    'bbBBc........cBB',
    'bbB..........Bbb',
    'bbP..........Pbb',
    'bP............Pb',
    'PP............PP',
    'PP............PP',
    'Pc............cP',
    'PP............PP',
    'PP............PP',
    'PP............PP',
    'bP............Pb',
    'bbP..........Pbb',
    'bbB..........Bbb',
    'bBBc........cBBb',
    'BBBPb......bPBBB',
    'GBBB.P....P.BBBG',
    'GBBB.G.bb.G.BBBG',
    'GGBB.GGccGG.BBGG',
    'GGBB.G.BB.G.BBGG',
    'cGbcPBbGBbBPcbGc',
    'PB.GBbc..cbBG.BP',
    '.cBB.bPcPcb.BBc.',
    'c.b.G.bBBb.G.b.c',
    '.P...b.c..b...P.',
    '..c....P....G...',
  ],
  divider1: [
    'c....................B..................',
    '.......G...B.GP...............c.......c.',
    'B.....B....PBbB.c..b.bB.....B...........',
    '..G..P..........c.....................P.',
  ],
  divider2: [
    '..............G..................G......',
    '.b................c.B....b....b.......bB',
    '................P........P.P.....G.....G',
  ],
  horizon: [
    '.......................................B',
    'c....G.....G......b..............G......',
    '.......B.B..G.....b.Bc.cP.b.c...P.......',
    '.P..c...GBG....ccPG..B.b...B.bcBb.GP.PGB',
    'b..cccBcb.PGbcBP.Pc.PP.B....P.G.b..GBcBc',
    'ccPbcGbbPPBBcPG.P.GPc.bBPPcBPbcPbbcBcbBb',
  ],
  caseTop: generateBand(41, 4, (r, n) => 0.8 * Math.pow((r + 1) / n, 1.6)),
  caseMid: generateBand(42, 3, (r) => [0.08, 0.22, 0.08][r] ?? 0.08),
  caseFooter: generateBand(43, 6, (r, n) => 0.95 * Math.pow((r + 1) / n, 1.6)),
}

const TOKENS = ['G', 'B', 'b', 'c', 'P'] as const

type FilledCell = {
  cell: HTMLDivElement
  r: number
  c: number
  ch: string
}

class PixelMosaicController {
  private el: HTMLDivElement
  private rows: readonly string[]
  private name: GridName
  private cols: number
  private cells: HTMLDivElement[] = []
  private filledCells: FilledCell[] = []
  private hasEntered = false
  private lastHoverIdx = -1
  private trailTimers = new Map<string, number>()
  private waveTimers = new Set<number>()
  private enterTimers = new Set<number>()
  private shimmerTimers = new Set<number>()
  private magnetized = new Set<HTMLDivElement>()
  private prefersReducedMotion: boolean
  private rafId: number | null = null

  constructor(el: HTMLDivElement, name: GridName, prefersReducedMotion: boolean) {
    this.el = el
    this.rows = GRIDS[name]
    this.name = name
    this.cols = this.rows[0]?.length ?? 40
    this.prefersReducedMotion = prefersReducedMotion
    this.build()
    this.el.addEventListener('pointermove', this.handlePointerMove)
    this.el.addEventListener('pointerleave', this.handlePointerLeave)
    this.el.addEventListener('click', this.handleClick)
  }

  private build() {
    this.el.textContent = ''
    const frag = document.createDocumentFragment()
    this.rows.forEach((rowStr, r) => {
      for (let c = 0; c < this.cols; c++) {
        const ch = rowStr[c] || '.'
        const cell = document.createElement('div')
        cell.className = 'px-cell'
        cell.dataset.row = String(r)
        cell.dataset.col = String(c)
        cell.dataset.base = ch

        if (ch !== '.') {
          cell.classList.add('is-filled')
          cell.dataset.token = ch
          if (!this.prefersReducedMotion) {
            cell.classList.add('is-entering')
          }
          this.filledCells.push({ cell, r, c, ch })
        }

        this.cells.push(cell)
        frag.appendChild(cell)
      }
    })
    this.el.appendChild(frag)
  }

  private clearEnterTimers() {
    this.enterTimers.forEach((id) => window.clearTimeout(id))
    this.enterTimers.clear()
  }

  replay() {
    if (this.prefersReducedMotion) return
    this.clearEnterTimers()
    this.hasEntered = false
    this.filledCells.forEach(({ cell, ch }) => {
      cell.classList.remove('is-entered')
      cell.classList.add('is-entering')
      cell.dataset.token = ch
    })
    this.cells.forEach((cell) => {
      if (cell.dataset.base === '.') {
        this.clearTrailClasses(cell)
      }
    })
    if (this.rafId !== null) window.cancelAnimationFrame(this.rafId)
    this.rafId = window.requestAnimationFrame(() => {
      this.rafId = null
      this.enter()
    })
  }

  enter() {
    if (this.hasEntered) return
    this.hasEntered = true

    if (this.prefersReducedMotion) {
      this.filledCells.forEach(({ cell }) => {
        cell.classList.remove('is-entering')
        cell.classList.add('is-entered')
      })
      return
    }

    if (this.name === 'hero' || this.name === 'heroMobile') {
      const isMobileHero = this.name === 'heroMobile'
      const centerC = (this.cols - 1) / 2

      this.filledCells.forEach(({ cell, r, c, ch }) => {
        const edgeDist = Math.abs(c - centerC)
        const delay = Math.round(r * (isMobileHero ? 20 : 28) + (centerC - edgeDist) * 14 + Math.random() * 90)
        const flashToken =
          TOKENS[(r + c + Math.floor(Math.random() * TOKENS.length)) % TOKENS.length]

        const tEnter = window.setTimeout(() => {
          cell.dataset.token = flashToken
          cell.classList.remove('is-entering')
          cell.classList.add('is-entered')
        }, delay)

        const tSettle = window.setTimeout(() => {
          cell.dataset.token = ch
        }, delay + 180)

        this.enterTimers.add(tEnter)
        this.enterTimers.add(tSettle)
      })

      this.cells.forEach((cell) => {
        if (cell.dataset.base !== '.') return
        const r = Number(cell.dataset.row)
        const c = Number(cell.dataset.col)
        const inTextClearing = isMobileHero
          ? r >= 4 && r <= 18 && c >= 2 && c <= 13
          : (r >= 3 && r <= 14 && c >= 9 && c <= 30) ||
            (r >= 15 && r <= 16 && c >= 12 && c <= 27)
        if (inTextClearing) return

        const isPerimeterBand = isMobileHero
          ? c <= 3 || c >= 12 || r <= 4 || r >= 19
          : c <= 12 || c >= 27 || r <= 4 || r >= 17
        if (!isPerimeterBand || (r + c) % 3 !== 0) return

        const waveDelay = Math.round(r * (isMobileHero ? 18 : 24) + (centerC - Math.abs(c - centerC)) * 12)
        const waveToken = TOKENS[(r * 3 + c) % TOKENS.length]

        const tWaveOn = window.setTimeout(() => {
          this.clearTrailClasses(cell)
          cell.classList.add(`is-trail-${waveToken}`)
        }, waveDelay)

        const tWaveOff = window.setTimeout(() => {
          this.clearTrailClasses(cell)
        }, waveDelay + 440)

        this.enterTimers.add(tWaveOn)
        this.enterTimers.add(tWaveOff)
      })
      return
    }

    this.filledCells.forEach(({ cell, c }) => {
      const delay = Math.round(c * 11 + Math.random() * 110)
      const t = window.setTimeout(() => {
        cell.classList.remove('is-entering')
        cell.classList.add('is-entered')
      }, delay)
      this.enterTimers.add(t)
    })
  }

  private handlePointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    if (!this.prefersReducedMotion) {
      this.magnetizeAt(e.clientX, e.clientY)
    }
    const targetEl = e.target instanceof Element ? e.target.closest('.px-cell') : null
    if (!(targetEl instanceof HTMLElement) || !this.el.contains(targetEl)) return
    const r = Number(targetEl.dataset.row)
    const c = Number(targetEl.dataset.col)
    const idx = r * this.cols + c
    if (idx === this.lastHoverIdx) return
    this.lastHoverIdx = idx
    this.rippleAt(r, c)
  }

  private handlePointerLeave = () => {
    this.lastHoverIdx = -1
    this.resetMagnet()
  }

  private handleClick = (e: MouseEvent) => {
    const targetEl = e.target instanceof Element ? e.target.closest('.px-cell') : null
    if (!(targetEl instanceof HTMLElement) || !this.el.contains(targetEl)) return
    const r = Number(targetEl.dataset.row)
    const c = Number(targetEl.dataset.col)
    this.shockwave(r, c)
  }

  private magnetizeAt(clientX: number, clientY: number) {
    const rect = this.el.getBoundingClientRect()
    if (!rect.width) return
    const cellSize = rect.width / this.cols
    const cursorCol = (clientX - rect.left) / cellSize - 0.5
    const cursorRow = (clientY - rect.top) / cellSize - 0.5
    const radius = 4.2
    const maxPull = 16
    const nextMagnetized = new Set<HTMLDivElement>()

    this.filledCells.forEach(({ cell, r, c }) => {
      const dc = cursorCol - c
      const dr = cursorRow - r
      const dist = Math.hypot(dc, dr)
      if (dist <= radius && dist > 0.05) {
        const strength = Math.pow(1 - dist / radius, 1.35) * maxPull
        const tx = ((dc / dist) * strength).toFixed(2)
        const ty = ((dr / dist) * strength).toFixed(2)
        cell.style.setProperty('--tx', `${tx}px`)
        cell.style.setProperty('--ty', `${ty}px`)
        nextMagnetized.add(cell)
      }
    })

    this.magnetized.forEach((cell) => {
      if (!nextMagnetized.has(cell)) {
        cell.style.setProperty('--tx', '0px')
        cell.style.setProperty('--ty', '0px')
      }
    })

    this.magnetized = nextMagnetized
  }

  private resetMagnet() {
    this.magnetized.forEach((cell) => {
      cell.style.setProperty('--tx', '0px')
      cell.style.setProperty('--ty', '0px')
    })
    this.magnetized.clear()
  }

  private rippleAt(centerR: number, centerC: number) {
    const radius = 1
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        const nr = centerR + dr
        const nc = centerC + dc
        if (nr < 0 || nr >= this.rows.length || nc < 0 || nc >= this.cols) continue
        const dist = Math.hypot(dr, dc)
        if (dist > 1.45) continue

        const cell = this.cells[nr * this.cols + nc]
        if (!cell) continue
        const base = cell.dataset.base

        if (base !== '.') {
          if (dist <= 1.05) {
            const randToken =
              TOKENS[(nr + nc + Math.floor(Math.random() * TOKENS.length)) % TOKENS.length]
            cell.dataset.token = randToken
          }
          cell.classList.add('is-hovered')
          this.scheduleClear(cell, 'hover', 460 + Math.random() * 220)
        } else if (dist <= 1.05) {
          const randToken =
            TOKENS[(nr + nc + Math.floor(Math.random() * TOKENS.length)) % TOKENS.length]
          this.clearTrailClasses(cell)
          cell.classList.add(`is-trail-${randToken}`)
          this.scheduleClear(cell, 'trail', 460 + Math.random() * 220)
        }
      }
    }
  }

  private shockwave(originR: number, originC: number) {
    if (this.prefersReducedMotion) return
    const maxRadius = 11
    for (
      let r = Math.max(0, originR - maxRadius);
      r <= Math.min(this.rows.length - 1, originR + maxRadius);
      r++
    ) {
      for (
        let c = Math.max(0, originC - maxRadius);
        c <= Math.min(this.cols - 1, originC + maxRadius);
        c++
      ) {
        const dist = Math.hypot(r - originR, c - originC)
        if (dist > maxRadius) continue

        const cell = this.cells[r * this.cols + c]
        if (!cell) continue
        const delay = Math.round(dist * 34)
        const waveToken = TOKENS[Math.floor((dist + r + c) % TOKENS.length)]

        const t1 = window.setTimeout(() => {
          if (cell.dataset.base !== '.') {
            cell.classList.add('is-wave')
            cell.dataset.token = waveToken
          } else if (Math.random() > 0.35) {
            this.clearTrailClasses(cell)
            cell.classList.add(`is-trail-${waveToken}`)
          }
        }, delay)

        const t2 = window.setTimeout(() => {
          if (cell.dataset.base !== '.') {
            cell.classList.remove('is-wave')
            cell.dataset.token = cell.dataset.base
          } else {
            this.clearTrailClasses(cell)
          }
        }, delay + 340)

        this.waveTimers.add(t1)
        this.waveTimers.add(t2)
      }
    }
  }

  private clearTrailClasses(cell: HTMLDivElement) {
    TOKENS.forEach((t) => cell.classList.remove(`is-trail-${t}`))
  }

  private scheduleClear(cell: HTMLDivElement, kind: 'hover' | 'trail', ms: number) {
    const key = `${kind}:${cell.dataset.row}:${cell.dataset.col}`
    const prev = this.trailTimers.get(key)
    if (prev !== undefined) {
      window.clearTimeout(prev)
    }
    const timer = window.setTimeout(() => {
      if (kind === 'hover') {
        cell.classList.remove('is-hovered')
        if (cell.dataset.base !== '.') {
          cell.dataset.token = cell.dataset.base
        }
      } else {
        this.clearTrailClasses(cell)
      }
      this.trailTimers.delete(key)
    }, ms)
    this.trailTimers.set(key, timer)
  }

  shimmerRandom() {
    if (!this.hasEntered || this.filledCells.length === 0 || this.prefersReducedMotion) return
    const pick = this.filledCells[Math.floor(Math.random() * this.filledCells.length)]
    if (!pick) return
    pick.cell.classList.add('is-shimmer')
    const id = window.setTimeout(() => {
      pick.cell.classList.remove('is-shimmer')
      this.shimmerTimers.delete(id)
    }, 650)
    this.shimmerTimers.add(id)
  }

  destroy() {
    if (this.rafId !== null) window.cancelAnimationFrame(this.rafId)
    this.clearEnterTimers()
    this.waveTimers.forEach((id) => window.clearTimeout(id))
    this.waveTimers.clear()
    this.trailTimers.forEach((id) => window.clearTimeout(id))
    this.trailTimers.clear()
    this.shimmerTimers.forEach((id) => window.clearTimeout(id))
    this.shimmerTimers.clear()
    this.el.removeEventListener('pointermove', this.handlePointerMove)
    this.el.removeEventListener('pointerleave', this.handlePointerLeave)
    this.el.removeEventListener('click', this.handleClick)
    this.el.textContent = ''
  }
}

export function PixelMosaic({
  grid,
  className,
  ref,
}: {
  grid: GridName
  className?: string
  ref?: Ref<PixelMosaicHandle>
}) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const controllerRef = useRef<PixelMosaicController | null>(null)

  useImperativeHandle(
    ref,
    () => ({
      replay: () => controllerRef.current?.replay(),
    }),
    [],
  )

  useEffect(() => {
    const el = hostRef.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const controller = new PixelMosaicController(el, grid, prefersReducedMotion)
    controllerRef.current = controller

    let rafId: number | null = null
    let io: IntersectionObserver | null = null

    if (grid === 'hero' || grid === 'heroMobile') {
      rafId = window.requestAnimationFrame(() => controller.enter())
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              controller.enter()
              io?.disconnect()
            }
          })
        },
        { threshold: 0.15 },
      )
      io.observe(el)
    }

    let shimmerInterval: number | null = null
    if (!prefersReducedMotion) {
      shimmerInterval = window.setInterval(() => {
        if (Math.random() > 0.3) controller.shimmerRandom()
      }, 850)
    }

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId)
      if (io) io.disconnect()
      if (shimmerInterval !== null) window.clearInterval(shimmerInterval)
      controller.destroy()
      controllerRef.current = null
    }
  }, [grid])

  return (
    <div
      ref={hostRef}
      className={className ? `pixel-grid ${className}` : 'pixel-grid'}
      data-grid={grid}
      aria-hidden="true"
    />
  )
}
