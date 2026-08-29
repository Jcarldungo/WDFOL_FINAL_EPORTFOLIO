import Link from 'next/link';
import { projects, type Project } from '@/lib/content';

const STATUS_LABEL: Record<Project['status'], string> = {
  live: 'Live',
  client: 'Client',
  'in-progress': 'In progress',
};

function metaLine(p: Project): string {
  if (p.draft) return 'In progress';
  const parts: string[] = [];
  if (p.screens?.length) parts.push(`${p.screens.length} screens`);
  parts.push(STATUS_LABEL[p.status]);
  return parts.join(' · ');
}

function WorkCard({ project, n }: { project: Project; n: number }) {
  const num = String(n).padStart(2, '0');
  const shot = project.previewImage ?? '/images/placeholder-16x10.svg';
  const style = project.accent ? ({ ['--proj-accent' as string]: project.accent } as React.CSSProperties) : undefined;

  const inner = (
    <>
      <div className="work-card-head">
        <span className="work-card-n">{num}</span>
        <span className="work-card-status">{STATUS_LABEL[project.status]}</span>
      </div>
      <div className="work-card-shot">
        <span className="work-card-glow" aria-hidden="true" />
        <div className="wf">
          <div className="wf-bar">
            <i /><i /><i />
            {project.frameUrl && <span className="wf-url">{project.frameUrl}</span>}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shot} alt={project.draft ? '' : `${project.title} screenshot`} loading="lazy" width={960} height={600} />
        </div>
      </div>
      <div className="work-card-body">
        <span className="work-card-cat">{project.category}</span>
        <h3 className="work-card-title">{project.title}</h3>
        <p className="work-card-desc">{project.shortDesc ?? project.lede}</p>
      </div>
      <div className="work-card-foot">
        <span className="work-card-meta">{metaLine(project)}</span>
        {!project.draft && (
          <span className="work-card-open">Open <span aria-hidden="true">↗</span></span>
        )}
      </div>
    </>
  );

  if (project.draft) {
    return (
      <li className="work-card work-card--draft" aria-label={`${project.title} — in progress`}>
        {inner}
      </li>
    );
  }

  return (
    <li className="work-card reveal" style={style}>
      <Link href={`/work/${project.slug}`} className="work-card-link">
        {inner}
      </Link>
    </li>
  );
}

/** The catalogue. Each live project links to its own /work/[slug] detail
 *  view; drafts render as dimmed, non-clickable placeholders. */
export function ProjectsSection() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-label"><span className="c-comment">{'// '}</span>selected work</div>
          <h2 className="section-title" id="projects-title">The <span className="gradient-text">proof</span></h2>
          <p className="section-subtitle">
            Open a project to walk the real screens — every shot is the running build, not a mockup.
          </p>
        </div>

        <ol className="work-grid">
          {projects.map((project, i) => (
            <WorkCard key={project.slug} project={project} n={i + 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}
