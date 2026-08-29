import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, projectSiblings, publishedProjects, siteInfo } from '@/lib/content';
import { WorkTopBar } from '@/components/work/WorkTopBar';
import { ScreenWalker } from '@/components/work/ScreenWalker';

export function generateStaticParams() {
  return publishedProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const url = `/work/${project.slug}`;
  return {
    title: `${project.title} — ${project.category} | Jann Carl Dungo`,
    description: project.lede,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} — how it's built`,
      description: project.lede,
      url,
      images: [{ url: project.previewImage ?? project.heroImage ?? '/images/og-image.jpg', alt: `${project.title} screenshot` }],
    },
  };
}

export default async function WorkDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { index, total, prev, next } = projectSiblings(slug);
  const primaryShot = project.heroImage ?? project.previewImage ?? '/images/placeholder-16x10.svg';
  const accentStyle = project.accent
    ? ({ ['--proj-accent' as string]: project.accent } as React.CSSProperties)
    : undefined;

  return (
    <div className="work" style={accentStyle}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <WorkTopBar
        current={index + 1}
        total={total}
        prevSlug={prev?.slug ?? slug}
        nextSlug={next?.slug ?? slug}
      />

      <main id="main-content" role="main" className="work-main">
        <header className="work-hero">
          <span className="work-hero-watermark" aria-hidden="true">{project.title}</span>

          <div className="work-hero-text reveal">
            <span className="work-cat">{project.category}</span>
            <h1 className="work-title">{project.title}</h1>
            {project.focus && <p className="work-focus">{project.focus}</p>}
            <p className="work-lede">{project.lede}</p>

            {project.stats && project.stats.length > 0 && (
              <dl className="work-stats">
                {project.stats.map((s) => (
                  <div key={s.label} className="work-stat">
                    <dt>{s.value}</dt>
                    <dd>{s.label}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="work-cta">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener" className="btn btn-primary">
                  Visit live <span aria-hidden="true">↗</span>
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener" className="btn btn-outline">
                  GitHub
                </a>
              )}
              {project.theBuild && <a href="#the-build" className="work-jump">Read the build ↓</a>}
            </div>
          </div>

          <div className="work-hero-shot reveal-right">
            <div className="wf">
              <div className="wf-bar">
                <i /><i /><i />
                {project.frameUrl && <span className="wf-url">{project.frameUrl}</span>}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={primaryShot} alt={`${project.title} screenshot`} width={1600} height={1000} />
            </div>
          </div>
        </header>

        {project.screens && project.screens.length > 0 && (
          <section className="work-section reveal">
            <ScreenWalker screens={project.screens} frameUrl={project.frameUrl} />
          </section>
        )}

        {project.theBuild && project.theBuild.length > 0 && (
          <section id="the-build" className="work-section reveal">
            <div className="work-eyebrow">The build</div>
            <div className="work-prose">
              {project.theBuild.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {project.whatItDoes && project.whatItDoes.length > 0 && (
          <section className="work-section reveal">
            <div className="work-eyebrow">What it does</div>
            <div className="work-feature-grid">
              {project.whatItDoes.map((f) => (
                <div key={f.title} className="work-feature">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {project.underTheHood && project.underTheHood.length > 0 && (
          <section className="work-section reveal">
            <div className="work-eyebrow">Under the hood</div>
            <ol className="work-hood">
              {project.underTheHood.map((h, n) => (
                <li key={h.title} className="work-hood-row">
                  <span className="work-hood-n" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{h.title}</h3>
                    <p>{h.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {(project.builtFor || project.builtWith) && (
          <section className="work-section work-tags reveal">
            {project.builtFor && project.builtFor.length > 0 && (
              <div>
                <div className="work-eyebrow">Built for</div>
                <div className="chip-row">
                  {project.builtFor.map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
              </div>
            )}
            {project.builtWith && project.builtWith.length > 0 && (
              <div>
                <div className="work-eyebrow">Built with</div>
                <div className="chip-row">
                  {project.builtWith.map((t) => <span key={t} className="chip chip--mono">{t}</span>)}
                </div>
              </div>
            )}
          </section>
        )}

        {project.outcome && project.outcome.length > 0 && (
          <section className="work-section reveal">
            <div className="work-eyebrow">Outcome</div>
            <ul className="work-outcome">
              {project.outcome.map((o) => <li key={o}>{o}</li>)}
            </ul>
          </section>
        )}

        <section className="work-close reveal">
          <h2>Curious how it&apos;s built?</h2>
          <p>Happy to walk through the code and the decisions behind it — no pitch.</p>
          <div className="work-close-actions">
            <Link href="/#contact" className="btn btn-primary">Get in touch</Link>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener" className="btn btn-outline">Read the source</a>
            )}
            <a href={`mailto:${siteInfo.email}`} className="work-jump">{siteInfo.email}</a>
          </div>
        </section>

        {prev && next && prev.slug !== next.slug && (
          <nav className="work-next" aria-label="Project navigation">
            <Link href={`/work/${prev.slug}`} className="work-next-link">
              <span aria-hidden="true">‹</span> {prev.title}
            </Link>
            <Link href={`/work/${next.slug}`} className="work-next-link work-next-link--r">
              {next.title} <span aria-hidden="true">›</span>
            </Link>
          </nav>
        )}
      </main>
    </div>
  );
}
