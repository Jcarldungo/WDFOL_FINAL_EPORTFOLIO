import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, siteInfo } from '@/lib/content';
import { BLUR_DATA_URL } from '@/lib/blur';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const url = `/projects/${project.slug}`;
  return {
    title: `${project.title} | Jann Carl Dungo`,
    description: project.lede,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} — case study`,
      description: project.lede,
      url,
      images: [{ url: project.heroImage, alt: `${project.title} screenshot` }],
    },
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <section className="section section--page-top">
      <div className="container">
        <div className="pv-hero reveal">
          <span className="pv-watermark" aria-hidden="true">{project.title}</span>
          <div className="pv-hero-text">
            <div className="pv-eyebrow">{project.eyebrow}</div>
            <h1 className="pv-title">{project.title}</h1>
            <p className="pv-lede">{project.lede}</p>
            <p className="pv-achievement">{project.achievement}</p>
            <div className="pv-roles">
              {project.roles.map((role) => <span key={role} className="pv-role">{role}</span>)}
            </div>
            <div className="pv-links">
              <a href={project.liveUrl} target="_blank" rel="noopener" className="btn btn-primary">Live site →</a>
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener" className="btn btn-outline">GitHub</a>
              )}
            </div>
          </div>
          <div className="pv-frame">
            <div className="pv-frame-bar">
              <span className="pv-frame-dot"></span><span className="pv-frame-dot"></span><span className="pv-frame-dot"></span>
              <span className="pv-frame-url">{project.frameUrl}</span>
            </div>
            <Image
              src={project.heroImage}
              alt={`${project.title} screenshot`}
              width={960}
              height={600}
              quality={90}
              priority
              sizes="(max-width: 1024px) 92vw, 620px"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>
        </div>

        <div className="pv-case reveal">
          <div className="pv-case-label">Case study</div>

          <div className="pv-case-block">
            <h2 className="pv-case-head">The problem</h2>
            <p>{project.problem}</p>
          </div>

          <div className="pv-case-block">
            <h2 className="pv-case-head">What I did</h2>
            <ul className="pv-case-list pv-case-list--did">
              {project.whatIDid.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </div>

          <div className="pv-case-block">
            <h2 className="pv-case-head">Outcome</h2>
            <ul className="pv-case-list pv-case-list--out">
              {project.outcome.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </div>
        </div>

        <div className="pv-built reveal">
          <h2 className="pv-built-label">Built with</h2>
          <div className="pv-built-chips">
            {project.builtWith.map((tech) => <span key={tech} className="pv-chip">{tech}</span>)}
          </div>
        </div>

        <div className="pv-cta reveal">
          <h2 className="pv-cta-title">Want something like this built for you?</h2>
          <p className="pv-cta-desc">Tell me what you have in mind — no obligation, just a quick chat to see if we&apos;re a fit.</p>
          <div className="pv-cta-actions">
            <a className="btn btn-primary" href={`mailto:${siteInfo.email}`}>{siteInfo.email}</a>
          </div>
        </div>

        <div className="pv-next reveal">
          <span className="pv-next-label">Next project</span>
          <Link href={`/projects/${next.slug}`} className="pv-next-btn">{next.title} →</Link>
        </div>
      </div>
    </section>
  );
}
