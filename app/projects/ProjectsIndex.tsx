'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Project } from '@/lib/content';
import { ProjectCard } from '@/components/ProjectCard';

/** Row list + preview panel, coupled: hovering or focusing a row swaps the
 *  screenshot shown in the sticky preview frame beside it. */
export function ProjectsIndex({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex];

  return (
    <div className="proj-index reveal">
      <ol className="proj-rows" aria-label="Project list">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} onActivate={() => setActiveIndex(i)} />
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
          />
        </div>
      </div>
    </div>
  );
}
