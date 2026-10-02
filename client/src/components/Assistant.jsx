import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { askAssistant } from '../api.js';
import { useShop } from '../ShopContext.jsx';
import Icon from './Icon.jsx';

const GREETING = {
  text: 'Hi! I’m Sia, your bakery guide. I can help you choose a bake, check allergens, or track an order. What are you craving today?',
};
const QUICK_REPLIES = ['What’s your bestseller?', 'Show me eggless options', 'Help me track my order'];

export default function Assistant() {
  const { assistantOpen: open, setAssistantOpen: setOpen, addToCart } = useShop();
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState({});
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy, open]);

  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  async function send(text) {
    const message = text.trim();
    if (!message || busy) return;
    setMessages((m) => [...m, { text: message, mine: true }]);
    setInput('');
    setBusy(true);
    try {
      const res = await askAssistant(message);
      setMessages((m) => [...m, { text: res.reply, suggestion: res.suggestion, action: res.action }]);
    } catch {
      setMessages((m) => [...m, { text: 'Sorry, I’m having trouble connecting right now. Please try again in a moment.' }]);
    } finally {
      setBusy(false);
    }
  }

  const add = (index, suggestion) => {
    addToCart(suggestion.id);
    setAdded((a) => ({ ...a, [index]: true }));
  };

  return (
    <>
      {open && (
        <aside className="assistant-panel" aria-label="Sia bakery assistant">
          <div className="assistant-head">
            <span className="ai-avatar"><Icon name="sparkle" /></span>
            <div><strong>Sia</strong><small><i /> Sandhya AI assistant</small></div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant"><Icon name="x" /></button>
          </div>
          <div className="chat-body" ref={bodyRef} aria-live="polite">
            {messages.map((m, i) => (
              <div key={i}>
                <div className={m.mine ? 'message mine' : 'message'}>{m.text}</div>
                {(m.suggestion || m.action) && (
                  <div className="message-actions">
                    {m.suggestion && (
                      <button className="suggest-add" onClick={() => add(i, m.suggestion)} disabled={added[i]}>
                        <Icon name={added[i] ? 'check' : 'plus'} size={16} />
                        {added[i] ? 'Added to cart' : `Add ${m.suggestion.name.split(' ').at(-1).toLowerCase()} to cart`}
                      </button>
                    )}
                    {m.action && (
                      <button className="suggest-add" onClick={() => { navigate(m.action.to); setOpen(false); }}>
                        {m.action.label} <Icon name="chevron" size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {messages.length === 1 && (
              <div className="quick-replies">
                {QUICK_REPLIES.map((q) => <button key={q} onClick={() => send(q)}>{q}</button>)}
              </div>
            )}
            {busy && <div className="message typing" aria-label="Sia is typing"><span /><span /><span /></div>}
          </div>
          <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <label htmlFor="assistant-input" className="sr-only">Message Sia</label>
            <input id="assistant-input" ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Sia anything..." maxLength={500} autoComplete="off" />
            <button type="submit" aria-label="Send message" disabled={busy || !input.trim()}><Icon name="send" size={18} /></button>
          </form>
        </aside>
      )}
      <button className="assistant-trigger" onClick={() => setOpen(!open)} aria-label={open ? 'Close AI assistant' : 'Open AI assistant'} aria-expanded={open}>
        <Icon name={open ? 'x' : 'chat'} />
        {!open && <span><strong>Need help?</strong><small>Ask Sia</small></span>}
      </button>
    </>
  );
}
