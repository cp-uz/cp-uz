import { Link } from 'react-router';

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" to="/" aria-label="cp.uz bosh sahifa">
      <img
        className="brand__image"
        src="/assets/brand/cpuz-logo.png"
        width={40}
        height={40}
        alt=""
        aria-hidden="true"
      />
      {!compact && <span className="brand__word">cp uz;</span>}
    </Link>
  );
}
