'use client';

import { useState } from 'react';
import { publishedProjects } from '@/lib/content';
import { ArchiveEntry } from './ArchiveEntry';

/** Two generous, expandable "case files" rather than a dense grid — with
 *  only 2 real published projects, a list built to hold many would read as
 *  sparse. Expanding one shared-layout-grows it into the focused view. */
export function ArchiveModule() {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  return (
    <div className="lab-module lab-archive">
      <header className="lab-module-head">
        <p className="lab-module-eyebrow">Shipped, not staged</p>
        <h2>Archive</h2>
      </header>

      <div className={`lab-archive-grid${expandedSlug ? ' lab-archive-grid--focused' : ''}`}>
        {publishedProjects.map((project) => (
          <ArchiveEntry
            key={project.slug}
            project={project}
            expanded={expandedSlug === project.slug}
            receded={expandedSlug !== null && expandedSlug !== project.slug}
            onToggle={() => setExpandedSlug((s) => (s === project.slug ? null : project.slug))}
          />
        ))}
      </div>
    </div>
  );
}
