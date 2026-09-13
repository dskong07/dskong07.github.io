import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { profile } from '../content';

const sections = [
  { id: 'track-ds', label: 'Data' },
  { id: 'track-swe', label: 'Engineering' },
  { id: 'timeline', label: 'History' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

export function Nav() {
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="nav" data-scrolled={scrolled} data-open={open}>
      <div className="nav-inner shell">
        <Link className="nav-mark" to="/" aria-label="Daniel Kong, home">
          <span className="nav-mark-name">{profile.name}</span>
          <span className="mono muted nav-mark-role">DS &amp; SWE</span>
        </Link>

        <nav className="nav-links" aria-label="Sections">
          {onHome ? (
            sections.map((section) => (
              <a className="mono nav-link" href={`#${section.id}`} key={section.id}>
                {section.label}
              </a>
            ))
          ) : (
            <Link className="mono nav-link" to="/">
              Index
            </Link>
          )}
          <a
            className="mono nav-link nav-link-cta"
            href={`mailto:${profile.email}`}
          >
            Email
          </a>
        </nav>

        <button
          className="nav-toggle mono"
          type="button"
          aria-expanded={open}
          aria-controls="nav-drawer"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      <div className="nav-drawer" id="nav-drawer" hidden={!open}>
        {(onHome ? sections : []).map((section) => (
          <a
            className="nav-drawer-link"
            href={`#${section.id}`}
            key={section.id}
            onClick={() => setOpen(false)}
          >
            {section.label}
          </a>
        ))}
        {!onHome && (
          <Link className="nav-drawer-link" to="/">
            Index
          </Link>
        )}
        {profile.links.map((link) => (
          <a className="nav-drawer-link" href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}
