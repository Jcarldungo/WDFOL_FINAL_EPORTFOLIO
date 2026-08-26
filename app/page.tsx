import Image from 'next/image';
import Link from 'next/link';
import { projects, capabilities } from '@/lib/content';
import { HomeReveal } from './HomeReveal';

export const metadata = {
  title: 'Jann Carl Dungo | Full-Stack Developer',
  description:
    'Jann Carl Dungo (jcdungoo20) — Full-Stack Developer building efficient full-stack systems with React, Vue.js, Node.js, PHP, and REST APIs.',
};

export default function Home() {
  return (
    <HomeReveal>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-text">
              <div className="hero-eyebrow">
                <span className="status-dot" aria-hidden="true"></span>
                4th Year BSIT · Holy Angel University · Web Development
              </div>
              <h1 className="hero-name" id="hero-heading">
                Jann Carl<br /><span className="gradient-text">Dungo</span>
              </h1>
              <div className="hero-title-wrap">
                <span className="page-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>Full-Stack Developer</span>
              </div>
              <p className="hero-desc">
                Aspiring full-stack developer passionate about building{' '}
                <strong>structured, efficient systems</strong> using React, Vue.js, Node.js, PHP, REST APIs,
                and databases. Committed to continuous learning and eager to collaborate on meaningful projects.
              </p>

              <div className="hero-cta">
                <a className="btn btn-primary" href="/resume.pdf" download="JannCarlDungo_Resume.pdf">Download Resume</a>
                <Link className="btn btn-outline" href="/projects">View Projects →</Link>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-avatar-wrap">
                <div className="avatar-ring">
                  <div className="avatar-inner avatar-photo">
                    <Image src="/images/profile.jpg" alt="Jann Carl Dungo" width={340} height={340} quality={90} className="profile-photo" />
                  </div>
                </div>
              </div>

              <div className="hero-code-card" role="img" aria-label="Code snippet">
                <div className="code-header">
                  <span className="dot-red"></span><span className="dot-yellow"></span><span className="dot-green"></span>
                  <span className="code-filename">jann.js</span>
                </div>
                <div>
                  <span className="c-keyword">const</span> jann = {'{'}<br />
                  &nbsp;&nbsp;name: <span className="c-string">&apos;Jann Carl Dungo&apos;</span>,<br />
                  &nbsp;&nbsp;role: <span className="c-string">&apos;Full-Stack Developer&apos;</span>,<br />
                  &nbsp;&nbsp;frontend: [<span className="c-string">&apos;React&apos;</span>, <span className="c-string">&apos;Vue.js&apos;</span>, <span className="c-string">&apos;Angular&apos;</span>],<br />
                  &nbsp;&nbsp;backend: [<span className="c-string">&apos;Node.js&apos;</span>, <span className="c-string">&apos;Express&apos;</span>, <span className="c-string">&apos;Laravel&apos;</span>, <span className="c-string">&apos;PHP&apos;</span>],<br />
                  &nbsp;&nbsp;db: [<span className="c-string">&apos;MongoDB&apos;</span>, <span className="c-string">&apos;MySQL&apos;</span>],<br />
                  &nbsp;&nbsp;<span className="c-fn">serve</span>: <span className="c-keyword">async</span> (req, res) =&gt; {'{'}<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="c-keyword">const</span> data = <span className="c-keyword">await</span> <span className="c-fn">db.query</span>(req);<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;res.<span className="c-fn">json</span>({'{'} status: <span className="c-string">&apos;200 OK&apos;</span>, data {'}'});<br />
                  &nbsp;&nbsp;{'}'}<br />
                  {'}'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator" aria-hidden="true">
          <div className="scroll-mouse"><div className="scroll-wheel"></div></div>
          <span>scroll</span>
        </div>
      </section>

      <section className="section" aria-labelledby="capabilities-title">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-label">What I Do</div>
            <h2 className="section-title" id="capabilities-title">Where I <span className="gradient-text">add value</span></h2>
          </div>
          <ol className="svc-list" aria-label="Capabilities">
            {capabilities.map((cap, i) => (
              <li key={cap.num} className={`svc-row reveal reveal-delay-${(i % 4) + 1}`}>
                <span className="svc-num">{cap.num}</span>
                <div className="svc-body">
                  <h3 className="svc-title">{cap.title}</h3>
                  <p className="svc-desc">{cap.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="feat-title">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-label">Selected Work</div>
            <h2 className="section-title" id="feat-title">Featured <span className="gradient-text">Projects</span></h2>
            <p className="section-subtitle">Two live builds: a real client site, and a full-stack app built around a hard hosting constraint. More landing here soon.</p>
          </div>

          <div className="feat-projects-grid">
            {projects.map((project, i) => (
              <article key={project.slug} className={`feat-card reveal reveal-delay-${i + 1}`}>
                <div className="feat-card-img feat-card-img--photo">
                  <Image src={project.heroImage} alt={`${project.title} screenshot`} width={640} height={400} quality={90} className="feat-card-photo" />
                  <div className="feat-card-img-overlay"></div>
                </div>
                <div className="feat-card-body">
                  <div className="feat-card-tags">
                    {project.builtWith.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <h3 className="feat-card-title">{project.title}</h3>
                  <p className="feat-card-desc">{project.shortDesc}</p>
                  <div className="feat-card-links">
                    <Link href={`/projects/${project.slug}`} className="card-link">Read case study →</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 44 }} className="reveal">
            <Link className="btn btn-outline" href="/projects">See All Projects →</Link>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-label="Quick intro">
        <div className="container">
          <div className="quick-about reveal">
            <div className="quick-about-photo">
              <Image src="/images/profile.jpg" alt="Jann Carl Dungo" width={200} height={200} quality={90} className="quick-photo-img" />
            </div>
            <div className="quick-about-text">
              <div className="section-label">Who I Am</div>
              <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: 12 }}>
                Hi, I&apos;m <span className="gradient-text">Jann Carl</span>
              </h2>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 20 }}>
                A BSIT student at Holy Angel University passionate about full-stack development.
                I build structured, efficient systems and explore new technologies —
                from RESTful APIs to full-stack deployments.
              </p>
              <Link className="btn btn-primary" href="/about">Read More About Me →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="cta-title">
        <div className="container">
          <div className="svc-cta reveal">
            <h2 className="svc-cta-title" id="cta-title">Have something in mind?</h2>
            <p className="svc-cta-desc">Tell me what you&apos;re building and I&apos;ll tell you honestly whether I&apos;m the right fit — and what I&apos;d have to learn first if I&apos;m not.</p>
            <div className="svc-cta-actions">
              <Link className="btn btn-primary" href="/contact">Get in touch →</Link>
              <Link className="btn btn-outline" href="/projects">See what I&apos;ve built</Link>
            </div>
          </div>
        </div>
      </section>
    </HomeReveal>
  );
}
