import { techGroups, techToolCount } from '@/lib/content';
import { TechIcon } from '@/components/TechIcon';

/** The toolkit — every tool grouped by discipline, each with its brand mark.
 *  Curated to what's actually behind the projects, not padded to look big. */
export function StackSection() {
  return (
    <section id="stack" className="section section-alt section--tight" aria-labelledby="stack-title">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-label"><span className="c-comment">{'// '}</span>the toolkit</div>
          <h2 className="section-title" id="stack-title">
            Technologies I <span className="title-em">work with</span>
          </h2>
          <p className="section-subtitle">
            {techToolCount} tools across {techGroups.length} areas — the real set behind the projects above.
          </p>
        </div>

        <div className="tech-groups reveal">
          {techGroups.map((group) => (
            <div key={group.label} className="tech-group">
              <h3 className="tech-group-label">{group.label}</h3>
              <ul className="tech-list">
                {group.tools.map((tool) => (
                  <li key={tool.name} className="tech-item">
                    <TechIcon name={tool.icon} />
                    <span>{tool.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
