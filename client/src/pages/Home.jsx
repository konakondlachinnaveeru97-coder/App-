import Hero from '../sections/Hero.jsx';
import Stats from '../sections/Stats.jsx';
import Services from '../sections/Services.jsx';
import Process from '../sections/Process.jsx';
import About from '../sections/About.jsx';
import Testimonials from '../sections/Testimonials.jsx';
import CTA from '../sections/CTA.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Services limit={3} />
      <Process />
      <About />
      <Testimonials />
      <CTA />
    </>
  );
}
