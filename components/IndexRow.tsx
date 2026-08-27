import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * One numbered editorial row — the shared primitive behind the homepage
 * "What I Build" list and the projects index. Replaces the near-identical
 * .svc-row and .proj-row systems.
 *
 * When `href` is set the whole row becomes clickable via a stretched link
 * on the title; `trailing` content stays above it (z-indexed) so buttons
 * inside it remain independently clickable. `onActivate` fires on pointer
 * enter and on focus entering the row (used to drive the projects preview).
 */
export type IndexRowProps = {
  num: string;
  title: string;
  titleAs?: 'h2' | 'h3' | 'div';
  href?: string;
  desc?: string;
  meta?: ReactNode;
  media?: ReactNode;
  trailing?: ReactNode;
  onActivate?: () => void;
  className?: string;
};

export function IndexRow({
  num,
  title,
  titleAs: TitleTag = 'h3',
  href,
  desc,
  meta,
  media,
  trailing,
  onActivate,
  className = '',
}: IndexRowProps) {
  return (
    <li
      className={`index-row${className ? ` ${className}` : ''}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      <span className="index-row-num" aria-hidden="true">{num}</span>
      <div className="index-row-body">
        {media && <div className="index-row-media">{media}</div>}
        <TitleTag className="index-row-title">
          {href ? (
            <Link href={href} className="index-row-link">{title}</Link>
          ) : (
            title
          )}
        </TitleTag>
        {desc && <p className="index-row-desc">{desc}</p>}
        {meta && <div className="index-row-meta">{meta}</div>}
      </div>
      {trailing && <div className="index-row-trailing">{trailing}</div>}
    </li>
  );
}
