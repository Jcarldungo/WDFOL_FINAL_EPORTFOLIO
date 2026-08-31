import Link from 'next/link';
import { siteInfo } from '@/lib/content';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

/** Lives outside the (site) route group, so it gets no nav and no footer —
 *  the section anchors those carry (#projects, #contact) don't exist here and
 *  would be dead links. It brings its own minimal chrome instead, matching the
 *  /work top bar, so there is always a way out. */
export default function NotFound() {
  return (
    <div className="notfound-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <div className="work-topbar">
        <Link href="/" className="work-wordmark" aria-label={`${siteInfo.name} — home`}>
          JD <span>/ 404</span>
        </Link>
        <Link href="/#projects" className="work-jump">See the work →</Link>
      </div>

      <main id="main-content" role="main" className="notfound-main">
        <div className="notfound">
          <p className="section-label">404</p>
          <h1 className="section-title">This page doesn&apos;t exist</h1>
          <p className="section-subtitle">
            The link may be broken, or the page may have moved. Here&apos;s the way back.
          </p>
          <div className="notfound-actions">
            <Link className="btn btn-primary" href="/">Back home</Link>
            <Link className="btn btn-outline" href="/#projects">See projects</Link>
            <a className="work-jump" href={`mailto:${siteInfo.email}`}>{siteInfo.email}</a>
          </div>
        </div>
      </main>
    </div>
  );
}
