const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value) {
  return typeof value === 'string' && value.length <= 200 && EMAIL_RE.test(value.trim());
}
