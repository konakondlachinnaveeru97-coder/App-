export function scrollToId(id) {
  // Wait a frame so the element exists after a route change.
  requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }));
}
