import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectBySlug, projects } from '../content';
import { useReveal } from '../lib/useReveal';
import { NotFound } from './NotFound';

export function ProjectPage() {
  const { slug = '' } = useParams();
  const project = projectBySlug(slug);
  useReveal(slug);

  useEffect(() => {
    if (!project) return;
    const previous = document.title;
    document.title = `${project.title} — Daniel Kong`;
    return () => {
      document.title = previous;
    };
  }, [project]);

  if (!project) return <NotFound />;

  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="detail">
      <header className="detail-head shell">
        <Link className="mono link-underline detail-back" to="/">
          <span aria-hidden="true">←</span> Index
        </Link>

        <div className="detail-head-meta">
          <span className="tag" data-track={project.track}>
            {project.track === 'ds' ? 'Data' : 'Engineering'}
          </span>
          <span className="mono muted">{project.category}</span>
        </div>

        <h1 className="detail-title">{project.title}</h1>
        <p className="lede detail-tagline">{project.tagline}</p>

        <ul className="detail-highlights">
          {project.highlights.map((highlight) => (
            <li key={highlight.label}>
              <span className="detail-highlight-value">{highlight.value}</span>
              <span className="mono muted">{highlight.label}</span>
            </li>
          ))}
        </ul>
      </header>

      <div className="shell detail-body">
        <div className="detail-prose">
          {project.sections.map((section) => (
            <section className="detail-section reveal" key={section.heading}>
              <h2 className="detail-heading">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </section>
          ))}

          {project.images.length > 0 && (
            <div className="detail-gallery">
              {project.images.map((image) => (
                <figure className="detail-figure reveal" key={image.src}>
                  <img alt={image.alt} decoding="async" loading="lazy" src={image.src} />
                  {image.caption && (
                    <figcaption className="mono muted">{image.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>

        <aside className="detail-aside">
          <dl className="detail-facts">
            <div>
              <dt className="mono muted">When</dt>
              <dd>{project.dateLabel}</dd>
            </div>
            <div>
              <dt className="mono muted">Role</dt>
              <dd>{project.role}</dd>
            </div>
            {project.partners && (
              <div>
                <dt className="mono muted">Partners</dt>
                <dd>{project.partners.join(', ')}</dd>
              </div>
            )}
            {project.team && (
              <div>
                <dt className="mono muted">Team</dt>
                <dd>{project.team.join(', ')}</dd>
              </div>
            )}
            <div>
              <dt className="mono muted">Stack</dt>
              <dd>
                <ul className="chip-row">
                  {project.stack.map((item) => (
                    <li className="tag" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          {project.links.length > 0 && (
            <ul className="detail-links">
              {project.links.map((link) => (
                <li key={link.href}>
                  <a
                    className="link-underline"
                    href={link.href}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      <nav className="detail-next shell" aria-label="Next project">
        <Link className="detail-next-link" to={`/projects/${next.slug}`}>
          <span className="mono muted">Next</span>
          <span className="detail-next-title">{next.title}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </nav>
    </article>
  );
}
