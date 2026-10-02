import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getOrder } from '../api.js';
import { LAST_ORDER_KEY } from '../ShopContext.jsx';
import { load } from '../storage.js';
import Icon from '../components/Icon.jsx';

const REFRESH_MS = 30_000;
const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

function describeItems(items) {
  const names = items.map((i) => i.name);
  return names.length <= 2 ? names.join(' & ') : `${names.slice(0, 2).join(', ')} & ${names.length - 2} more`;
}

function OrderStatus({ order, justPlaced }) {
  const [showItems, setShowItems] = useState(false);
  const { tracking } = order;
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <section className="order-status" aria-live="polite">
      {justPlaced && <p className="order-placed"><Icon name="check" size={16} /> Order placed! Save your order ID: <strong>{order.orderId}</strong></p>}
      <div className="status-head">
        <div>
          <span>ORDER #{order.orderId}</span>
          <h2>{tracking.headline}</h2>
          <p>{tracking.delivered ? 'Delivered at ' : 'Estimated arrival '}<strong>{formatTime(tracking.eta)}</strong></p>
        </div>
        <span className="time-pill"><Icon name="clock" size={17} /> {tracking.delivered ? 'Delivered' : `${tracking.minutesAway} min away`}</span>
      </div>
      <ol className="timeline">
        {tracking.steps.map((step, index) => (
          <li className={step.done ? 'step done' : 'step'} key={step.key}>
            <span>{step.done ? <Icon name="check" size={17} /> : index + 1}</span>
            <div><strong>{step.title}</strong><small>{step.done ? formatTime(step.time) : step.next ? 'Up next' : 'Soon'}</small></div>
          </li>
        ))}
      </ol>
      <div className="order-mini">
        {order.items.slice(0, 2).map((i) => <img key={i.id} src={i.image} alt="" />)}
        <span><small>{itemCount} delicious item{itemCount === 1 ? '' : 's'}</small><strong>{describeItems(order.items)}</strong></span>
        <button onClick={() => setShowItems((s) => !s)} aria-expanded={showItems}>
          {showItems ? 'Hide order' : 'View order'} <Icon name="chevron" size={16} />
        </button>
      </div>
      {showItems && (
        <div className="order-items">
          {order.items.map((i) => (
            <div key={i.id}><span>{i.quantity} × {i.name}</span><strong>₹{i.price * i.quantity}</strong></div>
          ))}
          <div><span>Taxes</span><strong>₹{order.tax}</strong></div>
          <div className="order-total"><span>Total paid</span><strong>₹{order.total}</strong></div>
        </div>
      )}
    </section>
  );
}

export default function Tracking() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [input, setInput] = useState(orderId || '');
  const [result, setResult] = useState({ order: null, error: '', loading: false });

  // With no ID in the URL, show the customer's most recent order if there is one.
  useEffect(() => {
    if (!orderId) {
      const last = load(LAST_ORDER_KEY, null);
      if (last) navigate(`/track/${last}`, { replace: true });
    }
  }, [orderId, navigate]);

  useEffect(() => {
    setInput(orderId || '');
    if (!orderId) {
      setResult({ order: null, error: '', loading: false });
      return undefined;
    }
    let cancelled = false;
    const fetchOrder = (initial) => {
      if (initial) setResult({ order: null, error: '', loading: true });
      getOrder(orderId)
        .then((order) => !cancelled && setResult({ order, error: '', loading: false }))
        .catch((err) => !cancelled && setResult((r) => ({ order: initial ? null : r.order, error: initial ? err.message : r.error, loading: false })));
    };
    fetchOrder(true);
    const timer = setInterval(() => fetchOrder(false), REFRESH_MS);
    return () => { cancelled = true; clearInterval(timer); };
  }, [orderId]);

  const onSubmit = (e) => {
    e.preventDefault();
    const id = input.trim().toUpperCase();
    if (!id) {
      setResult({ order: null, error: 'Please enter your order ID.', loading: false });
      return;
    }
    if (id === orderId) return;
    navigate(`/track/${encodeURIComponent(id)}`);
  };

  return (
    <main className="tracking-page">
      <div className="page-title">
        <span className="kicker">FROM OUR OVEN TO YOUR DOOR</span>
        <h1>Track your order</h1>
        <p>Good things are on their way. Follow every delicious step.</p>
      </div>
      <form className="track-card" onSubmit={onSubmit}>
        <label htmlFor="order-id">Order ID</label>
        <div className="track-input">
          <Icon name="search" />
          <input id="order-id" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. SB240618" autoComplete="off" />
          <button type="submit">Track order</button>
        </div>
        <small>Find your order ID in your confirmation message.</small>
      </form>
      {result.loading && <p className="page-loading" role="status">Finding your order…</p>}
      {result.error && <p className="track-error" role="alert">{result.error}</p>}
      {result.order && <OrderStatus order={result.order} justPlaced={state?.justPlaced} />}
    </main>
  );
}
