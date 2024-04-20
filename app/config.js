import movies from '#app/constants/movies.js';
import createId from '#app/functions/create-id.js';

const { localStorage } = globalThis;

let userId = localStorage.userId;
if (!userId) userId = localStorage.userId = createId();

// main, october, december
const currentGroup = 'main';

export default {
  movies: movies.filter(({ groups }) => groups.includes(currentGroup)),
  userId
};
