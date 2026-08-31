import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  corePlugins: {
    /* The site has its own `.container` (app/styles/layout/grid.css). Tailwind
       emits a utility of the same name whenever the word appears in a scanned
       file, and — landing later in the cascade at equal specificity — it was
       silently winning: `width:100%` with breakpoint max-widths instead of
       `min(1200px, 92vw)`. Below 640px that left the page with no side gutter
       at all, so body copy ran into the screen edge on every phone. */
    container: false,
  },
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-2': 'var(--bg-2)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        text: 'var(--text)',
        'text-2': 'var(--text-2)',
        'text-3': 'var(--text-3)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        border: 'var(--border)',
        'border-2': 'var(--border-2)',
        green: 'var(--green)',
        red: 'var(--red)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
        pill: 'var(--radius-pill)',
      },
    },
  },
  plugins: [],
};

export default config;
