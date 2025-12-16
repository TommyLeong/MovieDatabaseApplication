import { TMDB_BASE_URL } from '@env';

const API_CONFIG = {
  // Base domain for TMDB API
  domain: TMDB_BASE_URL || 'https://api.themoviedb.org/3',

  // API endpoints
  endpoints: {
    // Movie endpoints
    movies: {
      nowPlaying: '/movie/now_playing',
      popular: '/movie/popular',
      upcoming: '/movie/upcoming',
      details: '/movie/{movie_id}',
      credits: '/movie/{movie_id}/credits',
      recommendations: '/movie/{movie_id}/recommendations',
    },

    // Account endpoints
    account: {
      details: '/account/{account_id}',
    },
  },
};

export default API_CONFIG;
