import type { Metadata, Viewport } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AmbientBackground } from '@/components/AmbientBackground';
import { RevealScope } from '@/components/RevealScope';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://janncarldungo.vercel.app'),
  title: {
    default: 'Jann Carl Dungo | Full-Stack Developer',
    template: '%s',
  },
  description:
    'Jann Carl Dungo (jcdungoo20) — Full-Stack Developer building efficient full-stack systems with React, Vue.js, Node.js, PHP, and REST APIs.',
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
  authors: [{ name: 'Jann Carl Dungo' }],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Jann Carl Dungo | Full-Stack Developer',
    description:
      'Building structured, efficient full-stack systems with React, Vue.js, Node.js, PHP, and RESTful APIs.',
    type: 'website',
    siteName: 'Jann Carl Dungo',
    url: 'https://janncarldungo.vercel.app/',
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
  themeColor: '#0b0d10',
};

const THEME_INIT_SCRIPT = `
(function() {
  try {
    var saved = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
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
      className={`${syne.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script id="theme-init" strategy="beforeInteractive">{THEME_INIT_SCRIPT}</Script>
        <ThemeProvider>
          <AmbientBackground />
          <RevealScope />
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Nav />
          <main id="main-content" role="main">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
