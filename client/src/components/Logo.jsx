import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Sandhya Bakery home">
      <span className="logo-mark">S</span>
      <span><strong>Sandhya</strong><small>WORLD BAKERY</small></span>
    </Link>
  );
}
