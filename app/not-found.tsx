import Link from 'next/link';

export const metadata = {
  title: 'Page not found | Jann Carl Dungo',
};

export default function NotFound() {
  return (
    <section className="section section--page-top">
      <div className="container">
        <div className="notfound">
          <p className="section-label">404</p>
          <h1 className="section-title">This page doesn&apos;t exist</h1>
          <p className="section-subtitle">
            The link may be broken or the page may have moved. Here&apos;s the way back.
          </p>
          <div className="notfound-actions">
            <Link className="btn btn-primary" href="/">Back home</Link>
            <Link className="btn btn-outline" href="/#projects">See projects</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
