'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Project } from '@/lib/content';
import { BLUR_DATA_URL } from '@/lib/blur';
import { IndexRow } from '@/components/IndexRow';

const arrowIcon = (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M6 14 14 6M14 6H8M14 6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Row list + preview panel, coupled: hovering or focusing a row swaps the
 *  screenshot shown in the sticky preview frame beside it. The row title is
 *  a stretched link, so the whole row opens the case study on click/enter —
 *  the preview swap is pure enhancement. */
export function ProjectsIndex({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex];

  return (
    <div className="proj-index reveal">
      <ol className="index-rows" aria-label="Project list">
        {projects.map((project, i) => (
          <IndexRow
            key={project.slug}
            className={`proj-index-row reveal reveal-delay-${i + 1}`}
            num={String(i + 1).padStart(2, '0')}
            title={project.title}
            titleAs="h2"
            href={`/projects/${project.slug}`}
            desc={project.shortDesc}
            media={
              <Image
                src={project.previewImage ?? project.heroImage}
                alt={`${project.title} — screenshot`}
                width={640}
                height={400}
                quality={90}
                sizes="(max-width: 768px) 90vw, 45vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            }
            meta={
              <>
                <span className="index-row-meta-dot" aria-hidden="true" />
                {project.frameUrl}
              </>
            }
            trailing={<span className="index-row-arrow" aria-hidden="true">{arrowIcon}</span>}
            onActivate={() => setActiveIndex(i)}
          />
        ))}
      </ol>

      <div className="proj-preview" aria-hidden="true">
        <div className="proj-preview-frame">
          <div className="proj-preview-bar">
            <span className="proj-preview-dot"></span><span className="proj-preview-dot"></span><span className="proj-preview-dot"></span>
          </div>
          <Image
            key={active.slug}
            src={active.previewImage ?? active.heroImage}
            alt=""
            width={640}
            height={400}
            quality={90}
            sizes="625px"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </div>
      </div>
    </div>
  );
}
