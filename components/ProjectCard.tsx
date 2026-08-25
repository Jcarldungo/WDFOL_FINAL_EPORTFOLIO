import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/content';

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <li className={`proj-row reveal reveal-delay-${index + 1}`}>
      <span className="proj-row-num">{String(index + 1).padStart(2, '0')}</span>
      <div className="proj-row-body">
        <h2 className="proj-row-title">{project.title}</h2>
        <p className="proj-row-desc">{project.shortDesc}</p>
        <span className="proj-row-meta"><span className="proj-row-dot" aria-hidden="true"></span>{project.frameUrl}</span>
      </div>
      <Link href={`/projects/${project.slug}`} className="proj-row-btn" aria-label={`Open ${project.title} case study`}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M6 14 14 6M14 6H8M14 6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </Link>
    </li>
  );
}
