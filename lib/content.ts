export type ProjectScreen = {
  /** Path under /public — a real capture of the running build. */
  src: string;
  label: string;
  caption?: string;
};

export type ProjectStat = { label: string; value: string };
export type ProjectPoint = { title: string; desc: string };

export type Project = {
  slug: string;
  title: string;
  /** Short category label — "Offline-first PWA", "Client website". */
  category: string;
  /** One sentence. Used on the catalogue card and the detail hero. */
  lede: string;
  status: 'live' | 'client' | 'in-progress';

  /** Publish gate. A draft is hidden from the catalogue, the sitemap and the
   *  detail routes — there is deliberately no placeholder card, because an
   *  empty slot on a portfolio reads worse than a shorter catalogue. Fill the
   *  fields below and drop this flag to publish. */
  draft?: boolean;
  /** One restrained accent (hex). Falls back to the monochrome ink accent. */
  accent?: string;

  /* ── catalogue card ─────────────────────────────── */
  shortDesc?: string;
  previewImage?: string;
  frameUrl?: string;
  /** Up to 4 tools shown as chips on the card — the fastest thing a
   *  recruiter scans for. Falls back to the first entries of builtWith. */
  cardTech?: string[];

  /* ── links ──────────────────────────────────────── */
  liveUrl?: string;
  githubUrl?: string;

  /* ── detail page ────────────────────────────────── */
  focus?: string;
  stats?: ProjectStat[];
  heroImage?: string;
  screens?: ProjectScreen[];
  /** The engineering narrative — a few plain paragraphs. */
  theBuild?: string[];
  whatItDoes?: ProjectPoint[];
  underTheHood?: ProjectPoint[];
  outcome?: string[];
  builtWith?: string[];
  builtFor?: string[];
  roles?: string[];
};

