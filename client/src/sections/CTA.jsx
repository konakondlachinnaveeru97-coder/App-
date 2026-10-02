import { Link } from 'react-router-dom';
import { useContent } from '../ContentContext.jsx';

export default function CTA() {
  const { cta } = useContent().content;
  return (
    <section className="section">
      <div className="container">
        <div className="cta">
          <h2>{cta.title}</h2>
          <p>{cta.subtitle}</p>
          <Link to={cta.button.to} className="btn btn-light btn-lg">{cta.button.label}</Link>
        </div>
      </div>
    </section>
  );
}
