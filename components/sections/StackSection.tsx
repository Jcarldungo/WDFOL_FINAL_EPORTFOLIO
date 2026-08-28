import { skills } from '@/lib/content';

/** The same real tech list as before, regrouped into a client → server → data
 *  pipeline (plus the cross-cutting Foundation & Workflow tools) so it reads
 *  as a system rather than a flat list of buzzwords. */
export function StackSection() {
  return (
    <section id="stack" className="section section-alt" aria-labelledby="stack-title">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-label"><span className="c-comment">{'// '}</span>the system</div>
          <h2 className="section-title" id="stack-title">How it <span className="gradient-text">connects</span></h2>
          <p className="section-subtitle">
            The same stack behind the proof above, laid out the way a request actually
            flows — interface to server to data.
          </p>
        </div>

        <div className="stack-pipeline">
          {skills.map((cat, i) => (
            <div key={cat.title} className="stack-stage">
              <div className={`skill-cat-card reveal reveal-delay-${i + 1}`}>
                <h3 className="skill-cat-title">{cat.title}</h3>
                <ul className="skill-list">
                  {cat.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              {i < skills.length - 1 && <span className="stack-connector" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
