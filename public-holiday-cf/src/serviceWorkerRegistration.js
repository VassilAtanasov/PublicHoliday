// Simple service worker registration and lifecycle handling
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch((err) => {
        // ignore registration errors
        console.warn('SW registration failed', err)
      })
    })
  }
}
