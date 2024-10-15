import fs from 'node:fs/promises';

import { ESLint } from 'eslint';

import savedMovies from '#app/constants/movies.js';

const { console, fetch, process } = globalThis;

const apiKey = process.env.TMDB_API_KEY;

const movieApiUrl = 'https://api.themoviedb.org/3/movie';
const posterUrlBase = 'https://image.tmdb.org/t/p/original';

const movies = [];

for (let movie of savedMovies) {
  if (!movie.title) {
    console.log(`Fetching ${movie.id}...`);
    const res = await fetch(`${movieApiUrl}/${movie.id}?api_key=${apiKey}`);
    if (res.status !== 200) throw new Error(await res.text());

    const data = await res.json();
    if (!data.title) {
      throw new Error(`${JSON.stringify(data)} does not have a title value`);
    }

    console.log(`Fetched ${data.title}`);
    movie = {
      ...movie,
      posterUrl: posterUrlBase + data.poster_path,
      releaseDate: data.release_date,
      tagline: data.tagline,
      title: data.title,
      runtime: data.runtime
    };
  }

  movies.push(movie);
}

movies.sort((a, b) => (a.title <= b.title ? -1 : 1));

const eslint = new ESLint({ fix: true });

const [{ output }] = await eslint.lintText(
  `export default ${JSON.stringify(movies)};`,
  { filePath: 'app/constants/movie.js' }
);

await fs.writeFile('app/constants/movies.js', output);
