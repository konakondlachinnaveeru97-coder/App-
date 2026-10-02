import { useContent } from '../ContentContext.jsx';
import PageHero from './PageHero.jsx';
import ContactForm from '../components/ContactForm.jsx';
import Icon from '../components/Icon.jsx';

export default function ContactPage() {
  const { contact } = useContent().content;
  return (
    <>
      <PageHero title={contact.title} subtitle={contact.subtitle} />
      <section className="section">
        <div className="container contact-grid">
          <ul className="contact-info">
            <li><span className="icon-badge"><Icon name="mail" /></span><div><strong>Email</strong><a href={`mailto:${contact.email}`}>{contact.email}</a></div></li>
            <li><span className="icon-badge"><Icon name="call" /></span><div><strong>Phone</strong><a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>{contact.phone}</a></div></li>
            <li><span className="icon-badge"><Icon name="pin" /></span><div><strong>Office</strong><span>{contact.address}</span></div></li>
          </ul>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
