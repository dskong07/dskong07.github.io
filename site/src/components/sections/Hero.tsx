import { currentRoles, profile } from '../../content';

export function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="shell hero-inner">
        <p className="mono hero-kicker" data-hero-item>
          {profile.name} — {profile.location}
        </p>

        <h1 className="hero-title">
          {profile.headline.map((line) => (
            <span className="hero-line" key={line}>
              <span data-hero-line>{line}</span>
            </span>
          ))}
        </h1>

        <p className="hero-stand" data-hero-item>
          {profile.standfirst}
        </p>

        <ul className="hero-now" data-hero-item>
          {currentRoles.map((role) => (
            <li key={role.id}>
              <span className="tag" data-track={role.track}>
                now
              </span>
              <span>
                {role.title}, <strong>{role.org}</strong>
              </span>
            </li>
          ))}
        </ul>

        <a className="mono hero-cue" href="#identity" data-hero-item>
          <span>Scroll</span>
          <span className="hero-cue-line" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
