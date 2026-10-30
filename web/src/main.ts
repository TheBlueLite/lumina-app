import { loadLuminaEngine } from './services/wasmLoader';
import { LuminaSimulator } from './components/Simulator';

// Registrar Service Worker PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => console.log('[Lúmina PWA] Service Worker activo:', reg.scope))
      .catch((err) => console.error('[Lúmina PWA] Error SW:', err));
  });
}

// Cargar la UI del simulador
window.addEventListener('DOMContentLoaded', () => {
  // Asegúrate de tener un <div id="app"></div> en tu index.html
  new LuminaSimulator('app');
});