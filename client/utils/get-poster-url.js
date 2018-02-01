// "poster_sizes": ["w92", "w154", "w185", "w342", "w500", "w780", "original"],

const BASE_URL = `http://image.tmdb.org/t/p/original`;

export default ({poster_path: path}) => BASE_URL + path;
