import { useContent } from '../ContentContext.jsx';
import Icon from '../components/Icon.jsx';
import SectionHeader from '../components/SectionHeader.jsx';

export default function Services({ limit }) {
  const { services } = useContent().content;
  const items = limit ? services.items.slice(0, limit) : services.items;
  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHeader title={services.title} subtitle={services.subtitle} />
        <div className="card-grid">
          {items.map((s) => (
            <article key={s.title} className="card feature-card">
              <span className="icon-badge"><Icon name={s.icon} /></span>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
