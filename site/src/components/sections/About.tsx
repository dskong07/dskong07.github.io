import { profile } from '../../content';

export function About() {
  return (
    <section className="about section" id="about">
      <div className="shell about-inner">
        <p className="mono section-label">Background</p>
        <div className="about-grid">
          <figure className="about-figure reveal">
            <img
              alt="Daniel Kong"
              className="about-photo"
              decoding="async"
              loading="lazy"
              src="/img/profile.webp"
            />
            <figcaption className="mono muted">{profile.location}</figcaption>
          </figure>
          <div className="about-copy">
            {profile.about.map((paragraph) => (
              <p className="about-paragraph reveal" key={paragraph.slice(0, 24)}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
