import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Initialize Google AdSense and AMP Auto Ads if key is set
const adClient = import.meta.env.VITE_ADSENSE_CLIENT;
if (adClient && adClient !== "ca-pub-XXXXXXXXXXXXXXX" && adClient.trim() !== "") {
  // 1. Standard Auto Ads
  const script = document.createElement('script');
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + adClient;
  script.async = true;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);

  // 2. AMP Auto Ads
  const ampScript = document.createElement('script');
  ampScript.src = "https://cdn.ampproject.org/v0/amp-ad-0.1.js";
  ampScript.async = true;
  ampScript.setAttribute("custom-element", "amp-ad");
  document.head.appendChild(ampScript);

  // Append <amp-auto-ads> to body
  const appendAmpAutoAds = () => {
    const ampAutoAds = document.createElement('amp-auto-ads');
    ampAutoAds.setAttribute('type', 'adsense');
    ampAutoAds.setAttribute('data-ad-client', adClient);
    document.body.appendChild(ampAutoAds);
  };
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', appendAmpAutoAds);
  } else {
    appendAmpAutoAds();
  }
}

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
