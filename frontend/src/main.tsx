import App from 'app/App';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from 'app/providers/router';

const bootFactTimer = Reflect.get(window, '__cpuzBootFactTimer');
if (typeof bootFactTimer === 'number') window.clearInterval(bootFactTimer);
Reflect.deleteProperty(window, '__cpuzBootFactTimer');

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <AppRouter app={App} />
  </StrictMode>
);
