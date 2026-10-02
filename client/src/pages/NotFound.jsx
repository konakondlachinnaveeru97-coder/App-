import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="inner-page">
      <div className="empty-cart">
        <span><Icon name="search" size={38} /></span>
        <h2>This page wandered off</h2>
        <p>Let’s get you back to something delicious.</p>
        <button className="primary" onClick={() => navigate('/')}>Back to home <Icon name="arrow" /></button>
      </div>
    </main>
  );
}
