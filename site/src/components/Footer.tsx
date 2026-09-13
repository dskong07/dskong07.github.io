import { profile } from '../content';

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <div>
          <p className="footer-name">{profile.name}</p>
          <p className="mono muted">{profile.location}</p>
        </div>
        <ul className="footer-links">
          {profile.links.map((link) => (
            <li key={link.href}>
              <a className="link-underline mono" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mono muted footer-note">
          Built from scratch: React, GSAP ScrollTrigger, Three.js. Point cloud from NCES retention
          data.
        </p>
      </div>
    </footer>
  );
}
