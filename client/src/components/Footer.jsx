import { Link } from 'react-router-dom';
import { useContent } from '../ContentContext.jsx';
import NewsletterForm from './NewsletterForm.jsx';

export default function Footer() {
  const { content } = useContent();
  const { brand, footer } = content;

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="logo logo-light">
            <span className="logo-mark" aria-hidden="true" />
            {brand.name}
          </Link>
          <p className="footer-about">{footer.about}</p>
        </div>
        {footer.columns.map((col) => (
          <div key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div className="footer-newsletter">
          <h4>{footer.newsletter.title}</h4>
          <p>{footer.newsletter.subtitle}</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} {brand.name}. All rights reserved.
      </div>
    </footer>
  );
}
