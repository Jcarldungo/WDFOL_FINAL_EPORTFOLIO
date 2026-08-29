import Image from 'next/image';
import { focusAreas, recognition, siteInfo } from '@/lib/content';
import { BLUR_DATA_URL } from '@/lib/blur';

const { education } = siteInfo;

const TrophyIcon = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M18 4V3H6v1H2v3a5 5 0 004.6 4.98A6 6 0 0011 15.9V19H7v2h10v-2h-4v-3.1a6 6 0 004.4-3.92A5 5 0 0022 7V4h-4zM4 7V6h2v3.83A3 3 0 014 7zm16 0a3 3 0 01-2 2.83V6h2v1z" />
  </svg>
);

/** Context for a person, not a capability pitch — the projects carry the
 *  proof. A small portrait + an education block, two short paragraphs, real
 *  recognition, and a focus tag row. */
export function AboutSection() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-label"><span className="c-comment">{'// '}</span>who i am</div>
          <h2 className="section-title" id="about-title">About <span className="gradient-text">Me</span></h2>
        </div>

        <div className="about-edu reveal">
          <div className="about-portrait">
            <Image
              src="/images/profile.jpg"
              alt="Jann Carl Dungo"
              width={400}
              height={400}
              quality={90}
              sizes="180px"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>

          <div className="about-edu-text">
            <span className="about-track">{education.track}</span>
            <h3 className="about-degree">{education.degree}</h3>
            <p className="about-school">
              <Image src="/icons/logo.png" alt="" width={20} height={20} className="about-school-crest" />
              {education.year} · {education.school}
            </p>
          </div>

          <span className="about-honor">{TrophyIcon}{education.honor}</span>
        </div>

        <div className="about-bio reveal">
          <p>
            Hi, I&apos;m <strong>Jann Carl Dungo</strong> — a full-stack developer and final-year BSIT student
            at Holy Angel University. I like building structured systems end to end: database design,
            backend APIs, and responsive, accessible interfaces.
          </p>
          <p>
            Most of what I know comes from shipping real things — a live client site, and personal projects
            like an offline-first expense tracker built around a hard hosting constraint. I&apos;m continuously
            learning, and open to internships, freelance full-stack work, and collaborations.
          </p>
        </div>

        <div className="about-recognition reveal">
          <h3 className="about-recognition-label">Recognition</h3>
          <ol className="rec-list">
            {recognition.map((r, i) => (
              <li key={r.title + i} className={`rec-row${r.draft ? ' rec-row--draft' : ''}`}>
                <span className="rec-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="rec-body">
                  <span className="rec-title">{r.title}</span>
                  {r.detail && <span className="rec-detail">{r.detail}</span>}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="about-focus reveal">
          <span className="about-focus-label"><span className="c-comment">{'// '}</span>focus</span>
          <div className="about-focus-tags">
            {focusAreas.map((f) => <span key={f} className="focus-tag">{f}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
