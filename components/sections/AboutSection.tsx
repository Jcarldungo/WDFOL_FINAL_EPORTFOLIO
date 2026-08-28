import Image from 'next/image';
import { capabilities, softSkills, siteInfo } from '@/lib/content';
import { BLUR_DATA_URL } from '@/lib/blur';
import { IndexRow } from '@/components/IndexRow';

/** The merged identity section — the old Home "quick about" teaser and the
 *  About page's fuller bio collapsed into one, plus the "What I Build"
 *  capabilities list folded in here (per the master brief's own framing of
 *  About as covering "what I build, how I approach development"). */
export function AboutSection() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-label"><span className="c-comment">{'// '}</span>who i am</div>
          <h2 className="section-title" id="about-title">About <span className="gradient-text">Me</span></h2>
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
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="about-photo-real"
              />
            </div>
            <div className="about-logo-below">
              <Image src="/icons/logo.png" alt="JD Logo" width={40} height={40} className="about-logo-img" />
              <div>
                <div className="about-logo-handle">{siteInfo.handle}</div>
                <div className="about-logo-role">Full-Stack Developer</div>
              </div>
            </div>
          </div>

          <div className="reveal-right">
            <div className="about-bio">
              <p>Hi, I&apos;m <strong>Jann Carl Dungo</strong> — a 4th year BSIT student at <strong>Holy Angel University</strong>, majoring in Web Development, with a strong interest in full-stack development and building structured, efficient systems.</p>
              <p>I enjoy working on academic and personal projects that improve my programming and problem-solving skills. My core focus spans the full stack — backend technologies like Node.js, Express.js, PHP, JWT Authentication, and RESTful API design, paired with frontend frameworks like React, Vue.js, and Angular.</p>
              <p>Previously served as a <strong>Student Aide at the HAU University Library</strong> and the HAU Store. Based in Sapang Maisac, Mexico, Pampanga. Open to internships, freelance full-stack work, and collaborations.</p>
            </div>

            <div className="soft-skills-row">
              {softSkills.map((skill) => (
                <span key={skill} className="soft-skill">{skill}</span>
              ))}
            </div>

            <div className="about-capabilities">
              <h3 className="about-capabilities-label"><span className="c-comment">{'// '}</span>what i build</h3>
              <ol className="index-rows index-rows--tight" aria-label="Capabilities">
                {capabilities.map((cap, i) => (
                  <IndexRow
                    key={cap.num}
                    className={`reveal reveal-delay-${(i % 4) + 1}`}
                    num={cap.num}
                    title={cap.title}
                    titleAs="h4"
                    desc={cap.desc}
                  />
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
