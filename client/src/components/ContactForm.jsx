import { useState } from 'react';
import { sendMessage } from '../api.js';

const empty = { name: '', email: '', subject: '', message: '' };

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = 'Name is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = 'A valid email is required';
  if (v.message.trim().length < 10) errors.message = 'Message must be at least 10 characters';
  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const update = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus({ type: 'loading', message: '' });
    try {
      await sendMessage(values);
      setValues(empty);
      setStatus({ type: 'success', message: 'Thanks! Your message has been sent.' });
    } catch (err) {
      setErrors(err.errors || {});
      setStatus({ type: 'error', message: err.message });
    }
  }

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={`contact-${name}`}>{label}</label>
      {props.as === 'textarea' ? (
        <textarea id={`contact-${name}`} name={name} rows={5} value={values[name]} onChange={update}
          aria-invalid={!!errors[name]} />
      ) : (
        <input id={`contact-${name}`} name={name} type={props.type || 'text'} value={values[name]} onChange={update}
          aria-invalid={!!errors[name]} />
      )}
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <form className="card contact-form" onSubmit={onSubmit} noValidate>
      <div className="field-row">
        {field('name', 'Full name')}
        {field('email', 'Email', { type: 'email' })}
      </div>
      {field('subject', 'Subject (optional)')}
      {field('message', 'Message', { as: 'textarea' })}
      <button className="btn btn-primary btn-block" disabled={status.type === 'loading'}>
        {status.type === 'loading' ? 'Sending…' : 'Send message'}
      </button>
      {status.message && <p className={`form-note ${status.type}`} role="status">{status.message}</p>}
    </form>
  );
}
