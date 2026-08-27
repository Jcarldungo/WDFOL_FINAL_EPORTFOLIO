export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  shortDesc: string;
  lede: string;
  roles: string[];
  liveUrl: string;
  githubUrl?: string;
  heroImage: string;
  /** Higher-res, hero-fold-only crop used by the cropped index preview panel
   *  (object-fit: cover). Falls back to heroImage when not set — heroImage
   *  itself is shown uncropped on the case-study page, so a project only
   *  needs this when heroImage's resolution/composition isn't sharp enough
   *  once cover-cropped down to the preview panel's render size. */
  previewImage?: string;
  frameUrl: string;
  builtWith: string[];
  problem: string;
  whatIDid: string[];
  outcome: string[];
};

export const projects: Project[] = [
  {
    slug: 'weeplay',
    title: 'WeePlay Therapy Center',
    eyebrow: 'Client project',
    shortDesc:
      'Live client website for a pediatric therapy clinic in Pampanga — custom CSS design system, mobile-first and accessible, no framework.',
    lede: 'A production website for a pediatric therapy clinic in Mabalacat, Pampanga — live and serving actual families.',
    roles: ['Frontend Developer', 'UI Implementation'],
    liveUrl: 'https://weeplay-therapy.vercel.app',
    heroImage: '/images/project-weeplay.jpg',
    previewImage: '/images/project-weeplay-preview.jpg',
    frameUrl: 'weeplay-therapy.vercel.app',
    builtWith: ['HTML5', 'CSS3', 'Vanilla JS', 'Vercel'],
    problem:
      'A therapy clinic needed a site that communicated warmth and trust to parents, while staying fast on the low-end phones most of them actually browse on.',
    whatIDid: [
      'Built it from scratch with no framework — hand-written semantic HTML and a custom CSS design system.',
      'Made it mobile-first and accessible: skip links, ARIA labels, and full keyboard navigation.',
      'Wired up the paths a parent actually uses — click-to-call, Messenger, and an inquiry form.',
      'Added Open Graph and SEO meta so shared links preview cleanly.',
    ],
    outcome: [
      'Live and in use by a working business — not a practice project.',
      'Loads fast on low-end phones, which is most of the clinic’s traffic.',
      'Deployed on Vercel with continuous deployment from GitHub.',
    ],
  },
  {
    slug: 'gastos',
    title: 'gastos',
    eyebrow: 'Personal project',
    shortDesc:
      'Offline-first expense tracker built around a free-tier function limit — 32 routes folded into 10 dispatchers with zero URL changes.',
    lede: 'An offline-first expense tracker for logging a purchase in three taps, even with no signal.',
    roles: ['Full-Stack Developer', 'Database Design'],
    liveUrl: 'https://gastos-xi-rose.vercel.app',
    githubUrl: 'https://github.com/Jcarldungo/gastos',
    heroImage: '/images/project-gastos.jpg',
    frameUrl: 'gastos-xi-rose.vercel.app',
    builtWith: ['Vanilla JS', 'Vercel Serverless', 'Neon PostgreSQL', 'Service Worker / PWA', 'Web Push'],
    problem:
      'Logging an expense needed to survive a dead signal, and the whole app had to fit on a free plan that caps a deployment at 12 serverless functions — while the app needed about 32 routes.',
    whatIDid: [
      'Consolidated ~32 routes into 10 thin dispatcher functions, routed by a single vercel.json rewrite table shared by production and local dev — with zero change to any URL or response shape.',
      'Built an offline outbox: a service worker queues entries made with no signal and syncs them once the connection returns.',
      'Derived card balances from the transaction ledger instead of storing a typed-in number, so the balance can’t drift from the history.',
      'Kept money as strings end to end (never a JS float) and read dates back as calendar strings, not Date objects, to avoid timezone drift.',
    ],
    outcome: [
      'Runs entirely within the free tier — 10 of 12 functions used.',
      'Works with no connection and reconciles itself once back online.',
      'Installable to a phone’s home screen, with Web Push alerts for bills and budgets.',
    ],
  },
];

export type SkillCategory = { title: string; items: string[] };

