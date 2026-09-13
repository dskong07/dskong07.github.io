import { Link } from 'react-router-dom';
import { projectBySlug, roles } from '../../content';

const sweRoles = roles.filter((role) => role.track === 'swe');

/** Maps the two current engineering roles onto their case-study pages. */
const caseStudyFor: Record<string, string> = {
  ledger: 'ledger',
  civicom: 'welcomeware-emr',
};

export function TrackSWE() {
  return (
    <section className="track track-swe section" id="track-swe">
      <div className="shell">
        <p className="mono section-label" style={{ color: 'var(--accent)' }}>
          Track 02 — Software engineering
        </p>

        <div className="track-head">
          <h2 className="section-title">Then it has to be something people can use.</h2>
          <p className="lede">
            Two production systems in parallel: HIPAA-constrained healthcare integrations by day, a
            personal finance platform I co-founded the rest of the time.
          </p>
        </div>

        <div className="product-grid">
          {sweRoles.map((role) => {
            const slug = caseStudyFor[role.id];
            const project = slug ? projectBySlug(slug) : undefined;

            return (
              <article className="product-card reveal" key={role.id}>
                <header className="product-card-head">
                  <p className="mono muted">
                    {role.start} — {role.end}
                  </p>
                  <h3 className="product-title">
                    {role.org}
                    {role.orgNote && <span className="product-note"> {role.orgNote}</span>}
                  </h3>
                  <p className="mono muted">{role.title}</p>
                </header>

                <p className="product-summary">{role.summary}</p>

                {role.metric && (
                  <p className="product-metric">
                    <span className="product-metric-value">{role.metric.value}</span>
                    <span className="mono muted">{role.metric.label}</span>
                  </p>
                )}

                <ul className="product-points">
                  {role.points.slice(0, 3).map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <ul className="chip-row">
                  {role.stack.map((item) => (
                    <li className="tag" data-track="swe" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>

                {project && (
                  <Link className="link-underline mono product-link" to={`/projects/${slug}`}>
                    Case study
                    <span aria-hidden="true">↗</span>
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
