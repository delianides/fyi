import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import FourOhFour from './404.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FourOhFour />
  </StrictMode>,
);
