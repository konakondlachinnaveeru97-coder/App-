import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer>
      <Logo />
      <p>Authentic bakes, made close to home.</p>
      <span>© {new Date().getFullYear()} Sandhya Bakery</span>
    </footer>
  );
}
