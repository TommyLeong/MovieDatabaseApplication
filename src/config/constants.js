// Category dropdown values
export const CATEGORIES = [
  { label: 'Now Playing', value: 'now_playing' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Popular', value: 'popular' },
];

// Sort by dropdown values
export const SORT_OPTIONS = [
  { label: 'By alphabetical order', value: 'alphabetical' },
  { label: 'By rating', value: 'rating' },
  { label: 'By release date', value: 'release_date' },
];

// !REQUIRED! YOUR ACCOUNT_ID! 
// Temporary hardcoded account ID
export const ACCOUNT_ID = 'useYOURaccountIDfromTMDBhere';

// Watchlist filter options
export const WATCHLIST_FILTERS = [
  { label: 'Alphabetical', value: 'alphabetical' },
  { label: 'Rating', value: 'rating' },
  { label: 'Release Date', value: 'release_date' },
];

// Local storage keys
export const STORAGE_KEYS = {
  CATEGORY: 'movie_app_category',
  SORT_BY: 'movie_app_sort_by',
};

// Search validation
export const SEARCH_MIN_LENGTH = 5;
export const SEARCH_ALPHANUMERIC_REGEX = /^[a-zA-Z0-9\s]*$/;
