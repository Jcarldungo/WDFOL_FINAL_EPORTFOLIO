import Link from 'next/link';

/** Full-screen detail-view chrome: wordmark home link, an N / M project
 *  pager, and a close control back to the catalogue. */
export function WorkTopBar({
  current,
  total,
  prevSlug,
  nextSlug,
}: {
  current: number;
  total: number;
  prevSlug: string;
  nextSlug: string;
}) {
  return (
    <div className="work-topbar">
      <Link href="/" className="work-wordmark" aria-label="Jann Carl Dungo — home">
        JD <span>/ work</span>
      </Link>

      <div className="work-pager">
        <Link href={`/work/${prevSlug}`} className="work-pager-btn" aria-label="Previous project">
          <span aria-hidden="true">‹</span>
        </Link>
        <span className="work-pager-count">
          {String(current).padStart(2, '0')} <span aria-hidden="true">/</span> {String(total).padStart(2, '0')}
        </span>
        <Link href={`/work/${nextSlug}`} className="work-pager-btn" aria-label="Next project">
          <span aria-hidden="true">›</span>
        </Link>
      </div>

      <Link href="/#projects" className="work-x" aria-label="Back to all projects">
        <span aria-hidden="true">✕</span>
      </Link>
    </div>
  );
}
