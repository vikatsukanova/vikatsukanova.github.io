export type CaseStudyImage = {
  src: string
  alt: string
  caption?: string
}

export type CaseStudyProseSection = {
  kind: 'prose'
  title: string
  body: readonly string[]
}

export type CaseStudyGallerySection = {
  kind: 'gallery'
  title: string
  intro?: string
  layout?: 'stack' | 'row' | 'long'
  images: readonly CaseStudyImage[]
}

export type CaseStudyToken = {
  label: string
  detail: string
  swatch?: 'critical' | 'warning' | 'stable' | 'brand'
  hex?: string
}

export type CaseStudyTokenGridSection = {
  kind: 'tokenGrid'
  title: string
  intro?: readonly string[]
  tokens: readonly CaseStudyToken[]
  typeScale?: readonly { label: string; sample: string; token: string; fontFamily?: string }[]
}

export type CaseStudyTypographySection = {
  kind: 'typography'
  title: string
  fonts: readonly { name: string; family: string }[]
}

export type CaseStudyLogoSection = {
  kind: 'logo'
  title: string
  src: string
  alt: string
}

export type CaseStudyFeatureSplitSection = {
  kind: 'featureSplit'
  title: string
  tone?: 'muted' | 'plain'
  imageSide?: 'left' | 'right'
  image: CaseStudyImage
  lead?: string
  body?: readonly string[]
  bullets?: readonly string[]
}

export type CaseStudyAtomicCard = {
  title: string
  body: string
  preview: 'atoms' | 'molecules' | 'organisms'
}

export type CaseStudyAtomicCardsSection = {
  kind: 'atomicCards'
  title: string
  intro: string
  cards: readonly CaseStudyAtomicCard[]
}

export type CaseStudyNumberedListSection = {
  kind: 'numberedList'
  title: string
  items: readonly { title: string; body: string }[]
}

export type CaseStudyDxSection = {
  kind: 'dx'
  title: string
  body: string
  points: readonly string[]
}

export type CaseStudyPrevNextSection = {
  kind: 'prevNext'
  previous?: { slug: string; label: string }
  next?: { slug: string; label: string }
}

export type CaseStudySection =
  | CaseStudyProseSection
  | CaseStudyGallerySection
  | CaseStudyTokenGridSection
  | CaseStudyTypographySection
  | CaseStudyLogoSection
  | CaseStudyFeatureSplitSection
  | CaseStudyAtomicCardsSection
  | CaseStudyNumberedListSection
  | CaseStudyDxSection
  | CaseStudyPrevNextSection

export type CaseStudyChapter = {
  id: string
  label: string
}

export type CaseStudy = {
  outcome: string
  /** Large hero headline; use \\n for line breaks */
  headline?: string
  /** Word inside headline rendered in italic accent */
  headlineEmphasis?: string
  /** Full-width preface under the hero */
  preface?: string
  /** Override auto-derived chapter nav */
  chapters?: readonly CaseStudyChapter[]
  sections: readonly CaseStudySection[]
}

export type Project = {
  slug: string
  label: string
  image: string
  /** Thumbnail used on the index grid (old portfolio cover) */
  homeImage?: string
  /** Home work-card chrome — phone for mobile products, browser (default) for web */
  homePresentation?: 'browser' | 'phone'
  site?: string
  /** When set, home grid + /work/:slug open this HTML case study instead of ProjectPage */
  caseStudyHref?: string
  summary: string
  client?: string
  role?: string
  collaborators?: string
  stack: readonly string[]
  features: readonly string[]
  built: readonly string[]
  demo?: readonly string[]
  caseStudy?: CaseStudy
  /** Shown on the design home grid */
  featured?: boolean
  /** Old case-study brand band + wireframe panel colors */
  brandColor?: string
  wireframeColor?: string
}

/** Home grid order for design case studies */
export const HOME_PROJECT_SLUGS = [
  'sidestage',
  'clinical',
  'campshare',
  'cheese-factory',
  'racquet-science',
  'mission-blue',
] as const

/** Secondary home strip — shipped front-end / product builds (spendguard, fluenttrack, geargrid hidden for now) */
export const BUILD_PROJECT_SLUGS = ['compass'] as const