export const projects: Project[] = [
  {
    slug: 'gastos',
    title: 'gastos',
    category: 'Offline-first PWA',
    lede: 'An offline-first expense tracker for logging a purchase in three taps, even with no signal.',
    status: 'live',
    accent: '#34d399',
    shortDesc:
      'Offline-first expense tracker built around a free-tier function cap — ~32 routes folded into 10 dispatchers with zero URL changes.',
    previewImage: '/images/work/gastos-overview.jpg',
    frameUrl: 'gastos-xi-rose.vercel.app',
    cardTech: ['Vanilla JS', 'Vercel Serverless', 'PostgreSQL', 'Service Worker'],
    liveUrl: 'https://gastos-xi-rose.vercel.app',
    githubUrl: 'https://github.com/Jcarldungo/gastos',
    focus: 'Offline-first full-stack PWA',
    roles: ['Full-Stack Developer', 'Database Design'],
    heroImage: '/images/work/gastos-overview.jpg',
    stats: [
      { label: 'Serverless functions', value: '10 / 12' },
      { label: 'Works offline', value: 'Full outbox' },
      { label: 'Running cost', value: '$0 / mo' },
      { label: 'Status', value: 'Live' },
    ],
    screens: [
      {
        src: '/images/work/gastos-overview.jpg',
        label: 'Overview',
        caption: 'Balances across every card, the month so far, and a quick-add that stays one tap away.',
      },
      {
        src: '/images/work/gastos-cards.jpg',
        label: 'Cards',
        caption: 'Every balance is derived from the transaction ledger, never a stored number.',
      },
      {
        src: '/images/work/gastos-history.jpg',
        label: 'History',
        caption: 'The full ledger, filterable by date and by direction — each entry tagged and tied to a card.',
      },
      {
        src: '/images/work/gastos-insights.jpg',
        label: 'Insights',
        caption: 'Where the money went and how the weeks compare, computed from that same ledger.',
      },
      {
        src: '/images/work/gastos-budgets.jpg',
        label: 'Budgets',
        caption: 'A ceiling per tag that resets monthly, with Web Push before a limit is crossed.',
      },
    ],
    theBuild: [
      'gastos had to do something most expense trackers skip: work with no connection, and fit inside a free hosting plan that caps a project at 12 serverless functions — while the app needed around 32 distinct API routes.',
      'The routes collapse into 10 thin dispatcher functions. A single rewrite table in vercel.json — shared by production and local dev — maps every original URL onto its dispatcher, so nothing about the API surface changed: same paths, same response shapes, 10 of 12 functions used.',
      'Offline is a real outbox, not just a cache. A service worker precaches the app shell and keeps the last good copy of every GET; writes made with no signal queue in IndexedDB and replay from the page once the network returns — replay lives on the client because it needs the access token, and the token deliberately never reaches the worker.',
      'Money is a string end to end, never a JavaScript float, and dates are read back as calendar strings rather than Date objects — no rounding drift, no timezone drift. Card balances are computed from the ledger, so the number on screen can never disagree with the history behind it.',
    ],
    whatItDoes: [
      { title: 'Three-tap logging', desc: 'Amount, category, card — an expense is in the ledger before the keyboard closes, online or off.' },
      { title: 'Offline outbox', desc: 'Entries made with no signal queue on the device and sync themselves the moment a connection returns.' },
      { title: 'Ledger-derived balances', desc: 'Every card balance is computed from its transactions, so it always matches the history behind it.' },
      { title: 'Bills & budgets', desc: 'Recurring bills and per-category budgets, with Web Push alerts before a due date or a limit is crossed.' },
      { title: 'Installable', desc: "Adds to a phone's home screen and opens full-screen — no app store, no install prompt friction." },
      { title: 'Try it without an account', desc: 'A demo mode seeds a full ledger and resets on the next visit, so the app can be judged in one click.' },
    ],
    underTheHood: [
      { title: '10 functions for 32 routes', desc: 'One vercel.json rewrite table dispatches every original path to a thin function — zero URL or response-shape changes.' },
      { title: 'Token stays on the page', desc: 'The outbox lives in IndexedDB; replay runs from the client because the access token never leaves it for the service worker.' },
      { title: 'Strings, not floats', desc: 'Amounts are strings through the whole stack and dates are calendar strings — arithmetic stays exact and timezone-safe.' },
      { title: 'Versioned precache', desc: 'One VERSION constant swaps the entire shell cache at once, so a release can never serve new HTML against old JS.' },
    ],
    outcome: [
      'Runs entirely within the free tier — 10 of 12 serverless functions used.',
      'Works with no connection and reconciles itself once back online.',
      "Installable to a phone's home screen, with Web Push alerts for bills and budgets.",
    ],
    builtWith: ['Vanilla JS', 'Vercel Serverless', 'Neon PostgreSQL', 'Service Worker / PWA', 'Web Push', 'IndexedDB'],
    builtFor: ['Personal finance', 'Low-connectivity use', 'Free-tier hosting'],
  },
  {
    slug: 'weeplay',
    title: 'WeePlay Therapy Center',
    category: 'Client website',
    lede: 'A production website for a pediatric therapy clinic in Mabalacat, Pampanga — live and serving actual families.',
    status: 'client',
    accent: '#d8a262',
    shortDesc:
      'Live client website for a pediatric therapy clinic — hand-built CSS design system, mobile-first and accessible, no framework.',
    previewImage: '/images/work/weeplay-home.jpg',
    frameUrl: 'weeplay-therapy.vercel.app',
    cardTech: ['HTML5', 'CSS3', 'Vanilla JS', 'Vercel'],
    liveUrl: 'https://weeplay-therapy.vercel.app',
    focus: 'Live client website',
    roles: ['Frontend Developer', 'UI Implementation'],
    heroImage: '/images/work/weeplay-home.jpg',
    stats: [
      { label: 'Framework', value: 'None' },
      { label: 'Client', value: 'Real business' },
      { label: 'Hosting', value: 'Vercel' },
      { label: 'Status', value: 'Live' },
    ],
    screens: [
      {
        src: '/images/work/weeplay-home.jpg',
        label: 'Home',
        caption: 'Warmth and trust up front, tuned to load fast on the low-end phones most parents browse on.',
      },
      {
        src: '/images/work/weeplay-services.jpg',
        label: 'Services',
        caption: 'Occupational, speech & language, and physical therapy, plus SPED tutorials.',
      },
      {
        src: '/images/work/weeplay-space.jpg',
        label: 'Our space',
        caption: 'The clinic itself, so a parent can picture the visit before booking.',
      },
      {
        src: '/images/work/weeplay-contact.jpg',
        label: 'Contact',
        caption: 'Clinic hours, the map, and one-tap Messenger — the paths a parent actually takes.',
      },
    ],
    theBuild: [
      'WeePlay Therapy Center is a real clinic in Mabalacat, Pampanga. The brief was warmth and trust for parents, on a site that stays fast on the low-end Android phones most of them actually browse on.',
      "It's built with no framework — hand-written semantic HTML and a CSS design system of custom properties — so the whole thing ships as static files with nothing to hydrate.",
      'Accessibility is structural, not bolted on: a skip link, ARIA labelling, visible focus, and full keyboard navigation. The paths a parent actually takes — call, message, enquire — are one tap from every screen, and Open Graph metadata makes a shared link unfurl cleanly in Messenger.',
    ],
    whatItDoes: [
      { title: 'Clinic overview', desc: "Services, therapists, and space, structured so a parent can tell in seconds whether it's the right fit." },
      { title: 'One-tap contact', desc: 'Click-to-call, Messenger, and an enquiry form, reachable from anywhere on the site.' },
      { title: 'Fast on cheap phones', desc: 'Static files, a hand-tuned CSS system, and no framework payload — it opens quickly on a slow connection.' },
      { title: 'Clean link previews', desc: 'Open Graph and SEO metadata so a shared link unfurls properly in chat and search.' },
    ],
    underTheHood: [
      { title: 'No framework, no build step', desc: 'Semantic HTML plus a custom-property CSS system — the site is static files, nothing hydrates.' },
      { title: 'Design system in CSS variables', desc: 'Colour, spacing, and type live as tokens, so the whole look changes from one file.' },
      { title: 'Accessibility from commit one', desc: 'Skip link, ARIA, visible focus, and keyboard navigation were in from the start, not retrofitted.' },
      { title: 'Continuous deployment', desc: 'Every push to main deploys on Vercel.' },
    ],
    outcome: [
      'Live and in use by a working business — not a practice project.',
      "Loads fast on low-end phones, which is most of the clinic's traffic.",
      'Deployed on Vercel with continuous deployment from GitHub.',
    ],
    builtWith: ['HTML5', 'CSS3', 'Vanilla JS', 'Vercel'],
    builtFor: ['Healthcare / clinics', 'Parents on mobile', 'Local businesses'],
  },
];

