import type { Metadata, Viewport } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/components/ThemeProvider';
import { DeveloperModeProvider } from '@/components/DeveloperModeProvider';
import { AmbientBackground } from '@/components/AmbientBackground';
import { RevealScope } from '@/components/RevealScope';
import { ModeTransition } from '@/components/ModeTransition';
import { ModeWipeOverlay } from '@/components/ModeWipeOverlay';
import { siteInfo, publishedProjects } from '@/lib/content';
import './globals.css';

const SITE_URL = siteInfo.url;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Jann Carl Dungo | Full-Stack Developer',
    template: '%s | Jann Carl Dungo',
  },
  description:
    'Jann Carl Dungo (jcdungoo20) — Full-Stack Developer building efficient full-stack systems with React, Vue.js, Node.js, PHP, and REST APIs.',
  applicationName: 'Jann Carl Dungo — Portfolio',
  keywords: [
    'Jann Carl Dungo',
    'jcdungoo20',
    'full-stack developer',
    'Holy Angel University',
    'Node.js',
    'PHP',
    'React',
    'Vue.js',
    'Angular',
    'MySQL',
    'MongoDB',
    'REST API',
    'web development',
    'Pampanga',
  ],
  authors: [{ name: siteInfo.name, url: SITE_URL }],
  creator: siteInfo.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    title: 'Jann Carl Dungo | Full-Stack Developer',
    description:
      'Building structured, efficient full-stack systems with React, Vue.js, Node.js, PHP, and RESTful APIs.',
    type: 'website',
    locale: 'en_PH',
    siteName: 'Jann Carl Dungo',
    url: SITE_URL,
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jann Carl Dungo — Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jann Carl Dungo | Full-Stack Developer',
    description: 'Full-Stack Developer. React, Vue.js, Node.js, PHP, MySQL, MongoDB.',
    images: ['/images/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0b0d10' },
    { media: '(prefers-color-scheme: light)', color: '#f6f7f8' },
  ],
};

/** Structured data so a search for the name resolves to a person with a
 *  known role, school and project list — not just a page title. */
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteInfo.name,
  alternateName: siteInfo.handle,
  url: SITE_URL,
  image: `${SITE_URL}/images/profile.jpg`,
  jobTitle: 'Full-Stack Developer',
  email: `mailto:${siteInfo.email}`,
  address: { '@type': 'PostalAddress', addressRegion: 'Pampanga', addressCountry: 'PH' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: siteInfo.education.school },
  sameAs: [siteInfo.github, siteInfo.linkedin],
  knowsAbout: ['Full-stack development', 'React', 'Node.js', 'Laravel', 'PHP', 'REST API design', 'PostgreSQL', 'MySQL', 'MongoDB'],
  mainEntityOfPage: SITE_URL,
  subjectOf: publishedProjects.map((p) => ({
    '@type': 'CreativeWork',
    name: p.title,
    description: p.lede,
    url: `${SITE_URL}/work/${p.slug}`,
  })),
};

const THEME_INIT_SCRIPT = `
(function() {
  try {
    var saved = localStorage.getItem('portfolio-theme');
    if (saved !== 'light' && saved !== 'dark') {
      saved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', saved);
  } catch (e) {}
})();
`;

const DEV_MODE_INIT_SCRIPT = `
(function() {
  try {
    var on = localStorage.getItem('portfolio-dev-mode') === 'on';
    document.documentElement.setAttribute('data-mode', on ? 'developer' : 'professional');
  } catch (e) {}
})();
`;

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-display-family',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body-family',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-family',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-mode="professional"
      className={`${syne.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script id="theme-init" strategy="beforeInteractive">{THEME_INIT_SCRIPT}</Script>
        <Script id="dev-mode-init" strategy="beforeInteractive">{DEV_MODE_INIT_SCRIPT}</Script>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <ThemeProvider>
          <DeveloperModeProvider>
            <AmbientBackground />
            <RevealScope />
            <ModeTransition />
            <ModeWipeOverlay />
            {children}
          </DeveloperModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
