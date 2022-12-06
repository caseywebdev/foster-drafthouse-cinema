import { createRoot } from 'react-dom/client';

import Root from 'app/components/root.js';

const { document } = globalThis;

const rootEl = document.getElementById('root');
const reactRoot = createRoot(rootEl);

reactRoot.render(<Root />);
