import { Link } from 'react-router-dom';
import { roles } from '../../content';
import type { RetentionData } from '../../lib/assetLoader';

const dsRoles = roles.filter((role) => role.track === 'ds');
const integer = new Intl.NumberFormat('en-US');

interface TrackDSProps {
  data: RetentionData | null;
}

export function TrackDS({ data }: TrackDSProps) {
  const manifest = data?.manifest;
  const top = manifest?.top?.[0];

  return (
    <section className="track track-ds section" id="track-ds">
      <div className="shell">
        <p className="mono section-label" style={{ color: 'var(--track-ds)' }}>
          Track 01 — Data science &amp; machine learning
        </p>

        <div className="track-head">
          <h2 className="section-title">The data comes first, and it is rarely clean.</h2>
          <p className="lede">
            Geospatial and time-series work, computer vision, terabyte-scale ETL, and inference that
            has to survive someone asking &ldquo;so what do we do about it?&rdquo;
          </p>
        </div>

        <figure className="formation-readout" data-formation>
          <figcaption className="mono muted">
            What you are looking at — the field behind this text
          </figcaption>
          <dl className="readout-grid">
            <div>
              <dt className="mono muted">Points</dt>
              <dd>{manifest ? integer.format(manifest.count) : '—'}</dd>
            </div>
            <div>
              <dt className="mono muted">Regions</dt>
              <dd>{manifest ? manifest.regionsPlotted : '—'}</dd>
            </div>
            <div>
              <dt className="mono muted">Students retained</dt>
              <dd>{manifest?.totalRetained ? integer.format(manifest.totalRetained) : '—'}</dd>
            </div>
            <div>
              <dt className="mono muted">Highest count</dt>
              <dd>{top ? `${top.name}, ${integer.format(top.total)}` : '—'}</dd>
            </div>
          </dl>
          <p className="formation-note muted">
            Real NCES grade-retention counts, sampled inside Albers-projected state boundaries and
            coloured on a log scale. It is the same dataset behind my{' '}
            <Link className="link-underline" to="/projects/retention-map">
              interactive retention map
            </Link>
            , reused here as geometry.
          </p>
        </figure>

        <ol className="role-list">
          {dsRoles.map((role) => (
            <li className="role-card reveal" key={role.id}>
              <div className="role-card-head">
                <div>
                  <h3 className="role-title">{role.title}</h3>
                  <p className="role-org">
                    {role.org}
                    {role.orgNote ? ` (${role.orgNote})` : ''} — {role.location}
                  </p>
                </div>
                <p className="mono muted role-dates">
                  {role.start} — {role.end}
                </p>
              </div>

              <p className="role-summary">{role.summary}</p>

              {role.metric && (
                <p className="role-metric">
                  <span className="role-metric-value" style={{ color: 'var(--track-ds)' }}>
                    {role.metric.value}
                  </span>
                  <span className="mono muted">{role.metric.label}</span>
                </p>
              )}

              <ul className="role-points">
                {role.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              <ul className="chip-row">
                {role.stack.map((item) => (
                  <li className="tag" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
