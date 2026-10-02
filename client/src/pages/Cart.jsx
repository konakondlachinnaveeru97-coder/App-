import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../api.js';
import { LAST_ORDER_KEY, useShop } from '../ShopContext.jsx';
import { save } from '../storage.js';
import Icon from '../components/Icon.jsx';

export default function Cart() {
  const { items, subtotal, tax, total, update, remove, clearCart, status } = useShop();
  const navigate = useNavigate();
  const [checkout, setCheckout] = useState({ busy: false, error: '' });

  async function onCheckout() {
    setCheckout({ busy: true, error: '' });
    try {
      const order = await placeOrder(items.map((i) => ({ productId: i.id, quantity: i.quantity })));
      save(LAST_ORDER_KEY, order.orderId);
      clearCart();
      navigate(`/track/${order.orderId}`, { state: { justPlaced: true } });
    } catch (err) {
      setCheckout({ busy: false, error: err.message });
    }
  }

  if (status === 'loading') {
    return <main className="inner-page"><p className="page-loading" role="status">Loading your cart…</p></main>;
  }

  return (
    <main className="inner-page">
      <div className="page-title">
        <span className="kicker">YOUR SELECTION</span>
        <h1>Your cart</h1>
        <p>{items.length ? 'Freshly baked and almost yours.' : 'Your next favourite bake is waiting.'}</p>
      </div>
      {items.length ? (
        <div className="cart-layout">
          <section className="cart-items" aria-label="Cart items">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="cart-info">
                  <span>{item.region}</span>
                  <h3>{item.name}</h3>
                  <p>Baked fresh{item.eggless ? ' • Eggless' : ''}</p>
                  <button className="remove" onClick={() => remove(item.id)}><Icon name="trash" size={16} /> Remove</button>
                </div>
                <div className="quantity">
                  <button onClick={() => update(item.id, -1)} aria-label={`Decrease ${item.name}`}><Icon name="minus" size={16} /></button>
                  <strong aria-label="Quantity">{item.quantity}</strong>
                  <button onClick={() => update(item.id, 1)} aria-label={`Increase ${item.name}`} disabled={item.quantity >= 50}><Icon name="plus" size={16} /></button>
                </div>
                <strong className="line-price">₹{item.price * item.quantity}</strong>
              </article>
            ))}
            <button className="continue" onClick={() => navigate('/')}><span>←</span> Continue shopping</button>
          </section>
          <aside className="summary">
            <h2>Order summary</h2>
            <div><span>Subtotal</span><strong>₹{subtotal}</strong></div>
            <div><span>Delivery fee</span><strong className="free">FREE</strong></div>
            <div><span>Taxes</span><strong>₹{tax}</strong></div>
            <hr />
            <div className="total"><span>Total</span><strong>₹{total}</strong></div>
            <button className="primary full" onClick={onCheckout} disabled={checkout.busy}>
              {checkout.busy ? 'Placing your order…' : <>Proceed to checkout <Icon name="arrow" /></>}
            </button>
            {checkout.error && <p className="form-error" role="alert">{checkout.error}</p>}
            <p className="secure"><Icon name="check" size={15} /> Secure checkout • Freshness guaranteed</p>
            <div className="eta"><Icon name="clock" /><span><small>Estimated delivery</small><strong>Today, 25–30 minutes</strong></span></div>
          </aside>
        </div>
      ) : (
        <div className="empty-cart">
          <span><Icon name="bag" size={38} /></span>
          <h2>Nothing in your basket yet</h2>
          <p>Explore authentic bakes from around the world.</p>
          <button className="primary" onClick={() => navigate('/#menu')}>Browse the menu <Icon name="arrow" /></button>
        </div>
      )}
    </main>
  );
}
