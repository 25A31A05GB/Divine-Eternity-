import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initSentry } from './lib/monitoring';
import { initAnalytics } from './lib/analytics';

// Initialize optional telemetry if keys exist and consent is present
initSentry();
initAnalytics();

createRoot(document.getElementById('root')!).render(<App />);
