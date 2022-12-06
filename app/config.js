import movies from 'app/constants/movies.js';
import createId from 'app/functions/create-id.js';

const { localStorage } = globalThis;

let userId = localStorage.userId;
if (!userId) userId = localStorage.userId = createId();

const currentGroup = 'december';

export default {
  movies: movies.filter(({ groups }) => groups.includes(currentGroup)),
  userId
};
