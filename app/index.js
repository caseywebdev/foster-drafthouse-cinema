import { render } from 'vidore';

import Root from '#app/components/root.js';

const { document } = globalThis;

render(<Root />, document.getElementById('root'));
