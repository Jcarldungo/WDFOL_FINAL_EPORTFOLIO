import { experience, certifications } from '@/lib/content';

const ISSUER_ORDER = ['freeCodeCamp', 'Simplilearn', 'Coursera Project Network', 'Cisco Networking Academy'];

function certClusters() {
  return ISSUER_ORDER.map((issuer) => ({
    issuer,
    certs: certifications.filter((c) => c.issuer === issuer),
  })).filter((cluster) => cluster.certs.length > 0);
}

/** Experience + Credentials as one storytelling section rather than a
 *  resume wall: a connected timeline for the two real jobs, and the 8 real
 *  certifications clustered by issuer instead of 8 flat identical rows. */
export function ExperienceSection() {
  const clusters = certClusters();

  return (
    <section id="experience" className="section section-alt" aria-labelledby="experience-title">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-label"><span className="c-comment">{'// '}</span>track record</div>
          <h2 className="section-title" id="experience-title">
            Experience &amp; <span className="gradient-text">Credentials</span>
          </h2>
        </div>

        <div className="exp-timeline">
          <h3 className="exp-timeline-label">On the job</h3>
          <div className="exp-list-timeline">
            {experience.map((job, i) => (
              <div key={job.title} className={`exp-card reveal ${i % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}>
                <div className="exp-icon">{job.index}</div>
                <div className="exp-body">
                  <h4 className="exp-title">{job.title}</h4>
                  <div className="exp-org">{job.org} · {job.period}</div>
                  <ul className="exp-list">
                    {job.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cert-clusters">
          <h3 className="cert-clusters-label">Certified in</h3>
          <p className="section-subtitle">All certifications are real and verifiable — click any one to confirm it.</p>
          <div className="cert-cluster-grid">
            {clusters.map((cluster, i) => (
              <div key={cluster.issuer} className={`cert-cluster reveal reveal-delay-${i + 1}`}>
                <h4 className="cert-cluster-issuer">{cluster.issuer}</h4>
                <div className="cert-cluster-chips">
                  {cluster.certs.map((cert) => (
                    <a
                      key={cert.name}
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener"
                      className="cert-chip"
                      title={`${cert.date} · Verify →`}
                    >
                      {cert.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
