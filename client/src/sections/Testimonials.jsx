import { useContent } from '../ContentContext.jsx';
import Icon from '../components/Icon.jsx';
import SectionHeader from '../components/SectionHeader.jsx';

export default function Testimonials() {
  const { testimonials } = useContent().content;
  return (
    <section className="section section-muted">
      <div className="container">
        <SectionHeader title={testimonials.title} />
        <div className="card-grid cols-3">
          {testimonials.items.map((t) => (
            <figure key={t.name} className="card testimonial">
              <Icon name="quote" className="quote-icon" />
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <span className="avatar" aria-hidden="true">{t.name.split(' ').map((n) => n[0]).join('')}</span>
                <span><strong>{t.name}</strong><small>{t.role}</small></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
