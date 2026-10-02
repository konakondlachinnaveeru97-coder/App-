import { useContent } from '../ContentContext.jsx';
import SectionHeader from '../components/SectionHeader.jsx';

export default function Process() {
  const { process } = useContent().content;
  return (
    <section className="section section-muted">
      <div className="container">
        <SectionHeader title={process.title} />
        <ol className="steps">
          {process.steps.map((step, i) => (
            <li key={step.title} className="step">
              <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
