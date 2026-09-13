import { profile } from '../../content';

const { ds, swe } = profile.tracks;

export function IdentitySplit() {
  return (
    <section className="identity" id="identity">
      <div className="identity-pin">
        <div className="shell identity-stage">
          <p className="mono identity-caption" data-identity-caption>
            One background, two tracks
          </p>

          <div className="identity-grid">
            <article className="identity-card" data-identity-card="ds">
              <p className="mono identity-kicker" style={{ color: 'var(--track-ds)' }}>
                {ds.kicker}
              </p>
              <h2 className="identity-title">{ds.label}</h2>
              <p className="identity-summary muted">{ds.summary}</p>
              <p className="mono muted">{ds.years}</p>
            </article>

            <span className="identity-divider" data-identity-divider aria-hidden="true" />

            <article className="identity-card" data-identity-card="swe">
              <p className="mono identity-kicker" style={{ color: 'var(--accent)' }}>
                {swe.kicker}
              </p>
              <h2 className="identity-title">{swe.label}</h2>
              <p className="identity-summary muted">{swe.summary}</p>
              <p className="mono muted">{swe.years}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
