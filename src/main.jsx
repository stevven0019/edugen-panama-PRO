import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Progressive Web App Service Worker only in production
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('EduGen PWA Service Worker registered with scope: ', registration.scope);
        })
        .catch(err => {
          console.error('EduGen PWA Service Worker registration failed: ', err);
        });
    });
  } else {
    // In local development, unregister any service worker to avoid stale blank caching
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
}
