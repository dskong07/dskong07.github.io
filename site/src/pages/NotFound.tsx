import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section className="section shell detail-empty">
      <p className="mono section-label">404</p>
      <h1 className="section-title">That page does not exist.</h1>
      <p className="lede">
        Probably an old link from the previous version of this site.{' '}
        <Link className="link-underline" to="/">
          Start from the top
        </Link>
        .
      </p>
    </section>
  );
}
