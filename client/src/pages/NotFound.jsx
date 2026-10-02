import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page-hero not-found">
      <div className="container">
        <h1>404</h1>
        <p className="lead">The page you’re looking for doesn’t exist.</p>
        <Link to="/" className="btn btn-primary">Back home</Link>
      </div>
    </section>
  );
}
