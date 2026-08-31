import Image from 'next/image';
import Link from 'next/link';
import { cardTechOf, publishedProjects, type Project } from '@/lib/content';
import { BLUR_DATA_URL } from '@/lib/blur';

const STATUS_LABEL: Record<Project['status'], string> = {
  live: 'Live',
  client: 'Client',
  'in-progress': 'In progress',
};

/** Status already sits in the card head, so the foot carries the one thing
 *  it doesn't: how much there is to look at. */
function metaLine(p: Project): string {
  const n = p.screens?.length ?? 0;
  return n ? `${n} ${n === 1 ? 'screen' : 'screens'}` : 'Case study';
}

const COUNT_WORD = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];

function WorkCard({ project, n }: { project: Project; n: number }) {
  const num = String(n).padStart(2, '0');
  const style = project.accent
    ? ({ ['--proj-accent' as string]: project.accent } as React.CSSProperties)
    : undefined;

  return (
    <li className="work-card reveal" style={style}>
      <Link href={`/work/${project.slug}`} className="work-card-link">
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
            {project.previewImage && (
              <Image
                src={project.previewImage}
                alt={`${project.title} — screenshot of the running build`}
                width={1600}
                height={741}
                sizes="(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 560px"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            )}
          </div>
        </div>

        <div className="work-card-body">
          <span className="work-card-cat">{project.category}</span>
          <h3 className="work-card-title">{project.title}</h3>
          <p className="work-card-desc">{project.shortDesc ?? project.lede}</p>
          <ul className="work-card-tech" aria-label={`${project.title} — built with`}>
            {cardTechOf(project).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="work-card-foot">
          <span className="work-card-meta">{metaLine(project)}</span>
          <span className="work-card-open">
            Read the build <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}

/** The catalogue. Every entry links to its own /work/[slug] case study — the
 *  list is deliberately short and entirely real; unfinished work stays out of
 *  it (see the `draft` flag in lib/content) rather than sitting here as an
 *  empty slot. */
export function ProjectsSection() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-label"><span className="c-comment">{'// '}</span>selected work</div>
          <h2 className="section-title" id="projects-title">
            The <span className="title-em">proof</span>
          </h2>
          <p className="section-subtitle">
            {COUNT_WORD[publishedProjects.length] ?? publishedProjects.length} shipped builds, opened up.
            Every shot below is the running build — walk the screens, then read how it was put together.
          </p>
        </div>

        <ol className="work-grid">
          {publishedProjects.map((project, i) => (
            <WorkCard key={project.slug} project={project} n={i + 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}
