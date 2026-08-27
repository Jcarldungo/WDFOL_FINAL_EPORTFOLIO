import { projects } from '@/lib/content';
import { ProjectsIndex } from './ProjectsIndex';
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

          <ProjectsIndex projects={projects} />
        </div>
      </section>
    </ProjectsReveal>
  );
}