export const PROJECTS: readonly Project[] = [
  {
    slug: 'campshare',
    label: 'Campshare',
    image: '/work/campshare/campshare-desktop-app.png',
    homeImage: '/brand/victoria-independent.jpg',
    summary: 'Fictional platform for outdoor equipment sharing',
    client: 'Fictional platform for outdoor equipment sharing',
    role: 'Development, Content, Branding, app design and planning',
    featured: true,
    brandColor: '#fbcf38',
    wireframeColor: '#423846',
    stack: ['UX/UI Design', 'Branding', 'App Design'],
    features: [],
    built: [],
    caseStudy: {
      outcome:
        'Campshare helps you find affordable gear near you so that you can go on adventures you’ve always dreamed of.',
      headline: 'Affordable gear\nnear you',
      headlineEmphasis: 'near you',
      preface:
        'I love camping, but it can be quite pricey, so for this project I wanted to create a service that offers people an alternative way of getting the equipment they need without breaking the bank. Campshare helps you find affordable gear near you so that you can go on adventures you’ve always dreamed of.',
      sections: [
        {
          kind: 'gallery',
          title: '',
          layout: 'row',
          images: [
            {
              src: '/work/campshare/campshare-mockup1.jpg',
              alt: 'Campshare brand mockup on outdoor gear',
            },
            {
              src: '/work/campshare/campshare-mockup3.jpg',
              alt: 'Campshare brand application mockup',
            },
            {
              src: '/work/campshare/campshare-mockup2.jpg',
              alt: 'Campshare print and product mockup',
            },
          ],
        },
        {
          kind: 'typography',
          title: '/Typography/',
          fonts: [
            { name: 'Menlo', family: 'Menlo, Monaco, Consolas, monospace' },
            { name: 'Futura', family: '"FuturaRegular", Futura, "Trebuchet MS", Arial, sans-serif' },
          ],
        },
        {
          kind: 'tokenGrid',
          title: '/Colors/',
          tokens: [
            { label: '#fb5c33', detail: '#fb5c33', hex: '#fb5c33' },
            { label: '#fbcf38', detail: '#fbcf38', hex: '#fbcf38' },
            { label: '#e9e7e8', detail: '#e9e7e8', hex: '#e9e7e8' },
            { label: '#413847', detail: '#413847', hex: '#413847' },
          ],
        },
        {
          kind: 'logo',
          title: '/Logo/',
          src: '/work/campshare/campshare-logo.png',
          alt: 'Campshare logo',
        },
        {
          kind: 'gallery',
          title: '/Newsletters/',
          layout: 'row',
          images: [
            {
              src: '/work/campshare/campshare-newsletter1.1.jpg',
              alt: 'Campshare newsletter layout one',
            },
            {
              src: '/work/campshare/campshare-newsletter1.2.jpg',
              alt: 'Campshare newsletter layout two',
            },
            {
              src: '/work/campshare/campshare-newsletter2.2.jpg',
              alt: 'Campshare newsletter layout three',
            },
          ],
        },
        {
          kind: 'featureSplit',
          title: '/App Design/',
          tone: 'muted',
          imageSide: 'left',
          image: {
            src: '/work/campshare/campshare-phone1.png',
            alt: 'Campshare iOS app screens',
          },
          lead: 'Key Features:',
          bullets: [
            'post renting products easily with photos right from your device camera and photo library.',
            'chat to renters/owners',
            'rate products',
            'leave a review for owners/renters',
            'find items closest to your current location (GPS)',
            'sort results by date, price and distance',
            'Push notifications: be alerted when receive a message, or get ratings.',
            'make or view your personal wish list that’s automatically synchronized with campshare.com',
            'French and English languages. The app automatically detects your iOS language settings.',
          ],
        },
        {
          kind: 'featureSplit',
          title: '',
          tone: 'plain',
          imageSide: 'right',
          image: {
            src: '/work/campshare/campshare-phone2.png',
            alt: 'Campshare app product detail',
          },
          body: [
            'Differentiator — a local community based renting platform that brings people together.',
            'Solution — location based filtering system; renter/owner direct communication through the messages.',
            'Audience — adventurers and casual iOS users.',
          ],
        },
        {
          kind: 'gallery',
          title: '/Wireframes/',
          layout: 'row',
          images: [
            {
              src: '/work/campshare/campshare-wireframe1.jpg',
              alt: 'Campshare wireframe set one',
            },
            {
              src: '/work/campshare/campshare-wireframe2.jpg',
              alt: 'Campshare wireframe set two',
            },
          ],
        },
        {
          kind: 'prevNext',
          previous: { slug: 'cheese-factory', label: 'previous project' },
          next: { slug: 'sidestage', label: 'next project' },
        },
      ],
    },
  },
  {
    slug: 'cheese-factory',
    label: 'Cheese Factory',
    image: '/work/cheese-factory/cheese-factory-tablet.jpg',
    homeImage: '/brand/cheese-factory-phone2.gif',
    summary: 'Fictional cheese subscription service',
    client: 'Fictional cheese subscription service',
    role: 'Development, Content, Branding, Design',
    featured: true,
    brandColor: '#e9e7e8',
    wireframeColor: '#4d3541',
    stack: ['Branding', 'Web Design'],
    features: [],
    built: [],
    caseStudy: {
      outcome:
        'A cheese subscription service with a sophisticated, classic website — clear content, limited colour, and playful shape.',
      headline: 'Classic form\nfor cheese\nenthusiasts',
      headlineEmphasis: 'cheese',
      preface:
        '“Cheese Factory” is a cheese Subscription service for the cheese enthusiasts. For this project I wanted to create a website that is sophisticated and classic. I also experimented with different shape while keeping the colour palette limited. In addition, I wanted the content to be easily understood and clear to the visitors.',
      sections: [
        {
          kind: 'gallery',
          title: '',
          layout: 'long',
          images: [
            {
              src: '/work/cheese-factory/cheese-factory-desktop-longpage.jpg',
              alt: 'Cheese Factory full homepage design',
            },
          ],
        },
        {
          kind: 'typography',
          title: '/Typography/',
          fonts: [{ name: 'Cormorant', family: '"cormorantbook", Cormorant, Georgia, serif' }],
        },
        {
          kind: 'tokenGrid',
          title: '/Colors/',
          tokens: [
            { label: '#e9e7e8', detail: '#e9e7e8', hex: '#e9e7e8' },
            { label: '#f5dccb', detail: '#f5dccb', hex: '#f5dccb' },
            { label: '#65565b', detail: '#65565b', hex: '#65565b' },
          ],
        },
        {
          kind: 'logo',
          title: '/Logo/',
          src: '/work/cheese-factory/cheese-factory.png',
          alt: 'Cheese Factory logo',
        },
        {
          kind: 'gallery',
          title: '/Responsive Design/',
          layout: 'stack',
          images: [
            {
              src: '/work/cheese-factory/cheese-factory-phone.gif',
              alt: 'Cheese Factory responsive phone animation',
            },
          ],
        },
        {
          kind: 'gallery',
          title: '/Wireframes/',
          layout: 'row',
          images: [
            {
              src: '/work/cheese-factory/cheese-factory-wireframe2.jpg',
              alt: 'Cheese Factory tablet wireframe',
            },
            {
              src: '/work/cheese-factory/cheese-factory-wireframe3.jpg',
              alt: 'Cheese Factory mobile wireframe',
            },
          ],
        },
        {
          kind: 'prevNext',
          previous: { slug: 'racquet-science', label: 'previous project' },
          next: { slug: 'campshare', label: 'next project' },
        },
      ],
    },
  },
  {
    slug: 'racquet-science',
    label: 'Racquet Science',
    image: '/work/racquet-science/racquet-science-desktop.jpg',
    homeImage: '/work/racquet-science/racquet-science-desktop.jpg',
    summary: 'Fictional Tennis Club website',
    client: 'Fictional Tennis Club website',
    role: 'Development, Content, Branding, Design',
    featured: true,
    brandColor: '#00a55c',
    wireframeColor: '#191919',
    stack: ['Branding', 'Web Design'],
    features: [],
    built: [],
    caseStudy: {
      outcome:
        'A fictional tennis club site designed to inspire people to play — bold colour for a sport I love.',
      headline: 'Bold colour\nfor the love\nof tennis',
      headlineEmphasis: 'tennis',
      preface:
        '“Racquet Science” is a fictional website for a tennis club. Starting with a brand name, I wanted to create an exciting website that inspires people to play tennis. Being a tennis player myself, I wanted to share my passion for tennis by using bold colour.',
      sections: [
        {
          kind: 'gallery',
          title: '',
          layout: 'row',
          images: [
            {
              src: '/work/racquet-science/racquet-science-about.jpg',
              alt: 'Racquet Science about page',
            },
            {
              src: '/work/racquet-science/racquet-science-programs.jpg',
              alt: 'Racquet Science programs page',
            },
          ],
        },
        {
          kind: 'typography',
          title: '/Typography/',
          fonts: [
            { name: 'Bebas Neue', family: '"bebas_neue_regularregular", "Bebas Neue", Impact, sans-serif' },
            { name: 'Avenir', family: '"Avenir Roman", Avenir, "Avenir Next", "Segoe UI", sans-serif' },
          ],
        },
        {
          kind: 'tokenGrid',
          title: '/Colors/',
          tokens: [
            { label: '#00a760', detail: '#00a760', hex: '#00a760' },
            { label: '#191919', detail: '#191919', hex: '#191919' },
          ],
        },
        {
          kind: 'logo',
          title: '/Logo/',
          src: '/work/racquet-science/racquet-science-logo.png',
          alt: 'Racquet Science logo',
        },
        {
          kind: 'gallery',
          title: '/Wireframes/',
          layout: 'row',
          images: [
            {
              src: '/work/racquet-science/racquet-science-wireframe3.jpg',
              alt: 'Racquet Science wireframes',
            },
          ],
        },
        {
          kind: 'prevNext',
          previous: { slug: 'mission-blue', label: 'previous project' },
          next: { slug: 'cheese-factory', label: 'next project' },
        },
      ],
    },
  },
  {
    slug: 'mission-blue',
    label: 'Mission Blue',
    image: '/work/mission-blue/mission-blue-desktop.jpg',
    homeImage: '/work/mission-blue/mission-blue-card.jpg',
    summary: 'Website for ocean pollution awareness art festival.',
    client: 'Fictional organisation',
    role: 'Development, Content, Branding, Design',
    featured: true,
    brandColor: '#fb6360',
    wireframeColor: '#162f79',
    stack: ['Branding', 'Web Design', 'Motion'],
    features: [],
    built: [],
    caseStudy: {
      outcome:
        'An ocean pollution awareness art festival site that educates through motion and visual interest.',
      headline: 'Ocean awareness\nthrough art',
      headlineEmphasis: 'art',
      preface:
        '“Mission Blue” is an organization for ocean pollution awareness art festival. For this project I had to develop a persona, a fictional organization and choose any topic related to environment. While searching for a topic I stumbled upon Pharrell Williams organization for ocean called “Raw for the Oceans” which purpose is to reduce the impact of plastic dumping in the world’s oceans. Illustrations they used for their brand inspired the animations on my website. Despite the fact that it is a serious issue I wanted to educate my visitors about ocean pollution in a visually interesting way.',
      sections: [
        {
          kind: 'gallery',
          title: '',
          layout: 'row',
          images: [
            {
              src: '/work/mission-blue/mission-blue-home.jpg',
              alt: 'Mission Blue homepage design',
            },
            {
              src: '/work/mission-blue/mission-blue-program.jpg',
              alt: 'Mission Blue program page',
            },
          ],
        },
        {
          kind: 'typography',
          title: '/Typography/',
          fonts: [
            { name: 'Open Sans', family: '"open_sanslight", "Open Sans", "Helvetica Neue", Arial, sans-serif' },
            { name: 'Clear Sans', family: '"clear_sansregular", "Clear Sans", "Helvetica Neue", Arial, sans-serif' },
          ],
        },
        {
          kind: 'tokenGrid',
          title: '/Colors/',
          tokens: [
            { label: '#162f79', detail: '#162f79', hex: '#162f79' },
            { label: '#fb6360', detail: '#fb6360', hex: '#fb6360' },
          ],
        },
        {
          kind: 'logo',
          title: '/Logo/',
          src: '/work/mission-blue/mission-blue.png',
          alt: 'Mission Blue logo',
        },
        {
          kind: 'gallery',
          title: '/Wireframes/',
          layout: 'row',
          images: [
            {
              src: '/work/mission-blue/mission-blue-wireframe3.jpg',
              alt: 'Mission Blue wireframes',
            },
          ],
        },
        {
          kind: 'prevNext',
          next: { slug: 'racquet-science', label: 'next project' },
        },
      ],
    },
  },
  {
    slug: 'sidestage',
    label: 'SideStage',
    image: '/work/sidestage/iphone-16-pro.png',
    homeImage: '/work/sidestage/screens/home-for-you.png',
    homePresentation: 'phone',
    summary:
      'A cross-platform musician discovery app — people, music, gear, and opportunities in one place — built with Expo and React Native so the same product runs on phone and web.',
    role: 'Cross-platform product design & engineering · Expo / React Native',
    featured: true,
    brandColor: '#F7F7F5',
    wireframeColor: '#15191C',
    stack: ['Expo', 'React Native', 'TypeScript', 'Product Design'],
    features: [
      'Home discovery across music, people, events, and gear — plus Following and Opportunities tabs.',
      'Searchable People directory with roles, instruments, genres, distance, and connection requests.',
      'Local gear browse, opportunity posting, and profile identity with bands and saves.',
    ],
    built: [
      'One Expo (SDK 58) codebase shipping to iOS, Android, and the browser.',
      'Tokenized design system with shared controls and accessibility constraints in CI.',
      'Session-level follows, saves, comments, and opportunity drafts for early flow validation.',
    ],
    caseStudy: {
      outcome:
        'A cross-platform musician discovery app — people, music, gear, and opportunities in one place — built with Expo and React Native so the same product runs on phone and web.',
      headline: 'One app for\nthe whole\nscene',
      headlineEmphasis: 'scene',
      preface:
        'SideStage is a mobile-first discovery product for musicians: find people in your scene, browse music and gear nearby, follow creators, and post or apply to openings and paid gigs. One Expo (SDK 58) codebase ships to iOS, Android, and the browser.',
      sections: [
        {
          kind: 'gallery',
          title: '',
          layout: 'row',
          images: [
            {
              src: '/work/sidestage/screens/home-for-you.png',
              alt: 'SideStage Home For you feed with music, people, and gear cards',
              caption: 'Home — For you',
            },
            {
              src: '/work/sidestage/screens/people.png',
              alt: 'SideStage People directory with musician cards and filters',
              caption: 'People',
            },
            {
              src: '/work/sidestage/screens/gear.png',
              alt: 'SideStage Gear browse with local listings',
              caption: 'Gear',
            },
            {
              src: '/work/sidestage/screens/profile.png',
              alt: 'SideStage Profile with identity, bands, and saves',
              caption: 'Profile',
            },
          ],
        },
        {
          kind: 'prose',
          title: '/Overview/',
          body: [
            'SideStage is a mobile-first discovery product for musicians: find people in your scene, browse music and gear nearby, follow creators, and post or apply to openings and paid gigs. One Expo (SDK 58) codebase ships to iOS, Android, and the browser.',
          ],
        },
        {
          kind: 'prose',
          title: '/Problem/',
          body: [
            'Local music scenes are fragmented. Musicians hunt for collaborators, used gear, gigs, and community across Instagram DMs, Facebook groups, marketplace apps, and word of mouth. There isn’t a single surface that treats people, sound, equipment, and work as one discovery problem.',
          ],
        },
        {
          kind: 'prose',
          title: '/Solution/',
          body: [
            'A focused preview app organized around five primary surfaces. Session-level follows, saves, comments, and opportunity drafts make the product feel interactive without a backend yet — intentional for validating flows early.',
          ],
        },
        {
          kind: 'numberedList',
          title: '/Primary surfaces/',
          items: [
            {
              title: 'Home',
              body: '“For you” discovery (music, people, events, gear), Following feed, and Opportunities.',
            },
            {
              title: 'People',
              body: 'Searchable directory with roles, instruments, genres, distance, and connection requests.',
            },
            {
              title: 'Gear',
              body: 'Browse and filter local listings.',
            },
            {
              title: 'Post',
              body: 'Share music and create opportunity listings.',
            },
            {
              title: 'Profile',
              body: 'Identity, bands/projects, and saves.',
            },
          ],
        },
        {
          kind: 'featureSplit',
          title: '/Home/',
          tone: 'muted',
          imageSide: 'left',
          image: {
            src: '/work/sidestage/screens/home-opportunities.png',
            alt: 'SideStage Home Opportunities tab with gig and opening cards',
          },
          lead: 'Discovery that spans the scene',
          body: [
            'Home carries three modes: For you, Following, and Opportunities. Music, people, events, and gear sit in one feed so discovery isn’t siloed by marketplace or social network.',
          ],
          bullets: [
            'For you mixes people, sound, events, and gear',
            'Following keeps creators you care about close',
            'Opportunities surfaces openings and paid gigs',
          ],
        },
        {
          kind: 'featureSplit',
          title: '/People/',
          tone: 'plain',
          imageSide: 'right',
          image: {
            src: '/work/sidestage/screens/person-maya.png',
            alt: 'Musician profile for Maya with connect and message actions',
          },
          lead: 'Find collaborators, not just followers',
          body: [
            'The directory filters by role, instrument, genre, and distance. Connect creates a pending request — it never auto-accepts — so relationship state stays intentional across Home, People, and profiles.',
          ],
          bullets: [
            'Roles, instruments, genres, and distance filters',
            'Connect without auto-accept',
            'Bands and projects as first-class profiles',
          ],
        },
        {
          kind: 'featureSplit',
          title: '/Gear/',
          tone: 'muted',
          imageSide: 'left',
          image: {
            src: '/work/sidestage/screens/gear-detail.png',
            alt: 'Gear listing detail with photos and listing actions',
          },
          lead: 'Local equipment in the same product',
          body: [
            'Gear browse and detail keep equipment next to people and gigs, so hunting for a used amp doesn’t mean leaving the scene for another marketplace.',
          ],
          bullets: [
            'Browse and filter local listings',
            'Listing detail with photos and owner context',
            'Add-gear flow for posting into the same surface',
          ],
        },
        {
          kind: 'featureSplit',
          title: '/Post & opportunities/',
          tone: 'plain',
          imageSide: 'right',
          image: {
            src: '/work/sidestage/screens/post.png',
            alt: 'SideStage Post composer for music and opportunity listings',
          },
          lead: 'Composer → publish → own listing',
          body: [
            'Posting covers sharing music and creating opportunity listings. Drafts and publish flows are session-backed so the interaction pattern can be proven before accounts and persistence exist.',
          ],
          bullets: [
            'Share music and create openings or paid gigs',
            'Save draft and publish in-session',
            'Owner view for managing your listings',
          ],
        },
        {
          kind: 'featureSplit',
          title: '/Profile/',
          tone: 'muted',
          imageSide: 'left',
          image: {
            src: '/work/sidestage/screens/profile.png',
            alt: 'SideStage Profile with avatar, bio, bands, and saved items',
          },
          lead: 'Identity for the scene',
          body: [
            'Profile holds who you are, the bands and projects you play in, and what you’ve saved — the anchor for discovery and connection across the app.',
          ],
        },
        {
          kind: 'prose',
          title: '/Design/',
          body: [
            'Light theme, tokenized palette and spacing, shared controls (Button, Chip, TextTabs, IconButton), and page primitives that keep screens consistent. Accessibility is treated as product constraints: contrast floors in CI, 44pt targets, keyboard-friendly tabs and filters, explicit focus rings on web.',
          ],
        },
        {
          kind: 'typography',
          title: '/Typography/',
          fonts: [
            {
              name: 'Inter',
              family: 'Inter, "Helvetica Neue", Arial, sans-serif',
            },
          ],
        },
        {
          kind: 'tokenGrid',
          title: '/Colors/',
          intro: [
            'A monochrome light system: ink on white and soft canvas, with accent reserved for primary action. Tokens live in one module — screens import roles instead of inventing hex.',
          ],
          tokens: [
            { label: 'Ink', detail: '#15191C · ink / accent', hex: '#15191C' },
            { label: 'Ink secondary', detail: '#424B54 · ink2', hex: '#424B54' },
            { label: 'Muted', detail: '#59616C · muted', hex: '#59616C' },
            { label: 'Background', detail: '#FFFFFF · bg / card', hex: '#FFFFFF' },
            { label: 'Canvas', detail: '#F7F7F5 · canvas', hex: '#F7F7F5' },
            { label: 'Cloud', detail: '#F2F3F2 · accent soft / chip', hex: '#F2F3F2' },
            { label: 'Line', detail: '#E6E8E7 · line', hex: '#E6E8E7' },
            { label: 'Control border', detail: '#737B85 · control border', hex: '#737B85' },
          ],
          typeScale: [
            { label: 'H1', sample: 'SideStage', token: 'display · Inter bold' },
            { label: 'H2', sample: 'For you', token: 'section · semibold' },
            { label: 'Body', sample: 'Find people, music, gear, and gigs nearby', token: '15–16 · muted ink' },
            { label: 'Label', sample: 'Connect', token: 'chip / button · medium' },
          ],
        },
        {
          kind: 'dx',
          title: '/Engineering/',
          body: 'Expo Router file-based navigation with Continuous Native Generation (no hand-edited native trees). Strict TypeScript, ESLint with zero warnings, and design-system rules that block one-off hex and control copies. Layered quality: unit tests for filters/forms, Playwright e2e on the exported web bundle, and agent-driven UI proof recipes for browse/post journeys. React Compiler and typed routes enabled for a modern Expo stack.',
          points: [
            'Expo SDK 58 · React Native · Expo Router',
            'Continuous Native Generation',
            'Strict TypeScript · ESLint zero warnings · design-system lint',
            'Unit tests · Playwright web e2e · UI proof recipes',
            'React Compiler · typed routes',
          ],
        },
        {
          kind: 'prose',
          title: '/Role & craft/',
          body: [
            'End-to-end product work: information architecture, design system, interaction patterns (composer → publish → own listing, connect without auto-accept), and the agent/CI tooling that keeps a fast-moving UI coherent.',
          ],
        },
        {
          kind: 'prose',
          title: '/Status/',
          body: [
            'Interactive product prototype with in-memory seed data. Browse, connect, save, comment, and opportunity posting work in-session; accounts and persistence are next-step product work.',
          ],
        },
        {
          kind: 'prevNext',
          next: { slug: 'clinical', label: 'next project' },
        },
      ],
    },
  },
  {
    slug: 'clinical',
    label: 'Cardiology Dashboard',
    image: '/demos/clinical/assets/rendered/workspace.png?v=5',
    homeImage: '/demos/clinical/assets/rendered/workspace.png?v=5',
    site: '/demos/clinical/workspace.html',
    caseStudyHref: '/demos/clinical/clinical.html',
    summary:
      'A cardiology workspace that brings patient history, assessments, and clinical results together to support a connected assessment experience.',
    role: 'Product design · UX/UI · MVP definition',
    featured: true,
    brandColor: '#e9e7e8',
    wireframeColor: '#1f2933',
    stack: ['Product Design', 'UX/UI', 'MVP Definition'],
    features: [
      'Three-column workspace: patient context, assessment history, and supporting results.',
      'Proposed four-step flow: symptoms → findings → plan → review.',
      'Designed from scratch with a cardiologist; MVP scoped with founders and ML.',
    ],
    built: [
      'Dashboard UX/UI shaped around real cardiology assessment workflows.',
      'Interactive assessment prototype from symptoms through review.',
      'Component library documenting tokens, status, and accessibility considerations.',
    ],
  },
  {
    slug: 'compass',
    label: 'Compass',
    image: '/work/compass/compass-dashboard-day.png?v=10',
    site: 'https://compass-demo-tau.vercel.app',
    summary:
      'Compass is a personal focus and life-balance app. Open it in the morning and it shows what deserves attention today — not the longest task list, but the parts of life that have gone quiet.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Prisma', 'PostgreSQL', 'Neon', 'Vercel'],
    role: 'Product design & full-stack engineering',
    brandColor: '#eff6ff',
    wireframeColor: '#1e293b',
    features: [
      'Life areas carry a weekly target and a priority.',
      'Time is logged by hand: which area, which day, how long, and a note.',
      'The focus timer follows a Pomodoro rhythm.',
    ],
    built: [
      'Next.js and TypeScript, with Tailwind for the layout and the day and night themes.',
      'The data sits in Postgres through Prisma, hosted on Neon.',
    ],
    caseStudy: {
      outcome:
        'A personal focus app that opens each morning on the life areas that have gone quiet — not the longest task list.',
      headline: 'What deserves\nattention\ntoday',
      headlineEmphasis: 'attention',
      preface:
        'Compass is a personal focus app that opens each morning by showing the life areas that have gone quiet, not by listing every task. I designed and built it end to end, pairing a simple status model with a calm visual language — a gentle check-in rather than a scoreboard.',
      sections: [
        {
          kind: 'prose',
          title: '/The problem/',
          body: [
            'Most productivity apps reward volume: more tasks finished, more hours logged, more streaks kept. In practice that usually means more time spent in one lane, and that lane is almost always work.',
            'The rest of life — health, creative work, reading, finances — does not send notifications. Those areas fade without anyone noticing, and they only get attention once guilt builds up. By that point the tool has already failed, because it measured effort and never looked at balance.',
          ],
        },
        {
          kind: 'prose',
          title: '/The solution/',
          body: [
            'Compass changes the question from “what’s left to do?” to “what have I been neglecting?” Each life area has a weekly target and a priority. A status model compares recent activity with weekly progress and labels each area Neglected, Behind, On track, or Over-focused.',
            'Today’s Focus uses those statuses to recommend where attention should go, with high-priority neglected areas first. Over-focused counts as a signal too — spending too much time in one area is treated as imbalance, not as an achievement.',
            'The visual language matters as much as the logic. Soft pastel chips for each area sit on a calm slate shell, so a Neglected label reads as a nudge rather than a warning.',
          ],
        },
        {
          kind: 'gallery',
          title: '',
          layout: 'row',
          images: [
            {
              src: '/work/compass/compass-dashboard-day.png?v=10',
              alt: 'Compass morning dashboard in day theme with Today’s Focus cards',
              caption: 'Morning dashboard — day theme',
            },
            {
              src: '/work/compass/compass-dashboard-night.png?v=10',
              alt: 'Compass morning dashboard in night theme',
              caption: 'Morning dashboard — night theme',
            },
          ],
        },
        {
          kind: 'numberedList',
          title: '/UX principles/',
          items: [
            {
              title: 'Make silence visible',
              body: 'An area you have not touched should be as easy to see as one you are working on. Compass treats absence as information.',
            },
            {
              title: 'Balance over volume',
              body: 'Progress is measured against what you intended for each area, not against how much you did. Extra hours in one lane do not earn more credit.',
            },
            {
              title: 'Guidance, not guilt',
              body: 'Status labels, color, and copy are tuned to inform without shaming — a friend checking in, not a manager auditing you.',
            },
            {
              title: 'Low-friction honesty',
              body: 'Logging time by hand takes seconds and stays deliberate. The data is only useful if recording it is easy and feels truthful.',
            },
          ],
        },
        {
          kind: 'featureSplit',
          title: '/Today’s Focus/',
          tone: 'muted',
          imageSide: 'left',
          image: {
            src: '/work/compass/compass-dashboard-day.png?v=10',
            alt: 'Today’s Focus cards for Health, Creative, and Work',
          },
          lead: 'The morning recommendation',
          body: [
            'The morning view recommends which areas deserve attention today, with high-priority neglected areas at the top. It is a short, opinionated list — not an endless backlog.',
          ],
          bullets: [
            'Neglected / Behind / On track / Over-focused status from rolling activity + weekly progress',
            'High-priority neglected areas surface first',
            'Quick Log and Start timer sit next to each recommendation',
          ],
        },
        {
          kind: 'featureSplit',
          title: '/Life areas/',
          tone: 'plain',
          imageSide: 'right',
          image: {
            src: '/work/compass/compass-life-areas.png?v=10',
            alt: 'Life areas grid with weekly targets and priorities',
          },
          lead: 'Targets and priorities',
          body: [
            'Each area has a weekly target in hours or sessions and a priority of high, medium, or low. Custom areas can be added beyond the defaults — whatever actually matters that week.',
          ],
          bullets: [
            'Pastel identity per area for scanability',
            'Weekly target + unit (hours or sessions)',
            'Priority drives today’s ranking',
          ],
        },
        {
          kind: 'featureSplit',
          title: '/Focus timer/',
          tone: 'muted',
          imageSide: 'left',
          image: {
            src: '/work/compass/compass-focus.png?v=10',
            alt: 'Pomodoro focus timer set to Health',
          },
          lead: 'Structured sessions',
          body: [
            'When you want structure, a Pomodoro-style timer keeps sessions steady and easy to attribute to a life area. A short note is required when a session completes, so the log stays meaningful.',
          ],
          bullets: [
            'Pomodoro, short break, and long break modes',
            'Life area tied to every session',
            'Complements Quick Log for untimed work',
          ],
        },
        {
          kind: 'featureSplit',
          title: '/Quick Log/',
          tone: 'plain',
          imageSide: 'right',
          image: {
            src: '/work/compass/compass-activities.png?v=10',
            alt: 'Activities page with new log form',
          },
          lead: 'Honest time in a few taps',
          body: [
            'Activities records the area, day, duration, and an optional note. Quick Log on the dashboard covers the same path without leaving the morning view.',
          ],
        },
        {
          kind: 'typography',
          title: '/Typography/',
          fonts: [
            {
              name: 'Inter',
              family: 'Inter, "Helvetica Neue", Arial, sans-serif',
            },
          ],
        },
        {
          kind: 'tokenGrid',
          title: '/Colors/',
          intro: [
            'The shell is deliberately quiet. Inter at weights 300–700 sits on a slate base, with a single accent blue reserved for primary actions and focus states. Life areas carry soft pastels so they stay distinct without shouting.',
          ],
          tokens: [
            { label: 'Background', detail: '#f8fafc · background', hex: '#f8fafc' },
            { label: 'Foreground', detail: '#1e293b · foreground', hex: '#1e293b' },
            { label: 'Muted', detail: '#64748b · muted', hex: '#64748b' },
            { label: 'Accent', detail: '#2563eb · accent', hex: '#2563eb' },
            { label: 'Accent soft', detail: '#eff6ff · accent soft', hex: '#eff6ff' },
            { label: 'Health', detail: '#e0e7ff · health', hex: '#e0e7ff' },
            { label: 'Creative', detail: '#ffe4e6 · creative', hex: '#ffe4e6' },
            { label: 'Work', detail: '#fef3c7 · work', hex: '#fef3c7' },
            { label: 'Finances', detail: '#dbeafe · finances', hex: '#dbeafe' },
            { label: 'Projects', detail: '#ffedd5 · projects', hex: '#ffedd5' },
            { label: 'Reading', detail: '#e0f2fe · reading', hex: '#e0f2fe' },
          ],
          typeScale: [
            { label: 'H1', sample: 'Good morning', token: 'text-2xl / bold / tracking-tight' },
            { label: 'H2', sample: 'Today’s Focus', token: 'section title · semibold' },
            { label: 'Body', sample: 'What deserves attention today', token: 'text-sm–base · muted slate' },
            { label: 'Label', sample: 'Neglected', token: 'status chip · medium' },
          ],
        },
        {
          kind: 'dx',
          title: '/Build/',
          body: 'I built Compass with Next.js and TypeScript, using Tailwind so design tokens and day/night themes stay consistent across the shell. Data lives in PostgreSQL on Neon through Prisma. Status and recommendation logic runs on the server from logged sessions and weekly targets; the app deploys on Vercel.',
          points: [
            'Next.js · TypeScript · Tailwind',
            'Prisma · PostgreSQL · Neon',
            'Day / Night themes with a pre-paint theme script',
            'Server-side status + recommendation model',
          ],
        },
      ],
    },
  },
  {
    slug: 'spendguard',
    label: 'SpendGuard',
    image: '/work-spendguard.png?v=1',
    summary:
      'SpendGuard is a personal finance leak detector. Import a TD bank CSV, see the charges that keep coming back, and decide what to cancel, pause, reduce, or look into.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Prisma', 'SQLite'],
    role: 'Product design & full-stack engineering',
    features: [
      'Transactions come in from a TD CSV.',
      'Merchants charged more than once show up as recurring.',
    ],
    built: ['Next.js and TypeScript, with Tailwind for the layout.'],
  },
  {
    slug: 'fluenttrack',
    label: 'FluentTrack',
    image: '/work-fluenttrack.png?v=1',
    summary:
      'FluentTrack is a language-learning study tracker. Start a timed session, pick a language, a skill, and how you want to practice, then see what the saved history says about how you have been studying.',
    stack: ['Next.js', 'TypeScript', 'Material UI', 'Express', 'Prisma', 'PostgreSQL', 'Neon'],
    role: 'Product design & full-stack engineering',
    features: [
      'Timed study sessions you start and finish yourself.',
      'Each session is tied to a language, a skill, and an activity type.',
    ],
    built: ['Next.js and TypeScript on the front, with Material UI for the screens.'],
  },
  {
    slug: 'geargrid',
    label: 'Geargrid',
    image: '/work-geargrid.jpg?v=1',
    summary:
      'Geargrid is a gear inventory and packing planner — keep outdoor equipment organized, see what you own, and build kits for the next trip.',
    stack: ['React', 'TypeScript', 'UI Engineering'],
    role: 'Front-end engineering & UI',
    features: [
      'Catalog gear with categories and status.',
      'Build packing lists from what you already own.',
    ],
    built: ['React and TypeScript interface focused on clear inventory workflows.'],
  },
]

export function projectBySlug(slug: string) {
  return PROJECTS.find((project) => project.slug === slug)
}

export function homeProjects() {
  return HOME_PROJECT_SLUGS.map((slug) => projectBySlug(slug)).filter(
    (project): project is Project => Boolean(project),
  )
}

export function buildProjects() {
  return BUILD_PROJECT_SLUGS.map((slug) => projectBySlug(slug)).filter(
    (project): project is Project => Boolean(project),
  )
}
