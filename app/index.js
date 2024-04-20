import Root from '#app/components/root.js';
import tbd from '#app/tbd/index.js';

const { document } = globalThis;

tbd.render(<Root />, document.getElementById('root'));
