import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../ShopContext.jsx';
import { scrollToId } from '../scroll.js';
import Icon from '../components/Icon.jsx';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1536782896453-61d09f3aaf3e?auto=format&fit=crop&w=1600&q=85';
const FEATURED_COUNT = 4;

function ProductCard({ product }) {
  const { addToCart } = useShop();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return undefined;
    const t = setTimeout(() => setJustAdded(false), 1200);
    return () => clearTimeout(t);
  }, [justAdded]);

  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && <span className="badge">{product.badge}</span>}
        <span className="rating"><Icon name="star" size={13} /> {product.rating.toFixed(1)}</span>
      </div>
      <div className="product-content">
        <span className="region">{product.region}</span>
        <h3>{product.name}</h3>
        <div>
          <strong>₹{product.price}</strong>
          <button onClick={() => { addToCart(product.id); setJustAdded(true); }} aria-label={`Add ${product.name} to cart`}
            className={justAdded ? 'added' : ''}>
            <Icon name={justAdded ? 'check' : 'plus'} size={18} /> {justAdded ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  );
}

function Menu() {
  const { products, status, reloadProducts } = useShop();
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? products : products.slice(0, FEATURED_COUNT);

  return (
    <section className="menu-section" id="menu">
      <div className="section-heading">
        <div>
          <span className="kicker">PASSPORT TO FLAVOUR</span>
          <h2>Our global favourites</h2>
          <p>No visas needed. Just a good appetite.</p>
        </div>
        <button className="view-all" onClick={() => setShowAll((s) => !s)} aria-expanded={showAll}>
          {showAll && products.length > FEATURED_COUNT ? 'Show favourites' : 'View full menu'} <Icon name="arrow" size={18} />
        </button>
      </div>
      {status === 'error' ? (
        <div className="load-error">
          <p>We couldn’t load the menu right now.</p>
          <button className="primary" onClick={reloadProducts}>Try again</button>
        </div>
      ) : (
        <div className="product-grid" aria-busy={status === 'loading'}>
          {status === 'loading'
            ? Array.from({ length: FEATURED_COUNT }, (_, i) => <div className="product-card skeleton" key={i} />)
            : visible.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) scrollToId(hash.slice(1));
  }, [hash]);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Icon name="sparkle" size={16} /> Baked across borders, loved at home</div>
          <h1>A world of flavour,<br /><em>freshly baked.</em></h1>
          <p>Authentic recipes from the world’s most loved bakeries, handcrafted fresh every day in the heart of your city.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => scrollToId('menu')}>Explore the menu <Icon name="arrow" /></button>
            <button className="text-button" onClick={() => scrollToId('story')}>Our story</button>
          </div>
          <div className="trust-row">
            <span><strong>4.9</strong><span className="stars" aria-label="5 stars">★★★★★</span><small>2,400+ happy foodies</small></span>
            <i />
            <span><strong>14</strong><small>Countries on our menu</small></span>
            <i />
            <span><strong>100%</strong><small>Baked fresh daily</small></span>
          </div>
        </div>
        <div className="hero-visual">
          <img src={HERO_IMAGE} alt="Artisan breads and pastries in a bakery display" />
          <div className="floating-card top"><span className="flag">FR</span><span><small>From France</small><strong>Flaky, buttery perfection</strong></span></div>
          <div className="floating-card bottom"><span className="baker-avatar">SB</span><span><small>Made fresh</small><strong>By our artisan bakers</strong></span><span className="online" /></div>
        </div>
      </section>

      <Menu />

      <section className="story" id="story">
        <div><span className="kicker">WHY SANDHYA?</span><h2>Small batches.<br />Big journeys.</h2></div>
        <p>We collect recipes with a story, source ingredients with intention, and bake everything in small batches. The result is a little passport stamp in every bite.</p>
        <div className="story-points">
          <span><Icon name="check" />Authentic recipes</span>
          <span><Icon name="check" />No preservatives</span>
          <span><Icon name="check" />Delivered warm</span>
        </div>
        <button className="primary" onClick={() => navigate('/cart')}>Order your favourites <Icon name="arrow" /></button>
      </section>
    </main>
  );
}
