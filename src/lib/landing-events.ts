export function openLoginModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('landing:open-login'));
  }
}

export function openSignupModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('landing:open-signup'));
  }
}

export function onLoginModal(cb: () => void) {
  window.addEventListener('landing:open-login', cb);
  return () => window.removeEventListener('landing:open-login', cb);
}

export function onSignupModal(cb: () => void) {
  window.addEventListener('landing:open-signup', cb);
  return () => window.removeEventListener('landing:open-signup', cb);
}
