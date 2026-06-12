import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Progressive Web App Service Worker for offline capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('EduGen PWA Service Worker registered with scope: ', registration.scope);
      })
      .catch(err => {
        console.error('EduGen PWA Service Worker registration failed: ', err);
      });
  });
}
