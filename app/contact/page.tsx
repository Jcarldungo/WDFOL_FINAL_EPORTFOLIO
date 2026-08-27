import { siteInfo } from '@/lib/content';
import { ContactForm } from '@/components/ContactForm';

export const metadata = {
  title: 'Contact | Jann Carl Dungo',
  description: 'Get in touch with Jann Carl Dungo for internships, freelance full-stack work, or collaborations.',
};

export default function Contact() {
  return (
    <section className="section section--page-top" aria-labelledby="contact-heading">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-label">Get In Touch</div>
          <h1 className="section-title" id="contact-heading">Let&apos;s <span className="gradient-text">Connect</span></h1>
          <p className="section-subtitle">Open to internship opportunities, freelance full-stack projects, and academic collaborations.</p>
        </div>

        <div className="contact-grid">
          <div className="reveal-left">
            <div className="contact-info">
              <h3>Say Hello</h3>
              <p>Whether you&apos;re looking for a full-stack developer intern, want to collaborate on a project, or just want to connect — feel free to reach out!</p>

              <div className="contact-detail">
                <div><div className="contact-detail-label">Phone</div><a href={siteInfo.phoneHref} className="contact-detail-val">{siteInfo.phone}</a></div>
              </div>
              <div className="contact-detail">
                <div><div className="contact-detail-label">Email</div><a href={`mailto:${siteInfo.email}`} className="contact-detail-val">{siteInfo.email}</a></div>
              </div>
              <div className="contact-detail">
                <div><div className="contact-detail-label">Location</div><div className="contact-detail-val">{siteInfo.location}</div></div>
              </div>
              <div className="contact-detail">
                <div><div className="contact-detail-label">University</div><div className="contact-detail-val">{siteInfo.university}</div></div>
              </div>
              <div className="contact-detail">
                <div><div className="contact-detail-label">Status</div><div className="contact-detail-val" style={{ color: 'var(--green)' }}>● Open to opportunities</div></div>
              </div>
              <div className="contact-detail">
                <div><div className="contact-detail-label">Response Time</div><div className="contact-detail-val">I typically reply within <strong>24–48 hours</strong>.</div></div>
              </div>

              <div className="social-links" aria-label="Social media links">
                <a href={siteInfo.github} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub" title="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                </a>
                <a href={`mailto:${siteInfo.email}`} className="social-link" aria-label="Email" title="Email">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </a>
                <a href={siteInfo.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn" title="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="reveal-right">
            <div className="contact-form">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
