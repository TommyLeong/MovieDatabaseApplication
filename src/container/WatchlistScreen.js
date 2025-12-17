import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../config/colors';
import { ACCOUNT_ID, WATCHLIST_FILTERS } from '../config/constants';
import { getWatchlist, removeFromWatchlist } from '../services/WatchlistStorage';
import MovieCard from '../components/MovieCard';
import Dropdown from '../components/Dropdown';
import { applySorting } from '../helper/sortHelper';
import { getAccountDetails } from '../redux/actions/movieActions';

const WatchlistScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const accountDetails = useSelector((state) => state.movies.accountDetails);

  const [watchlist, setWatchlist] = useState([]);
  const [filteredWatchlist, setFilteredWatchlist] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('alphabetical');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getAccountDetails(ACCOUNT_ID));
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      loadWatchlist();
    }, [])
  );

  // Load watchlist from storage
  const loadWatchlist = async () => {
    setLoading(true);
    const savedWatchlist = await getWatchlist();
    setWatchlist(savedWatchlist);
    setLoading(false);
  };

  // Apply filtering and sorting when watchlist or filter/sort changes
  useEffect(() => {
    let sortedList = applySorting([...watchlist], selectedFilter);

    // Reverse if needed based on user's sort order preference
    if (selectedFilter === 'alphabetical' && sortOrder === 'desc') {
      sortedList = sortedList.reverse();
    } else if ((selectedFilter === 'rating' || selectedFilter === 'release_date') && sortOrder === 'asc') {
      sortedList = sortedList.reverse();
    }

    setFilteredWatchlist(sortedList);
  }, [watchlist, selectedFilter, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleMoviePress = (movie) => {
    navigation.navigate('HomeTab', {
      screen: 'Details',
      params: { movieId: movie.id, movieTitle: movie.title },
    });
  };

  const handleDeleteMovie = (movie) => {
    Alert.alert(
      'Remove from Watchlist',
      `Are you sure you want to remove "${movie.title}" from your watchlist?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeFromWatchlist(movie.id);
            loadWatchlist();
          },
        },
      ]
    );
  };

  const getUserInitial = () => {
    if (accountDetails.data?.username) {
      return accountDetails.data.username.charAt(0).toUpperCase();
    }

    // Return ? in case failed to get first character
    return '?';
  };

  const getJoinedDate = () => {
    // Can't find joined date info from API response.
    return 'Unknown';
  };

  const renderHeader = () => (
    <View>
      {/* User Profile Header */}
      <View style={styles.profileHeader}>
        {accountDetails.loading ? (
          <ActivityIndicator size="small" color={colors.white} style={styles.avatarContainer} />
        ) : (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getUserInitial()}</Text>
          </View>
        )}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {accountDetails.data?.username || 'Loading...'}
          </Text>
          <Text style={styles.profileJoined}>
            Member since {getJoinedDate()}
          </Text>
        </View>
      </View>

      {/* Watchlist Title */}
      <Text style={styles.watchlistTitle}>My Watchlist</Text>

      {/* Filter and Sort Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.filterContainer}>
          <Dropdown
            label={'Filter by:'}
            selectedValue={selectedFilter}
            onValueChange={setSelectedFilter}
            items={WATCHLIST_FILTERS}
            containerStyle={styles.dropdown}
          />
        </View>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={toggleSortOrder}
          activeOpacity={0.7}
        >
          <Text style={styles.sortLabel}>Order:</Text>
          <Text style={styles.sortIcon}>
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Your watchlist is empty</Text>
      <Text style={styles.emptySubtext}>
        Add movies to your watchlist from the details screen
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredWatchlist}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={handleMoviePress}
            showDeleteButton={true}
            onDelete={handleDeleteMovie}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading && renderEmptyState}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  profileHeader: {
    backgroundColor: '#003D5B',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileJoined: {
    color: '#B0BEC5',
    fontSize: 14,
  },
  watchlistTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  filterLabel: {
    fontSize: 14,
    color: colors.textGray,
    marginRight: 8,
  },
  dropdown: {
    flex: 1,
    maxWidth: 200,
    marginVertical: 0,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    marginLeft: 12,
    marginTop: 20
  },
  sortLabel: {
    fontSize: 14,
    color: colors.textGray,
    marginRight: 6,
  },
  sortIcon: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textGray,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textGray,
    textAlign: 'center',
  },
  dropdownContainer: {
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
  }
});

export default WatchlistScreen;
