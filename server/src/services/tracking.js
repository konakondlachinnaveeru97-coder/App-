// Delivery progress is derived from the time since the order was placed.
// Offsets are in minutes after the order was created.
export const STAGES = [
  { key: 'confirmed', title: 'Order confirmed', at: 0, headline: 'Your order is confirmed' },
  { key: 'baking', title: 'In the oven', at: 7, headline: 'Your order is being baked' },
  { key: 'packed', title: 'Packed with care', at: 20, headline: 'Your order is packed' },
  { key: 'out', title: 'Out for delivery', at: 25, headline: 'Your order is on its way' },
];
export const DELIVERY_MINUTES = 37;

const MINUTE = 60 * 1000;

export function getTracking(createdAt, now = new Date()) {
  const start = new Date(createdAt).getTime();
  const elapsed = (now.getTime() - start) / MINUTE;
  const eta = new Date(start + DELIVERY_MINUTES * MINUTE);
  const delivered = elapsed >= DELIVERY_MINUTES;

  let currentIndex = 0;
  STAGES.forEach((s, i) => {
    if (elapsed >= s.at) currentIndex = i;
  });

  return {
    stage: delivered ? 'delivered' : STAGES[currentIndex].key,
    headline: delivered ? 'Your order has arrived' : STAGES[currentIndex].headline,
    delivered,
    eta: eta.toISOString(),
    minutesAway: delivered ? 0 : Math.max(1, Math.ceil(DELIVERY_MINUTES - elapsed)),
    steps: STAGES.map((s, i) => ({
      key: s.key,
      title: s.title,
      done: delivered || i <= currentIndex,
      next: !delivered && i === currentIndex + 1,
      time: new Date(start + s.at * MINUTE).toISOString(),
    })),
  };
}