/** Everything the site renders — the catalogue, the detail routes, the
 *  sitemap and the ‹ N / M › pager all read off this. */
export const publishedProjects = projects.filter((p) => !p.draft);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug && !p.draft);
}

/** The chips shown on a catalogue card. */
export function cardTechOf(p: Project): string[] {
  return p.cardTech ?? p.builtWith?.slice(0, 4) ?? [];
}

/** Previous / next published project for the detail-page pager (wraps). */
export function projectSiblings(slug: string) {
  const i = publishedProjects.findIndex((p) => p.slug === slug);
  if (i === -1) return { index: -1, total: publishedProjects.length, prev: undefined, next: undefined };
  const total = publishedProjects.length;
  return {
    index: i,
    total,
    prev: publishedProjects[(i - 1 + total) % total],
    next: publishedProjects[(i + 1) % total],
  };
}

/** `icon` is a key in components/TechIcon's map (a simple-icons slug); omit
 *  it for tools with no clean brand mark (they render name-only). Curated to
 *  the real set behind the projects — not padded. */
export type Tech = { name: string; icon?: string };
export type TechGroup = { label: string; tools: Tech[] };

export const techGroups: TechGroup[] = [
  {
    label: 'Languages',
    tools: [
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'PHP', icon: 'php' },
      { name: 'Python', icon: 'python' },
      { name: 'Java', icon: 'java' },
      { name: 'SQL' },
    ],
  },
  {
    label: 'Frontend',
    tools: [
      { name: 'React', icon: 'react' },
      { name: 'Next.js', icon: 'next' },
      { name: 'Vue.js', icon: 'vue' },
      { name: 'Angular', icon: 'angular' },
      { name: 'Inertia.js', icon: 'inertia' },
      { name: 'Tailwind CSS', icon: 'tailwind' },
    ],
  },
  {
    label: 'Backend',
    tools: [
      { name: 'Node.js', icon: 'node' },
      { name: 'Express', icon: 'express' },
      { name: 'Laravel', icon: 'laravel' },
      { name: 'REST APIs' },
      { name: 'JWT auth', icon: 'jwt' },
    ],
  },
  {
    label: 'Database & cloud',
    tools: [
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'Vercel', icon: 'vercel' },
      { name: 'Netlify', icon: 'netlify' },
      { name: 'Hostinger', icon: 'hostinger' },
    ],
  },
  {
    label: 'AI & dev tools',
    tools: [
      { name: 'Claude Code', icon: 'claude' },
      { name: 'ChatGPT', icon: 'chatgpt' },
      { name: 'Gemini', icon: 'gemini' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'Figma', icon: 'figma' },
      { name: 'Postman', icon: 'postman' },
    ],
  },
];

