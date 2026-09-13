import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
// Self-hosted so first paint never waits on a third-party font connection.
// Upright weights only; the italic axis is never used.
import '@fontsource-variable/inter-tight/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import './styles/global.css';
import './styles/sections.css';

const container = document.getElementById('root');
if (!container) throw new Error('#root missing');

createRoot(container).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
