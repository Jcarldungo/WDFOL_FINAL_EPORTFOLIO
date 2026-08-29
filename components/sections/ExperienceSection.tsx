import { experience, certifications, certIssuerCount } from '@/lib/content';

const CheckIcon = (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.1 14.4l-4-4 1.4-1.4 2.6 2.6 5.6-5.6L17.9 9l-7 7.4z" />
  </svg>
);

/** Experience + Credentials as one section: a connected timeline for the two
 *  real jobs, then every real certification as a verifiable row — issuer,
 *  name, domain tag, date, and a link straight to the issuer's record. */
export function ExperienceSection() {
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

        <div className="cert-list-block reveal">
          <h3 className="cert-list-label">Certifications</h3>
          <p className="cert-list-note">
            {certifications.length} earned · {certIssuerCount} issuers · every credential links to its issuer.
          </p>
          <ol className="cert-list">
            {certifications.map((cert) => (
              <li key={cert.name} className="cert-row">
                <a href={cert.verifyUrl} target="_blank" rel="noopener" className="cert-row-link">
                  <span className="cert-issuer">
                    <span className="cert-dot" aria-hidden="true" />
                    {cert.issuerShort}
                  </span>
                  <span className="cert-name">{cert.name}</span>
                  <span className="cert-tag">{cert.category}</span>
                  <span className="cert-date">{cert.date}</span>
                  <span className="cert-check">
                    {CheckIcon}
                    <span className="sr-only">Verified — opens the issuer&apos;s record</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
