import * as types from '../types/movieTypes';

const initialState = {
  // Now Playing Movies
  nowPlayingMovies: {
    data: null,
    loading: false,
    error: null,
  },

  // Popular Movies
  popularMovies: {
    data: null,
    loading: false,
    error: null,
  },

  // Upcoming Movies
  upcomingMovies: {
    data: null,
    loading: false,
    error: null,
  },

  // Movie Details
  movieDetails: {
    data: null,
    loading: false,
    error: null,
  },

  // Movie Credits
  movieCredits: {
    data: null,
    loading: false,
    error: null,
  },

  // Movie Recommendations
  movieRecommendations: {
    data: null,
    loading: false,
    error: null,
  },

  // Account Details
  accountDetails: {
    data: null,
    loading: false,
    error: null,
  },

  // Watchlist
  watchlist: {
    data: null,
    loading: false,
    error: null,
  },

  addToWatchlist: {
    loading: false,
    error: null,
    success: false,
  },
};

const movieReducer = (state = initialState, action) => {
  switch (action.type) {
    // Now Playing Movies
    case types.GET_NOW_PLAYING_MOVIES:
      return {
        ...state,
        nowPlayingMovies: {
          ...state.nowPlayingMovies,
          loading: true,
          error: null,
        },
      };

    case types.GET_NOW_PLAYING_MOVIES_SUCCESS:
      const currentNowPlayingResults = state.nowPlayingMovies.data?.results || [];
      const newNowPlayingResults = action.payload?.results || [];

      // If page is 1, replace data; otherwise append results
      const isNowPlayingFirstPage = action.payload?.page === 1;

      return {
        ...state,
        nowPlayingMovies: {
          data: {
            ...action.payload,
            results: isNowPlayingFirstPage
              ? newNowPlayingResults
              : [...currentNowPlayingResults, ...newNowPlayingResults],
          },
          loading: false,
          error: null,
        },
      };

    case types.GET_NOW_PLAYING_MOVIES_FAILURE:
      return {
        ...state,
        nowPlayingMovies: {
          ...state.nowPlayingMovies,
          loading: false,
          error: action.payload,
        },
      };

    // Popular Movies
    case types.GET_POPULAR_MOVIES:
      return {
        ...state,
        popularMovies: {
          ...state.popularMovies,
          loading: true,
          error: null,
        },
      };

    case types.GET_POPULAR_MOVIES_SUCCESS:
      const currentPopularResults = state.popularMovies.data?.results || [];
      const newPopularResults = action.payload?.results || [];

      // If page is 1, replace data; otherwise append results
      const isPopularFirstPage = action.payload?.page === 1;

      return {
        ...state,
        popularMovies: {
          data: {
            ...action.payload,
            results: isPopularFirstPage
              ? newPopularResults
              : [...currentPopularResults, ...newPopularResults],
          },
          loading: false,
          error: null,
        },
      };

    case types.GET_POPULAR_MOVIES_FAILURE:
      return {
        ...state,
        popularMovies: {
          ...state.popularMovies,
          loading: false,
          error: action.payload,
        },
      };

    // Upcoming Movies
    case types.GET_UPCOMING_MOVIES:
      return {
        ...state,
        upcomingMovies: {
          ...state.upcomingMovies,
          loading: true,
          error: null,
        },
      };

    case types.GET_UPCOMING_MOVIES_SUCCESS:
      const currentUpcomingResults = state.upcomingMovies.data?.results || [];
      const newUpcomingResults = action.payload?.results || [];

      // If page is 1, replace data; otherwise append results
      const isUpcomingFirstPage = action.payload?.page === 1;

      return {
        ...state,
        upcomingMovies: {
          data: {
            ...action.payload,
            results: isUpcomingFirstPage
              ? newUpcomingResults
              : [...currentUpcomingResults, ...newUpcomingResults],
          },
          loading: false,
          error: null,
        },
      };

    case types.GET_UPCOMING_MOVIES_FAILURE:
      return {
        ...state,
        upcomingMovies: {
          ...state.upcomingMovies,
          loading: false,
          error: action.payload,
        },
      };

    // Movie Details
    case types.GET_MOVIE_DETAILS:
      return {
        ...state,
        movieDetails: {
          ...state.movieDetails,
          loading: true,
          error: null,
        },
      };

    case types.GET_MOVIE_DETAILS_SUCCESS:
      return {
        ...state,
        movieDetails: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };

    case types.GET_MOVIE_DETAILS_FAILURE:
      return {
        ...state,
        movieDetails: {
          ...state.movieDetails,
          loading: false,
          error: action.payload,
        },
      };

    // Movie Credits
    case types.GET_MOVIE_CREDITS:
      return {
        ...state,
        movieCredits: {
          ...state.movieCredits,
          loading: true,
          error: null,
        },
      };

    case types.GET_MOVIE_CREDITS_SUCCESS:
      return {
        ...state,
        movieCredits: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };

    case types.GET_MOVIE_CREDITS_FAILURE:
      return {
        ...state,
        movieCredits: {
          ...state.movieCredits,
          loading: false,
          error: action.payload,
        },
      };

    // Movie Recommendations
    case types.GET_MOVIE_RECOMMENDATIONS:
      return {
        ...state,
        movieRecommendations: {
          ...state.movieRecommendations,
          loading: true,
          error: null,
        },
      };

    case types.GET_MOVIE_RECOMMENDATIONS_SUCCESS:
      return {
        ...state,
        movieRecommendations: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };

    case types.GET_MOVIE_RECOMMENDATIONS_FAILURE:
      return {
        ...state,
        movieRecommendations: {
          ...state.movieRecommendations,
          loading: false,
          error: action.payload,
        },
      };

    // Account Details
    case types.GET_ACCOUNT_DETAILS:
      return {
        ...state,
        accountDetails: {
          ...state.accountDetails,
          loading: true,
          error: null,
        },
      };

    case types.GET_ACCOUNT_DETAILS_SUCCESS:
      return {
        ...state,
        accountDetails: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };

    case types.GET_ACCOUNT_DETAILS_FAILURE:
      return {
        ...state,
        accountDetails: {
          ...state.accountDetails,
          loading: false,
          error: action.payload,
        },
      };

    // Add to Watchlist
    case types.ADD_TO_WATCHLIST:
      return {
        ...state,
        addToWatchlist: {
          loading: true,
          error: null,
          success: false,
        },
      };

    case types.ADD_TO_WATCHLIST_SUCCESS:
      return {
        ...state,
        addToWatchlist: {
          loading: false,
          error: null,
          success: true,
        },
      };

    case types.ADD_TO_WATCHLIST_FAILURE:
      return {
        ...state,
        addToWatchlist: {
          loading: false,
          error: action.payload,
          success: false,
        },
      };

    // Get Watchlist
    case types.GET_WATCHLIST:
      return {
        ...state,
        watchlist: {
          ...state.watchlist,
          loading: true,
          error: null,
        },
      };

    case types.GET_WATCHLIST_SUCCESS:
      return {
        ...state,
        watchlist: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };

    case types.GET_WATCHLIST_FAILURE:
      return {
        ...state,
        watchlist: {
          ...state.watchlist,
          loading: false,
          error: action.payload,
        },
      };

    // Clear Errors
    case types.CLEAR_ERRORS:
      return {
        ...state,
        nowPlayingMovies: { ...state.nowPlayingMovies, error: null },
        popularMovies: { ...state.popularMovies, error: null },
        upcomingMovies: { ...state.upcomingMovies, error: null },
        movieDetails: { ...state.movieDetails, error: null },
        movieCredits: { ...state.movieCredits, error: null },
        movieRecommendations: { ...state.movieRecommendations, error: null },
        accountDetails: { ...state.accountDetails, error: null },
        watchlist: { ...state.watchlist, error: null },
        addToWatchlist: { ...state.addToWatchlist, error: null },
      };

    default:
      return state;
  }
};

export default movieReducer;
