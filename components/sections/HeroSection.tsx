import Image from 'next/image';
import { BLUR_DATA_URL } from '@/lib/blur';

/** The site's signature visual device and identity anchor — preserved in
 *  content and composition from the previous multi-page Home hero. Only
 *  the CTA targets changed (route hrefs → in-page anchors). */
export function HeroSection() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero-layout">
          <div className="hero-lead">
            <p className="hero-kicker">
              <span className="status-dot" aria-hidden="true"></span>
              Open to internships &amp; freelance work
            </p>
            <h1 className="hero-name" id="hero-heading">
              Jann Carl Dungo
              <span className="hero-role">Full-Stack Developer</span>
            </h1>
            <p className="hero-support">BSIT — Web Development · Holy Angel University</p>
            <p className="hero-desc">
              I design and build <strong>structured full-stack systems</strong> — from
              database architecture and backend APIs to responsive, production-ready
              interfaces. I&apos;m continuously learning, refining my craft, and looking
              to collaborate on meaningful projects.
            </p>

            <div className="hero-cta">
              <a className="btn btn-primary" href="#projects">View My Work →</a>
              <a className="btn btn-outline" href="#contact">Let&apos;s Connect</a>
              <a className="hero-resume" href="/resume.pdf" download="JannCarlDungo_Resume.pdf">
                Résumé (PDF)
              </a>
            </div>

            <p className="hero-stack">React · Node.js · Laravel · SQL</p>
          </div>

          <div className="hero-media" aria-hidden="true">
            <figure className="hero-portrait">
              <Image
                src="/images/profile.jpg"
                alt=""
                width={400}
                height={400}
                quality={90}
                priority
                sizes="(max-width: 768px) 168px, (max-width: 1024px) 220px, 320px"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            </figure>

            <div className="hero-code-card">
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
    </section>
  );
}
