import { Link } from 'react-router-dom';
import { projects } from '../../content';

export function Work() {
  return (
    <section className="work section" id="work">
      <div className="shell">
        <p className="mono section-label">Selected work</p>

        <div className="track-head">
          <h2 className="section-title">Five things worth reading about.</h2>
          <p className="lede">
            Two shipped products, one utility-facing capstone, and two data projects that still get
            reused — including for the field behind this page.
          </p>
        </div>

        <ul className="work-list">
          {projects.map((project) => (
            <li className="work-item reveal" key={project.slug}>
              <Link className="work-link" to={`/projects/${project.slug}`}>
                <div className="work-media">
                  {project.cover ? (
                    <img
                      alt={project.cover.alt}
                      className="work-image"
                      decoding="async"
                      loading="lazy"
                      src={project.cover.src}
                    />
                  ) : (
                    <span className="work-media-empty mono">
                      {project.track === 'swe' ? 'proprietary' : 'no capture'}
                    </span>
                  )}
                </div>

                <div className="work-body">
                  <div className="work-meta">
                    <span className="tag" data-track={project.track}>
                      {project.track === 'ds' ? 'Data' : 'Engineering'}
                    </span>
                    <span className="mono muted">{project.dateLabel}</span>
                  </div>

                  <h3 className="work-title">{project.title}</h3>
                  <p className="work-tagline muted">{project.tagline}</p>

                  <ul className="work-highlights">
                    {project.highlights.map((highlight) => (
                      <li key={highlight.label}>
                        <span className="work-highlight-value">{highlight.value}</span>
                        <span className="mono muted">{highlight.label}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="mono work-cta">
                    Read case study <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