export const skills: SkillCategory[] = [
  {
    title: 'Backend Engineering',
    items: ['Node.js / Express.js', 'Laravel', 'RESTful API Architecture', 'JWT Authentication', 'PHP'],
  },
  { title: 'Languages', items: ['JavaScript (ES6+)', 'Java', 'SQL', 'Python'] },
  { title: 'Databases', items: ['MongoDB (NoSQL)', 'MySQL (Relational)', 'DB Normalization'] },
  {
    title: 'Frontend & Tools',
    items: ['HTML5 / CSS3', 'React / Inertia.js', 'Vue.js / Angular', 'Tailwind CSS', 'Git / GitHub', 'Figma / Postman'],
  },
];

export type Certification = { name: string; issuer: string; date: string; verifyUrl: string };

export const certifications: Certification[] = [
  { name: 'Responsive Web Design', issuer: 'freeCodeCamp', date: 'September 7, 2024', verifyUrl: 'https://www.freecodecamp.org/certification/janncarldungo/responsive-web-design' },
  { name: 'Backend Development and APIs V8', issuer: 'freeCodeCamp', date: 'October 4, 2025', verifyUrl: 'https://www.freecodecamp.org/certification/janncarldungo/back-end-development-and-apis' },
  { name: 'Legacy JS Algorithms and Data Structures V7', issuer: 'freeCodeCamp', date: 'October 4, 2025', verifyUrl: 'https://www.freecodecamp.org/certification/janncarldungo/javascript-algorithms-and-data-structures' },
  { name: 'Introduction to Figma', issuer: 'Simplilearn', date: 'September 21, 2024', verifyUrl: 'https://simpli-web.app.link/e/E3zXoWTQZ0b' },
  { name: 'Work with Components in Figma', issuer: 'Coursera Project Network', date: 'September 23, 2024', verifyUrl: 'https://coursera.org/verify/EE1VVECBQ8DE' },
  { name: 'JavaScript Essentials 1', issuer: 'Cisco Networking Academy', date: 'October 25, 2024', verifyUrl: 'https://www.credly.com/badges/634d8a44-d734-428a-9666-da71fd2d9526' },
  { name: 'Introduction to PHP', issuer: 'Simplilearn', date: 'February 9, 2025', verifyUrl: 'https://simpli-web.app.link/e/Zx7oBtVQZ0b' },
  { name: 'Design Thinking for Beginners', issuer: 'Simplilearn', date: 'July 25, 2025', verifyUrl: 'https://simpli-web.app.link/e/dz8n50OQZ0b' },
];

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

export type Capability = { num: string; title: string; desc: string };

export const capabilities: Capability[] = [
  {
    num: '01',
    title: 'Full-Stack Web Development',
    desc: 'Complete web apps built from scratch — semantic markup, a custom CSS system, and the server side behind it. No page-builder, no template.',
  },
  {
    num: '02',
    title: 'REST API Design & Development',
    desc: 'Clean, predictable endpoints with real auth, validation, and error handling — including working within tight hosting limits when the plan caps you.',
  },
  {
    num: '03',
    title: 'Database Design',
    desc: 'Schemas modelled on how the data is actually queried — normalised tables, sane constraints, and columns that mean one thing each.',
  },
  {
    num: '04',
    title: 'Responsive & Accessible Frontends',
    desc: 'Mobile-first layouts tuned for low-end phones, with skip links, ARIA labels, and keyboard navigation built in rather than bolted on.',
  },
];

export const softSkills = [
  'Problem Solving',
  'Team Collaboration',
  'Time Management',
  'Patience',
  'Adaptability',
  'Works Under Pressure',
];

export const siteInfo = {
  name: 'Jann Carl Dungo',
  handle: 'jcdungoo20',
  email: 'jcdungo20@gmail.com',
  phone: '0915-246-8287',
  phoneHref: 'tel:09152468287',
  location: 'Sapang Maisac, Mexico, Pampanga',
  university: 'Holy Angel University — BSIT (Web Dev)',
  github: 'https://github.com/Jcarldungo',
  linkedin: 'https://www.linkedin.com/in/jann-carl-dungo-3948272a1/',
  emailjs: {
    publicKey: 'LwJqauSQo1Xu0WEHk',
    serviceId: 'service_6vyl1sy',
    templateId: 'template_6enn7yh',
  },
};
