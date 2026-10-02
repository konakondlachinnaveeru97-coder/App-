import { useContent } from '../ContentContext.jsx';
import Icon from '../components/Icon.jsx';

export default function About() {
  const { about } = useContent().content;
  return (
    <section className="section" id="about">
      <div className="container about-grid">
        <div className="about-visual" aria-hidden="true">
          <div className="about-tile t1" />
          <div className="about-tile t2" />
          <div className="about-tile t3" />
        </div>
        <div>
          <h2>{about.title}</h2>
          {about.paragraphs.map((p) => <p key={p} className="muted">{p}</p>)}
          <ul className="checklist">
            {about.highlights.map((h) => (
              <li key={h}><Icon name="check" size={18} /> {h}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
