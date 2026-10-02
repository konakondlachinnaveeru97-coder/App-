import { Link } from 'react-router-dom';
import { useContent } from '../ContentContext.jsx';
import Icon from '../components/Icon.jsx';

export default function Hero() {
  const { hero } = useContent().content;
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>{hero.title}</h1>
          <p className="lead">{hero.subtitle}</p>
          <div className="hero-actions">
            <Link to={hero.primaryCta.to} className="btn btn-primary btn-lg">
              {hero.primaryCta.label} <Icon name="arrow" size={18} />
            </Link>
            <Link to={hero.secondaryCta.to} className="btn btn-ghost btn-lg">{hero.secondaryCta.label}</Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="blob blob-a" />
          <div className="blob blob-b" />
          <div className="mock-card">
            <div className="mock-bar"><span /><span /><span /></div>
            <div className="mock-line w-70" />
            <div className="mock-line w-50" />
            <div className="mock-chart">
              {[40, 65, 50, 80, 60, 95, 75].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
