// Sia, the bakery assistant. Rule-based so it works without any external AI
// service; replies are built from the live menu and order data.
import { findOrder, toPublicOrder } from './orders.js';

const ALLERGENS = {
  nut: 'nuts', nuts: 'nuts', pistachio: 'nuts',
  gluten: 'gluten', wheat: 'gluten',
  dairy: 'dairy', milk: 'dairy', lactose: 'dairy', butter: 'dairy',
};

const has = (text, words) => words.some((w) => text.includes(w));
const list = (names) => (names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`);
const suggest = (p) => (p ? { id: p.id, name: p.name } : null);

export async function respond(message, { products, dbReady }) {
  const text = message.toLowerCase();
  const bestseller = products.find((p) => p.badge === 'Bestseller') || products[0];

  // 1. Order lookup by ID, e.g. "where is SB240618?"
  const idMatch = message.match(/\bSB\d{6}\b/i);
  if (idMatch) {
    const orderId = idMatch[0].toUpperCase();
    if (!dbReady()) {
      return { reply: 'I can’t reach our order system right now. Please try again in a minute.', action: { label: 'Open order tracking', to: `/track/${orderId}` } };
    }
    const order = await findOrder(orderId);
    if (!order) {
      return { reply: `I couldn’t find order ${orderId}. Please check the ID in your confirmation message.`, action: { label: 'Open order tracking', to: '/track' } };
    }
    const { tracking } = toPublicOrder(order);
    const status = tracking.delivered
      ? `${tracking.headline}. Enjoy every bite!`
      : `${tracking.headline} and should arrive in about ${tracking.minutesAway} minutes.`;
    return { reply: `Order ${orderId}: ${status}`, action: { label: 'See live tracking', to: `/track/${orderId}` } };
  }

  // 2. Tracking help
  if (has(text, ['track', 'where is my', 'my order', 'order status'])) {
    return {
      reply: 'Happy to help! Share your order ID (it looks like SB240618) and I’ll check its status, or open the tracking page.',
      action: { label: 'Open order tracking', to: '/track' },
    };
  }

  // 3. Eggless
  if (has(text, ['egg', 'vegetarian']) || /\bveg\b/.test(text)) {
    const eggless = products.filter((p) => p.eggless);
    if (!eggless.length) return { reply: 'Right now none of our bakes are eggless, but we’re working on it!' };
    const pick = eggless.find((p) => p.allergens.includes('nuts')) || eggless[0];
    return {
      reply: `Absolutely. Our ${list(eggless.map((p) => p.name))} ${eggless.length > 1 ? 'are' : 'is'} available eggless. I’d recommend the ${pick.name.split(' ').at(-1)} if you like ${pick.allergens.includes('nuts') ? 'crisp, nutty desserts' : 'something soft and comforting'}.`,
      suggestion: suggest(pick),
    };
  }

  // 4. Allergens
  const allergenWord = Object.keys(ALLERGENS).find((w) => text.includes(w));
  if (allergenWord && has(text, ['allerg', 'free', 'without', 'avoid', 'contain', 'intoleran', 'no '])) {
    const allergen = ALLERGENS[allergenWord];
    const safe = products.filter((p) => !p.allergens.includes(allergen));
    return safe.length
      ? { reply: `These bakes are free from ${allergen}: ${list(safe.map((p) => p.name))}. Always let us know about severe allergies, as everything is made in a shared kitchen.`, suggestion: suggest(safe[0]) }
      : { reply: `Sorry, all of our current bakes contain ${allergen}. Everything is made in a shared kitchen.` };
  }
  if (has(text, ['allerg'])) {
    return { reply: products.map((p) => `${p.name}: ${p.allergens.join(', ') || 'none'}`).join('\n') };
  }

  // 5. Recommendations are handled by the default reply below.
  const wantsRecommendation = has(text, ['best', 'recommend', 'popular', 'special', 'suggest', 'favourite', 'favorite']);

  // 6. A specific product
  const named = products.find((p) => p.name.toLowerCase().split(' ').some((w) => w.length > 4 && text.includes(w)));
  if (named && !wantsRecommendation) {
    return {
      reply: `${named.name} from ${named.region} is ₹${named.price}. ${named.description} ${named.eggless ? 'It’s eggless, too.' : ''}`.trim(),
      suggestion: suggest(named),
    };
  }

  // 7. Menu and prices
  if (!wantsRecommendation && has(text, ['menu', 'price', 'cost', 'what do you have', 'options', 'sell'])) {
    return { reply: `Here’s what’s fresh today:\n${products.map((p) => `• ${p.name} (${p.region}): ₹${p.price}`).join('\n')}` };
  }

  // 8. Delivery
  if (has(text, ['deliver', 'how long', 'shipping', 'fee'])) {
    return { reply: 'We deliver warm, usually within 25–30 minutes, and delivery is free on every order.' };
  }

  // 9. Greeting
  if (/^(hi|hey|hello|namaste|good (morning|afternoon|evening))\b/.test(text)) {
    return { reply: 'Hello! What are you craving today? I can suggest a bake, check allergens, or track an order.' };
  }

  // 10. Recommendations, and anything else
  return {
    reply: `For something special, try our bestselling ${bestseller.name}. It’s ${bestseller.description.charAt(0).toLowerCase()}${bestseller.description.slice(1, -1)}. Shall I add one to your cart?`,
    suggestion: suggest(bestseller),
  };
}
