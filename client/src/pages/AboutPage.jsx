import { useContent } from '../ContentContext.jsx';
import PageHero from './PageHero.jsx';
import About from '../sections/About.jsx';
import Stats from '../sections/Stats.jsx';
import Testimonials from '../sections/Testimonials.jsx';
import CTA from '../sections/CTA.jsx';

export default function AboutPage() {
  const { brand } = useContent().content;
  return (
    <>
      <PageHero title={`About ${brand.name}`} subtitle={brand.tagline} />
      <About />
      <Stats />
      <Testimonials />
      <CTA />
    </>
  );
}
