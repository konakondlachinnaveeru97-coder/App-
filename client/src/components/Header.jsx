import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../ShopContext.jsx';
import { scrollToId } from '../scroll.js';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';

export default function Header() {
  const { count } = useShop();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const goToMenu = () => {
    if (pathname === '/') scrollToId('menu');
    else navigate('/#menu');
  };

  return (
    <header>
      <Logo />
      <nav aria-label="Main navigation">
        <NavLink to="/" end>Home</NavLink>
        <button type="button" onClick={goToMenu}>Menu</button>
        <NavLink to="/track">Track order</NavLink>
      </nav>
      <div className="header-actions">
        <span className="delivery"><span /> Delivering in <strong>25–30 min</strong></span>
        <NavLink to="/cart" className="cart-button" aria-label={`Cart with ${count} item${count === 1 ? '' : 's'}`}>
          <Icon name="bag" />
          {count > 0 && <span>{count}</span>}
        </NavLink>
      </div>
    </header>
  );
}
