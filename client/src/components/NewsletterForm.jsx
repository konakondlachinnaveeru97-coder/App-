import { useState } from 'react';
import { subscribe } from '../api.js';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: 'loading', message: '' });
    try {
      await subscribe(email);
      setEmail('');
      setStatus({ type: 'success', message: 'Thanks for subscribing!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.errors?.email || err.message });
    }
  }

  return (
    <form className="newsletter" onSubmit={onSubmit} noValidate>
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button className="btn btn-primary" disabled={status.type === 'loading'}>
        {status.type === 'loading' ? 'Sending…' : 'Subscribe'}
      </button>
      {status.message && (
        <p className={`form-note ${status.type}`} role="status">{status.message}</p>
      )}
    </form>
  );
}
