import { useState } from 'react';
import { profile } from '../../content';

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the mailto link next to this still works.
    }
  };

  return (
    <section className="contact section" id="contact">
      <div className="shell">
        <p className="mono section-label">Contact</p>

        <div className="contact-grid">
          <div>
            <h2 className="contact-title">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </h2>
            <p className="lede contact-note">{profile.contactNote}</p>
            <button className="mono contact-copy" onClick={copyEmail} type="button">
              {copied ? 'Copied' : 'Copy address'}
            </button>
          </div>

          <ul className="contact-links">
            <li>
              <a className="contact-link" href={`tel:${profile.phoneHref}`}>
                <span className="mono muted">Phone</span>
                <span>{profile.phone}</span>
              </a>
            </li>
            {profile.links
              .filter((link) => !link.href.startsWith('mailto:'))
              .map((link) => (
                <li key={link.href}>
                  <a
                    className="contact-link"
                    href={link.href}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    <span className="mono muted">{link.label}</span>
                    <span>{link.href.replace('https://', '')}</span>
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
