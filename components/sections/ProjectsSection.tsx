'use client';

import Image from 'next/image';
import { projects } from '@/lib/content';
import { BLUR_DATA_URL } from '@/lib/blur';
import { ProjectCaseStudy } from '@/components/ProjectCaseStudy';

/** Both real case studies, inlined as expandable `<details>` cards rather
 *  than a separate `/projects/[slug]` route — see the "case studies fold
 *  inline" decision in the redesign plan. Native `<details id="project-*">`
 *  gives shareable, auto-expanding deep links with zero custom JS. */
export function ProjectsSection() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-label"><span className="c-comment">{'// '}</span>selected work</div>
          <h2 className="section-title" id="projects-title">The <span className="gradient-text">proof</span></h2>
          <p className="section-subtitle">
            Two things I&apos;ve shipped: a live client website, and a full-stack app built
            around a hard hosting constraint.
          </p>
        </div>

        <div className="proj-features">
          {projects.map((project, i) => (
            <details
              key={project.slug}
              id={`project-${project.slug}`}
              className={`proj-feature reveal${i % 2 === 1 ? ' proj-feature--flip' : ''}`}
            >
              <summary className="proj-feature-summary">
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
                    sizes="(max-width: 1024px) 92vw, 560px"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                </div>

                <div className="pv-hero-text">
                  <div className="pv-eyebrow">{project.eyebrow}</div>
                  <h3 className="pv-title">{project.title}</h3>
                  <p className="pv-lede">{project.lede}</p>
                  <p className="pv-achievement">{project.achievement}</p>
                  <div className="pv-roles">
                    {project.roles.map((role) => <span key={role} className="pv-role">{role}</span>)}
                  </div>
                  <div className="pv-links">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener"
                      className="btn btn-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Live site →
                    </a>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener"
                        className="btn btn-outline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        GitHub
                      </a>
                    )}
                    <span className="proj-feature-toggle">
                      <span className="proj-feature-toggle-open">Read the case study</span>
                      <span className="proj-feature-toggle-close">Close case study</span>
                      {' '}<span aria-hidden="true">↓</span>
                    </span>
                  </div>
                </div>
              </summary>

              <ProjectCaseStudy project={project} />
            </details>
          ))}
        </div>

        <p className="inline-cta reveal">
          Have something in mind? <a href="#contact">Let&apos;s talk →</a>
        </p>
      </div>
    </section>
  );
}
