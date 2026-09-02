'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import type { Project } from '@/lib/content';
import { ScreenWalker } from '@/components/work/ScreenWalker';
import { useMotionEnabled } from '@/lib/useMotionEnabled';

const SlabMotion = dynamic(() => import('../labMotion').then((m) => ({ default: m.SlabMotion })), {
  ssr: false,
});

/** Same layoutId, same className, different children across the
 *  collapsed/expanded render — Motion measures the difference and animates
 *  it as a shared-element grow. Falls back to a plain div (still fully
 *  functional, just an instant swap) under reduced motion. */
function Slab({
  layoutId,
  className,
  style,
  children,
}: {
  layoutId: string;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const enabled = useMotionEnabled();
  if (!enabled) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <SlabMotion layoutId={layoutId} className={className} style={style}>
      {children}
    </SlabMotion>
  );
}

export function ArchiveEntry({
  project,
  expanded,
  receded,
  onToggle,
}: {
  project: Project;
  expanded: boolean;
  receded: boolean;
  onToggle: () => void;
}) {
  const panelId = `archive-panel-${project.slug}`;
  const btnId = `archive-toggle-${project.slug}`;
  const highlights = project.whatItDoes?.slice(0, 2) ?? [];
  const outcome = project.outcome?.[0];
  const style = project.accent ? ({ '--proj-accent': project.accent } as CSSProperties) : undefined;

  return (
    <Slab
      layoutId={`archive-slab-${project.slug}`}
      className={`lab-slab${expanded ? ' lab-slab--expanded' : ''}${receded ? ' lab-slab--receded' : ''}`}
      style={style}
    >
      <button type="button" id={btnId} className="lab-slab-head" aria-expanded={expanded} aria-controls={panelId} onClick={onToggle}>
        <span className="lab-slab-cat">{project.category}</span>
        <h3 className="lab-slab-title">{project.title}</h3>
        <p className="lab-slab-lede">{project.lede}</p>
        <span className="lab-slab-cta" aria-hidden="true">{expanded ? 'Collapse' : 'Expand'} {expanded ? '↑' : '↓'}</span>
      </button>

      {expanded && (
        <div id={panelId} role="region" aria-labelledby={btnId} className="lab-slab-body">
          {project.roles && <p className="lab-slab-roles">{project.roles.join(' · ')}</p>}

          {project.stats && (
            <dl className="lab-slab-stats">
              {project.stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {project.screens && project.screens.length > 0 && (
            <ScreenWalker screens={project.screens} frameUrl={project.frameUrl} />
          )}

          {highlights.length > 0 && (
            <ul className="lab-slab-highlights">
              {highlights.map((h) => (
                <li key={h.title}>
                  <strong>{h.title}</strong> — {h.desc}
                </li>
              ))}
            </ul>
          )}

          {outcome && <p className="lab-slab-outcome">{outcome}</p>}

          <div className="lab-slab-links">
            <Link href={`/work/${project.slug}?from=lab`} className="lab-link">
              Open full case study →
            </Link>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener" className="lab-link">
                Visit live ↗
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener" className="lab-link">
                GitHub ↗
              </a>
            )}
          </div>
        </div>
      )}
    </Slab>
  );
}
