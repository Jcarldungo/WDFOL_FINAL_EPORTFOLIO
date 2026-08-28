import type { Project } from '@/lib/content';

/** The Problem / What I Did / Outcome / Built With body of a project —
 *  revealed inside that project's `<details>` in the single-page Projects
 *  section. Extracted from the old `/projects/[slug]` case-study route. */
export function ProjectCaseStudy({ project }: { project: Project }) {
  return (
    <>
      <div className="pv-case">
        <div className="pv-case-label">Case study</div>

        <div className="pv-case-block">
          <h4 className="pv-case-head">The problem</h4>
          <p>{project.problem}</p>
        </div>

        <div className="pv-case-block">
          <h4 className="pv-case-head">What I did</h4>
          <ul className="pv-case-list pv-case-list--did">
            {project.whatIDid.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>

        <div className="pv-case-block">
          <h4 className="pv-case-head">Outcome</h4>
          <ul className="pv-case-list pv-case-list--out">
            {project.outcome.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>
      </div>

      <div className="pv-built">
        <h4 className="pv-built-label">Built with</h4>
        <div className="pv-built-chips">
          {project.builtWith.map((tech) => <span key={tech} className="pv-chip">{tech}</span>)}
        </div>
      </div>
    </>
  );
}
