import AsyncStorage from '@react-native-async-storage/async-storage';

const WATCHLIST_KEY = 'movie_app_watchlist';

export const getWatchlist = async () => {
  try {
    const watchlistJson = await AsyncStorage.getItem(WATCHLIST_KEY);
    if (watchlistJson) {
      return JSON.parse(watchlistJson);
    }
    return [];
  } catch (error) {
    console.error('Error getting watchlist from storage:', error);
    return [];
  }
};

export const addToWatchlist = async (movie) => {
  try {
    const watchlist = await getWatchlist();

    // Check if movie already exists
    const exists = watchlist.some(item => item.id === movie.id);
    if (exists) {
      return false;
    }

    // Add movie with timestamp
    const movieWithTimestamp = {
      ...movie,
      addedAt: new Date().toISOString(),
    };

    watchlist.push(movieWithTimestamp);
    await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    return true;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return false;
  }
};

export const removeFromWatchlist = async (movieId) => {
  try {
    const watchlist = await getWatchlist();
    const updatedWatchlist = watchlist.filter(item => item.id !== movieId);
    await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));
    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
};

export const isInWatchlist = async (movieId) => {
  try {
    const watchlist = await getWatchlist();
    return watchlist.some(item => item.id === movieId);
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
};
