import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../config/colors';
import {
  CATEGORIES,
  SORT_OPTIONS,
  STORAGE_KEYS,
  SEARCH_MIN_LENGTH,
  SEARCH_ALPHANUMERIC_REGEX,
} from '../config/constants';
import {
  getNowPlayingMovies,
  getPopularMovies,
  getUpcomingMovies,
} from '../redux/actions/movieActions';
import { applySorting } from '../helper/sortHelper';
import MovieCard from '../components/MovieCard';
import Dropdown from '../components/Dropdown';

const ITEMS_PER_PAGE = 5;

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  // Redux state
  const nowPlayingMovies = useSelector((state) => state.movies.nowPlayingMovies);
  const popularMovies = useSelector((state) => state.movies.popularMovies);
  const upcomingMovies = useSelector((state) => state.movies.upcomingMovies);

  // Local state
  const [selectedCategory, setSelectedCategory] = useState('now_playing');
  const [selectedSort, setSelectedSort] = useState('alphabetical');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);

  // Load persisted values from AsyncStorage
  useEffect(() => {
    loadPersistedValues();
  }, []);

  // Fetch movies when category changes
  const fetchMovies = useCallback(() => {
    const page = 1;
    switch (selectedCategory) {
      case 'now_playing':
        dispatch(getNowPlayingMovies(page));
        break;
      case 'popular':
        dispatch(getPopularMovies(page));
        break;
      case 'upcoming':
        dispatch(getUpcomingMovies(page));
        break;
      default:
        dispatch(getNowPlayingMovies(page));
    }
    setSearchActive(false);
    setActiveSearchQuery('');
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [selectedCategory, dispatch]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Apply sorting and filtering when movies or sort/search changes
  const applyFiltersAndSorting = useCallback(() => {
    let movies = getCurrentMovies();

    // Apply search filter if search is active
    if (searchActive && activeSearchQuery) {
      movies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(activeSearchQuery.toLowerCase())
      );
    }

    // Apply sorting
    movies = applySorting(movies, selectedSort);

    setFilteredMovies(movies);
  }, [selectedCategory, selectedSort, searchActive, activeSearchQuery, nowPlayingMovies.data, popularMovies.data, upcomingMovies.data]);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [applyFiltersAndSorting]);

  const loadPersistedValues = async () => {
    try {
      const category = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORY);
      const sortBy = await AsyncStorage.getItem(STORAGE_KEYS.SORT_BY);

      if (category) setSelectedCategory(category);
      if (sortBy) setSelectedSort(sortBy);
    } catch (error) {
      console.error('Error loading persisted values:', error);
    }
  };

  const saveCategory = async (category) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORY, category);
      setSelectedCategory(category);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const saveSortBy = async (sortBy) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SORT_BY, sortBy);
      setSelectedSort(sortBy);
    } catch (error) {
      console.error('Error saving sort by:', error);
    }
  };

  const getCurrentMovies = () => {
    switch (selectedCategory) {
      case 'now_playing':
        return nowPlayingMovies.data?.results || [];
      case 'popular':
        return popularMovies.data?.results || [];
      case 'upcoming':
        return upcomingMovies.data?.results || [];
      default:
        return [];
    }
  };

  const getCurrentLoading = () => {
    switch (selectedCategory) {
      case 'now_playing':
        return nowPlayingMovies.loading;
      case 'popular':
        return popularMovies.loading;
      case 'upcoming':
        return upcomingMovies.loading;
      default:
        return false;
    }
  };

  // TODO: FUTURE ENHANCEMENT
  // Possibly for future enhancement, to validate search input length before enabling search
  const isSearchValid = () => {
    return (
      searchQuery.length >= SEARCH_MIN_LENGTH &&
      SEARCH_ALPHANUMERIC_REGEX.test(searchQuery)
    );
  };

  const handleSearchChange = (text) => {
    // Only allow alphanumeric characters
    if (SEARCH_ALPHANUMERIC_REGEX.test(text) || text === '') {
      setSearchQuery(text);
    }
  };

  const handleSearchPress = () => {
    // if (isSearchValid()) {
    setActiveSearchQuery(searchQuery);
    setSearchActive(true);
    setDisplayedCount(ITEMS_PER_PAGE);
    // }
  };

  const handleMoviePress = (movie) => {
    navigation.navigate('Details', { movieId: movie.id, movieTitle: movie.title });
  };

  const handleLoadMore = () => {
    setDisplayedCount((prevCount) => prevCount + ITEMS_PER_PAGE);
  };

  const isLoading = getCurrentLoading();
  const displayedMovies = filteredMovies.slice(0, displayedCount);
  const hasMoreItems = displayedCount < filteredMovies.length;

  return (
    <View style={styles.container}>
      {/* Dropdowns and Search */}
      <View style={styles.controlsContainer}>
        <Dropdown
          label="Category"
          selectedValue={selectedCategory}
          onValueChange={saveCategory}
          items={CATEGORIES}
        />

        <Dropdown
          label="Sort By"
          selectedValue={selectedSort}
          onValueChange={saveSortBy}
          items={SORT_OPTIONS}
        />

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Only alpahanumeric characters allowed"
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholderTextColor={colors.textGray}
          />
          {/* {searchQuery.length > 0 && searchQuery.length < SEARCH_MIN_LENGTH && (
            <Text style={styles.searchHint}>
              Enter at least {SEARCH_MIN_LENGTH} characters
            </Text>
          )} */}
        </View>

        {/* Search Button */}
        <TouchableOpacity
          style={[
            styles.searchButton,
            // !isSearchValid() && styles.searchButtonDisabled,
          ]}
          onPress={handleSearchPress}
        // disabled={!isSearchValid()}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Movies List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading movies...</Text>
        </View>
      ) : (
        <FlatList
          data={displayedMovies}
          renderItem={({ item }) => (
            <MovieCard movie={item} onPress={handleMoviePress} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No movies found</Text>
            </View>
          }
          ListFooterComponent={
            hasMoreItems ? (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={handleLoadMore}
              >
                <Text style={styles.loadMoreText}>LOAD MORE</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  controlsContainer: {
    backgroundColor: colors.white,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    marginTop: 8,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: colors.white,
    color: '#000000',
  },
  searchHint: {
    fontSize: 12,
    color: colors.textGray,
    marginTop: 4,
    marginLeft: 4,
  },
  searchButton: {
    height: 50,
    backgroundColor: '#00B4E4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  searchButtonDisabled: {
    backgroundColor: '#B0B0B0',
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textGray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textGray,
  },
  loadMoreButton: {
    height: 50,
    backgroundColor: '#00B4E4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  loadMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
