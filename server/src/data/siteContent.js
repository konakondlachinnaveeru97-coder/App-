// All website copy lives here (and in MongoDB once seeded with `npm run seed`).
// PLACEHOLDER CONTENT: replace with the text from the Figma design.
const siteContent = {
  brand: {
    name: 'Brightside',
    tagline: 'Digital products, thoughtfully built.',
  },
  nav: [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],
  hero: {
    eyebrow: 'Design · Build · Grow',
    title: 'We turn bold ideas into products people love',
    subtitle:
      'A small, senior team helping startups and growing businesses design, launch, and scale modern web experiences.',
    primaryCta: { label: 'Start a project', to: '/contact' },
    secondaryCta: { label: 'Explore services', to: '/services' },
  },
  stats: [
    { value: '120+', label: 'Projects shipped' },
    { value: '98%', label: 'Client satisfaction' },
    { value: '12', label: 'Years of experience' },
    { value: '24/7', label: 'Support' },
  ],
  services: {
    title: 'What we do',
    subtitle: 'End-to-end services that take you from first sketch to a product in market.',
    items: [
      { icon: 'pen', title: 'Product Design', description: 'Research, UX flows, and pixel-perfect interfaces grounded in real user needs.' },
      { icon: 'code', title: 'Web Development', description: 'Fast, accessible, and scalable applications built on a modern JavaScript stack.' },
      { icon: 'phone', title: 'Mobile Apps', description: 'Responsive experiences that feel native on every screen size.' },
      { icon: 'chart', title: 'Growth & Analytics', description: 'Measure what matters and iterate with confidence using clear data.' },
      { icon: 'cloud', title: 'Cloud & DevOps', description: 'Reliable deployments, monitoring, and infrastructure that scales with you.' },
      { icon: 'support', title: 'Ongoing Support', description: 'A dedicated team that keeps your product healthy long after launch.' },
    ],
  },
  process: {
    title: 'How we work',
    steps: [
      { title: 'Discover', description: 'We learn your goals, users, and constraints.' },
      { title: 'Design', description: 'We prototype and validate the experience.' },
      { title: 'Develop', description: 'We build in short, transparent iterations.' },
      { title: 'Deliver', description: 'We launch, measure, and keep improving.' },
    ],
  },
  about: {
    title: 'A team that cares about the details',
    paragraphs: [
      'We started Brightside with a simple belief: great products come from close collaboration between design and engineering.',
      'Today we partner with founders and product teams around the world, bringing the same curiosity and craft to every project.',
    ],
    highlights: ['Senior designers and engineers', 'Transparent weekly updates', 'Accessible by default', 'Built to scale'],
  },
  testimonials: {
    title: 'What our clients say',
    items: [
      { quote: 'They understood our vision immediately and shipped faster than we thought possible.', name: 'Alex Morgan', role: 'Founder, Northwind' },
      { quote: 'The attention to detail in both design and code is outstanding.', name: 'Priya Shah', role: 'Head of Product, Lumen' },
      { quote: 'A true partner. Our conversion rate doubled after the redesign.', name: 'Daniel Kim', role: 'CEO, Parcel' },
    ],
  },
  cta: {
    title: 'Ready to build something great?',
    subtitle: 'Tell us about your project and we will get back to you within one business day.',
    button: { label: 'Get in touch', to: '/contact' },
  },
  contact: {
    title: 'Let’s talk',
    subtitle: 'Fill in the form and our team will reach out shortly.',
    email: 'hello@example.com',
    phone: '+1 (555) 010-2030',
    address: '123 Market Street, San Francisco, CA',
  },
  footer: {
    about: 'Digital products, thoughtfully built.',
    columns: [
      { title: 'Company', links: [{ label: 'About', to: '/about' }, { label: 'Services', to: '/services' }, { label: 'Contact', to: '/contact' }] },
      { title: 'Resources', links: [{ label: 'Blog', to: '/' }, { label: 'Case studies', to: '/' }, { label: 'FAQ', to: '/' }] },
    ],
    newsletter: { title: 'Stay in the loop', subtitle: 'Product news and insights, once a month.' },
  },
};

export default siteContent;
