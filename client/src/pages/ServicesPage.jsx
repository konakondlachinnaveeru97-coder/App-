import { useContent } from '../ContentContext.jsx';
import PageHero from './PageHero.jsx';
import Services from '../sections/Services.jsx';
import Process from '../sections/Process.jsx';
import CTA from '../sections/CTA.jsx';

export default function ServicesPage() {
  const { services } = useContent().content;
  return (
    <>
      <PageHero title={services.title} subtitle={services.subtitle} />
      <Services />
      <Process />
      <CTA />
    </>
  );
}