export const techToolCount = techGroups.reduce((n, g) => n + g.tools.length, 0);

export type Certification = {
  name: string;
  issuer: string;
  /** Short issuer label for the credentials list (e.g. "Cisco"). */
  issuerShort: string;
  /** One-word domain tag shown as a pill. */
  category: string;
  /** Human date. `iso` drives sort order (newest first). */
  date: string;
  iso: string;
  verifyUrl: string;
};

export const certifications: Certification[] = [
  { name: 'Backend Development and APIs V8', issuer: 'freeCodeCamp', issuerShort: 'freeCodeCamp', category: 'Backend', date: 'Oct 2025', iso: '2025-10-04', verifyUrl: 'https://www.freecodecamp.org/certification/janncarldungo/back-end-development-and-apis' },
  { name: 'Legacy JS Algorithms & Data Structures V7', issuer: 'freeCodeCamp', issuerShort: 'freeCodeCamp', category: 'Algorithms', date: 'Oct 2025', iso: '2025-10-04', verifyUrl: 'https://www.freecodecamp.org/certification/janncarldungo/javascript-algorithms-and-data-structures' },
  { name: 'Design Thinking for Beginners', issuer: 'Simplilearn', issuerShort: 'Simplilearn', category: 'Product', date: 'Jul 2025', iso: '2025-07-25', verifyUrl: 'https://simpli-web.app.link/e/dz8n50OQZ0b' },
  { name: 'Introduction to PHP', issuer: 'Simplilearn', issuerShort: 'Simplilearn', category: 'Backend', date: 'Feb 2025', iso: '2025-02-09', verifyUrl: 'https://simpli-web.app.link/e/Zx7oBtVQZ0b' },
  { name: 'JavaScript Essentials 1', issuer: 'Cisco Networking Academy', issuerShort: 'Cisco', category: 'JavaScript', date: 'Oct 2024', iso: '2024-10-25', verifyUrl: 'https://www.credly.com/badges/634d8a44-d734-428a-9666-da71fd2d9526' },
  { name: 'Work with Components in Figma', issuer: 'Coursera Project Network', issuerShort: 'Coursera', category: 'Design', date: 'Sep 2024', iso: '2024-09-23', verifyUrl: 'https://coursera.org/verify/EE1VVECBQ8DE' },
  { name: 'Introduction to Figma', issuer: 'Simplilearn', issuerShort: 'Simplilearn', category: 'Design', date: 'Sep 2024', iso: '2024-09-21', verifyUrl: 'https://simpli-web.app.link/e/E3zXoWTQZ0b' },
  { name: 'Responsive Web Design', issuer: 'freeCodeCamp', issuerShort: 'freeCodeCamp', category: 'Frontend', date: 'Sep 2024', iso: '2024-09-07', verifyUrl: 'https://www.freecodecamp.org/certification/janncarldungo/responsive-web-design' },
];

