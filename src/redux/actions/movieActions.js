import ApiManager from '../../services/ApiManager';
import API_CONFIG from '../../config/api';
import * as types from '../types/movieTypes';

export const getNowPlayingMovies = (page = 1) => {
  return async (dispatch) => {
    dispatch({ type: types.GET_NOW_PLAYING_MOVIES });

    try {
      const endpoint = `${API_CONFIG.domain}${API_CONFIG.endpoints.movies.nowPlaying}`;
      const data = await ApiManager.get(endpoint, { page });

      dispatch({
        type: types.GET_NOW_PLAYING_MOVIES_SUCCESS,
        payload: data,
      });

      return data;
    } catch (error) {
      dispatch({
        type: types.GET_NOW_PLAYING_MOVIES_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const getPopularMovies = (page = 1) => {
  return async (dispatch) => {
    dispatch({ type: types.GET_POPULAR_MOVIES });

    try {
      const endpoint = `${API_CONFIG.domain}${API_CONFIG.endpoints.movies.popular}`;
      const data = await ApiManager.get(endpoint, { page });

      dispatch({
        type: types.GET_POPULAR_MOVIES_SUCCESS,
        payload: data,
      });

      return data;
    } catch (error) {
      dispatch({
        type: types.GET_POPULAR_MOVIES_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};


export const getUpcomingMovies = (page = 1) => {
  return async (dispatch) => {
    dispatch({ type: types.GET_UPCOMING_MOVIES });

    try {
      const endpoint = `${API_CONFIG.domain}${API_CONFIG.endpoints.movies.upcoming}`;
      const data = await ApiManager.get(endpoint, { page });

      dispatch({
        type: types.GET_UPCOMING_MOVIES_SUCCESS,
        payload: data,
      });

      return data;
    } catch (error) {
      dispatch({
        type: types.GET_UPCOMING_MOVIES_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};


export const getMovieDetails = (movieId) => {
  return async (dispatch) => {
    dispatch({ type: types.GET_MOVIE_DETAILS });

    try {
      const endpointPath = API_CONFIG.endpoints.movies.details.replace('{movie_id}', movieId);
      const endpoint = `${API_CONFIG.domain}${endpointPath}`;
      const data = await ApiManager.get(endpoint);

      dispatch({
        type: types.GET_MOVIE_DETAILS_SUCCESS,
        payload: data,
      });

      return data;
    } catch (error) {
      dispatch({
        type: types.GET_MOVIE_DETAILS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};


export const getMovieCredits = (movieId) => {
  return async (dispatch) => {
    dispatch({ type: types.GET_MOVIE_CREDITS });

    try {
      const endpointPath = API_CONFIG.endpoints.movies.credits.replace('{movie_id}', movieId);
      const endpoint = `${API_CONFIG.domain}${endpointPath}`;
      const data = await ApiManager.get(endpoint);

      dispatch({
        type: types.GET_MOVIE_CREDITS_SUCCESS,
        payload: data,
      });

      return data;
    } catch (error) {
      dispatch({
        type: types.GET_MOVIE_CREDITS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};


export const getMovieRecommendations = (movieId, page = 1) => {
  return async (dispatch) => {
    dispatch({ type: types.GET_MOVIE_RECOMMENDATIONS });

    try {
      const endpointPath = API_CONFIG.endpoints.movies.recommendations.replace('{movie_id}', movieId);
      const endpoint = `${API_CONFIG.domain}${endpointPath}`;
      const data = await ApiManager.get(endpoint, { page });

      dispatch({
        type: types.GET_MOVIE_RECOMMENDATIONS_SUCCESS,
        payload: data,
      });

      return data;
    } catch (error) {
      dispatch({
        type: types.GET_MOVIE_RECOMMENDATIONS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};


export const getAccountDetails = (accountId) => {
  return async (dispatch) => {
    dispatch({ type: types.GET_ACCOUNT_DETAILS });

    try {
      const endpointPath = API_CONFIG.endpoints.account.details.replace('{account_id}', accountId);
      const endpoint = `${API_CONFIG.domain}${endpointPath}`;
      const data = await ApiManager.get(endpoint);

      dispatch({
        type: types.GET_ACCOUNT_DETAILS_SUCCESS,
        payload: data,
      });

      return data;
    } catch (error) {
      dispatch({
        type: types.GET_ACCOUNT_DETAILS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

/**
 * Add or Remove from Watchlist
 */
export const addToWatchlist = (accountId, movieId, shouldAddToWatchlist = true) => {
  return async (dispatch) => {
    dispatch({ type: types.ADD_TO_WATCHLIST });

    try {
      const endpointPath = API_CONFIG.endpoints.account.watchlist.replace('{account_id}', accountId);
      const endpoint = `${API_CONFIG.domain}${endpointPath}`;

      const body = {
        media_type: 'movie',
        media_id: movieId,
        watchlist: shouldAddToWatchlist,
      };

      const data = await ApiManager.post(endpoint, body);

      dispatch({
        type: types.ADD_TO_WATCHLIST_SUCCESS,
        payload: data,
      });

      return data;
    } catch (error) {
      dispatch({
        type: types.ADD_TO_WATCHLIST_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

/**
 * Get Watchlist Movies
 */
export const getWatchlist = (accountId, page = 1) => {
  return async (dispatch) => {
    dispatch({ type: types.GET_WATCHLIST });

    try {
      const endpointPath = API_CONFIG.endpoints.account.getWatchlistMovies.replace('{account_id}', accountId);
      const endpoint = `${API_CONFIG.domain}${endpointPath}`;
      const data = await ApiManager.get(endpoint, { page });

      dispatch({
        type: types.GET_WATCHLIST_SUCCESS,
        payload: data,
      });

      return data;
    } catch (error) {
      dispatch({
        type: types.GET_WATCHLIST_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

export const clearErrors = () => ({
  type: types.CLEAR_ERRORS,
});
