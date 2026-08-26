import Image from 'next/image';
import { projects } from '@/lib/content';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectsReveal } from './ProjectsReveal';

export const metadata = {
  title: 'Projects | Jann Carl Dungo',
  description: 'Real client and personal projects built by Jann Carl Dungo — WeePlay Therapy Center and gastos.',
};

export default function Projects() {
  return (
    <ProjectsReveal>
      <section className="section" style={{ paddingTop: 120 }} aria-labelledby="proj-heading">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-label">Portfolio</div>
            <h1 className="section-title" id="proj-heading">What I&apos;ve built — <span className="gradient-text">and what I can do</span></h1>
            <p className="section-subtitle">Real client and personal work. Open any one to read how it was built and what it had to solve.</p>
          </div>

          <div className="proj-index reveal">
            <ol className="proj-rows" aria-label="Project list">
              {projects.map((project, i) => (
                <ProjectCard key={project.slug} project={project} index={i} />
              ))}
            </ol>

            <div className="proj-preview" aria-hidden="true">
              <div className="proj-preview-frame">
                <div className="proj-preview-bar">
                  <span className="proj-preview-dot"></span><span className="proj-preview-dot"></span><span className="proj-preview-dot"></span>
                </div>
                <Image src={projects[0].heroImage} alt="" width={640} height={400} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </ProjectsReveal>
  );
}