/** Distinct issuers, in list order — for the "N earned · M issuers" summary. */
export const certIssuerCount = new Set(certifications.map((c) => c.issuer)).size;

export type ExperienceEntry = { index: string; title: string; org: string; period: string; bullets: string[] };

export const experience: ExperienceEntry[] = [
  {
    index: '01',
    title: 'Student Aide — University Library',
    org: 'Holy Angel University',
    period: 'June 2025 – May 2026',
    bullets: [
      'Resolved student inquiries regarding research tools and digital resources',
      'Processed check-in/check-out transactions ensuring accurate record-keeping',
      'Improved communication skills in a service-oriented environment',
    ],
  },
  {
    index: '02',
    title: 'Student Aide — HAU Store',
    org: 'Holy Angel University',
    period: 'Dec 2024 – June 2025',
    bullets: [
      'Resolved customer inquiries during peak university hours with composure',
      'Streamlined customer service, strengthening ability to multitask under pressure',
      'Supported daily store operations including inventory and transactions',
    ],
  },
];

/** The About section's focus row.
 *
 *  This is positioning, not inventory — the only place on the page that says
 *  what *kind* of engineer he is. Deliberately names no framework: the Stack
 *  section below already lists 30 tools, so repeating React / Laravel /
 *  PostgreSQL here would be the third telling of the same thing and would
 *  collapse the one distinction worth keeping (stack = tools I know, focus =
 *  problems I choose).
 *
 *  Rule for editing: every entry must be provable from the work on this page.
 *  As it stands —
 *    Offline-first web apps ..... gastos: service worker + IndexedDB outbox
 *    REST API design ............ gastos: 32 routes folded into 10 dispatchers
 *    Database & schema design ... gastos: ledger-derived balances, money as strings
 *    Accessible by default ...... WeePlay: skip link, ARIA, keyboard, from commit one
 *    Shipping under constraints . gastos: the 12-function cap; WeePlay: low-end phones
 */
export const focusAreas = [
  'Offline-first web apps',
  'REST API design',
  'Database & schema design',
  'Accessible by default',
  'Shipping under constraints',
];

export const siteInfo = {
  name: 'Jann Carl Dungo',
  handle: 'jcdungoo20',
  email: 'jcdungo20@gmail.com',
  phone: '0915-246-8287',
  phoneHref: 'tel:09152468287',
  location: 'Sapang Maisac, Mexico, Pampanga',
  university: 'Holy Angel University — BSIT (Web Dev)',
  url: 'https://janncarl.vercel.app',
  education: {
    track: 'Web Development track',
    degree: 'BS Information Technology',
    year: '4th year',
    school: 'Holy Angel University',
    honor: "Dean's Lister · 2023–present",
  },
  github: 'https://github.com/Jcarldungo',
  linkedin: 'https://www.linkedin.com/in/jann-carl-dungo-3948272a1/',
  emailjs: {
    publicKey: 'LwJqauSQo1Xu0WEHk',
    serviceId: 'service_6vyl1sy',
    templateId: 'template_6enn7yh',
  },
};
