import { createRoot } from 'endr';

import Root from '#app/components/root.js';

const { document } = globalThis;

createRoot(document.getElementById('root')).render(<Root />);
