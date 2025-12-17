export const sortByAlphabetical = (movies) => {
  if (!movies || movies.length === 0) return [];

  return [...movies].sort((a, b) => {
    const titleA = (a.title || '').toLowerCase();
    const titleB = (b.title || '').toLowerCase();
    return titleA.localeCompare(titleB);
  });
};

export const sortByRating = (movies) => {
  if (!movies || movies.length === 0) return [];

  return [...movies].sort((a, b) => {
    const ratingA = a.vote_average || 0;
    const ratingB = b.vote_average || 0;
    return ratingB - ratingA; // Descending order
  });
};

export const sortByReleaseDate = (movies) => {
  if (!movies || movies.length === 0) return [];

  return [...movies].sort((a, b) => {
    const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
    const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
    return dateB - dateA; // Descending order (newest first)
  });
};

export const applySorting = (movies, sortType) => {
  switch (sortType) {
    case 'alphabetical':
      return sortByAlphabetical(movies);
    case 'rating':
      return sortByRating(movies);
    case 'release_date':
      return sortByReleaseDate(movies);
    default:
      return movies;
  }
};
