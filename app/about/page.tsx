import Image from 'next/image';
import Link from 'next/link';
import { skills, certifications, experience, softSkills, siteInfo } from '@/lib/content';

export const metadata = {
  title: 'About | Jann Carl Dungo',
  description: 'Full-stack developer bio, skills, experience, and certifications for Jann Carl Dungo.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | Jann Carl Dungo',
    description: 'Full-stack developer bio, skills, experience, and certifications for Jann Carl Dungo.',
    url: '/about',
  },
};

export default function About() {
  return (
    <>
      <section className="section section--page-top" aria-labelledby="about-heading">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-label">Who I Am</div>
            <h1 className="section-title" id="about-heading">About <span className="gradient-text">Me</span></h1>
          </div>

          <div className="two-col two-col--offset" style={{ marginTop: 48 }}>
            <div className="about-photo reveal-left">
              <div className="about-photo-frame">
                <Image
                  src="/images/profile.jpg"
                  alt="Jann Carl Dungo — profile photo"
                  width={900}
                  height={1200}
                  quality={90}
                  sizes="(max-width: 1024px) 92vw, 40vw"
                  className="about-photo-real"
                />
              </div>
              <div className="about-logo-below">
                <Image src="/icons/logo.png" alt="JD Logo" width={40} height={40} className="about-logo-img" />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}>{siteInfo.handle}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Full-Stack Developer</div>
                </div>
              </div>
            </div>

            <div className="reveal-right">
              <div className="about-bio">
                <p>Hi, I&apos;m <strong>Jann Carl Dungo</strong> — a 4th year BSIT student at <strong>Holy Angel University</strong>, majoring in Web Development, with a strong interest in full-stack development and building structured, efficient systems.</p>
                <p>I enjoy working on academic and personal projects that improve my programming and problem-solving skills. My core focus spans the full stack — backend technologies like Node.js, Express.js, PHP, JWT Authentication, and RESTful API design, paired with frontend frameworks like React, Vue.js, and Angular.</p>
                <p>Previously served as a <strong>Student Aide at the HAU University Library</strong> and the HAU Store. Based in Sapang Maisac, Mexico, Pampanga. Open to internships, freelance full-stack work, and collaborations.</p>
              </div>

              <div className="about-contact-list">
                <div className="contact-detail">
                  <div><div className="contact-detail-label">Phone</div><a href={siteInfo.phoneHref} className="contact-detail-val">{siteInfo.phone}</a></div>
                </div>
                <div className="contact-detail">
                  <div><div className="contact-detail-label">Email</div><a href={`mailto:${siteInfo.email}`} className="contact-detail-val">{siteInfo.email}</a></div>
                </div>
                <div className="contact-detail">
                  <div><div className="contact-detail-label">Location</div><div className="contact-detail-val">{siteInfo.location}</div></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 24 }}>
                <a className="btn btn-primary" href="/resume.pdf" download="JannCarlDungo_Resume.pdf">Download Resume</a>
                <Link className="btn btn-outline" href="/contact">Get in Touch</Link>
              </div>

              <div className="soft-skills-row" style={{ marginTop: 24 }}>
                {softSkills.map((skill) => (
                  <span key={skill} className="soft-skill">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="skills-heading">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-label">Technical Skills</div>
            <h2 className="section-title" id="skills-heading">Skills &amp; <span className="gradient-text">Technologies</span></h2>
          </div>
          <div className="skill-categories">
            {skills.map((cat, i) => (
              <div key={cat.title} className={`skill-cat-card reveal reveal-delay-${i + 1}`}>
                <h3 className="skill-cat-title">{cat.title}</h3>
                <ul className="skill-list">
                  {cat.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="certs-heading">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-label">Credentials</div>
            <h2 className="section-title" id="certs-heading">My <span className="gradient-text">Certifications</span></h2>
            <p className="section-subtitle">All certifications are real and verifiable — click through to confirm any of them.</p>
          </div>

          <ul className="cert-list reveal" aria-label="Certifications">
            {certifications.map((cert) => (
              <li key={cert.name} className="cert-row">
                <div className="cert-row-body">
                  <h3 className="cert-row-name">{cert.name}</h3>
                  <div className="cert-row-meta">{cert.issuer} · {cert.date}</div>
                </div>
                <a href={cert.verifyUrl} target="_blank" rel="noopener" className="card-link">Verify →</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="exp-heading">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-label">Work Experience</div>
            <h2 className="section-title" id="exp-heading">Student <span className="gradient-text">Experience</span></h2>
          </div>
          <div className="exp-grid">
            {experience.map((job, i) => (
              <div key={job.title} className={`exp-card reveal reveal-delay-${i + 1}`}>
                <div className="exp-icon">{job.index}</div>
                <div className="exp-body">
                  <h3 className="exp-title">{job.title}</h3>
                  <div className="exp-org">{job.org} · {job.period}</div>
                  <ul className="exp-list">
                    {job.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
