import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../config/colors';
import { ACCOUNT_ID } from '../config/constants';
import {
  getMovieDetails,
  getMovieCredits,
  getMovieRecommendations,
  addToWatchlist,
} from '../redux/actions/movieActions';
import { SvgXml } from 'react-native-svg';
import svgs from '../config/svg';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const DetailsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { movieId } = route.params;

  const movieDetails = useSelector((state) => state.movies.movieDetails);
  const movieCredits = useSelector((state) => state.movies.movieCredits);
  const movieRecommendations = useSelector((state) => state.movies.movieRecommendations);
  const addToWatchlistState = useSelector((state) => state.movies.addToWatchlist);

  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    dispatch(getMovieDetails(movieId));
    dispatch(getMovieCredits(movieId));
    dispatch(getMovieRecommendations(movieId));
  }, [movieId, dispatch]);

  useEffect(() => {
    navigation.setOptions({
      title: route.params.movieTitle || 'Movie Details'
    });
  }, [navigation, route.params.movieTitle]);

  const movie = movieDetails.data;
  const credits = movieCredits.data;
  const recommendations = movieRecommendations.data;

  const handleWatchlistToggle = async () => {
    try {
      await dispatch(addToWatchlist(ACCOUNT_ID, movieId, !isInWatchlist));
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getDirectorAndWriters = () => {
    if (!credits || !credits.crew) return [];
    return credits.crew.filter(
      (person) => person.job === 'Director' || person.job === 'Writer'
    );
  };

  const renderCastMember = (cast) => (
    <View key={cast.id} style={styles.castCard}>
      <Image
        source={
          cast.profile_path
            ? { uri: `${TMDB_IMAGE_BASE_URL}${cast.profile_path}` }
            : require('../assets/icons/tmbd-icon.png')
        }
        style={styles.castImage}
      />
      <Text style={styles.castName} numberOfLines={1}>
        {cast.name}
      </Text>
      <Text style={styles.castCharacter} numberOfLines={1}>
        {cast.character}
      </Text>
    </View>
  );

  const renderRecommendation = (movie) => (
    <TouchableOpacity
      key={movie.id}
      style={styles.recommendationCard}
      onPress={() => {
        navigation.push('Details', { movieId: movie.id });
      }}
    >
      <Image
        source={
          movie.poster_path
            ? { uri: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` }
            : require('../assets/icons/tmbd-icon.png')
        }
        style={styles.recommendationImage}
      />
      <Text style={styles.recommendationTitle} numberOfLines={2}>
        {movie.title}
      </Text>
      {movie.vote_average > 0 && (
        <Text style={styles.recommendationRating}>
          {Math.round(movie.vote_average * 10)}%
        </Text>
      )}
    </TouchableOpacity>
  );

  if (movieDetails.loading || !movie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00B4E4" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  const directorAndWriters = getDirectorAndWriters();
  const topCast = credits?.cast?.slice(0, 10) || [];

  return (
    <ScrollView style={styles.container}>
      {/* Main Info Section */}
      <View style={styles.mainInfoSection}>
        {/* Poster */}
        <Image
          source={
            movie.poster_path
              ? { uri: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` }
              : require('../assets/icons/tmbd-icon.png')
          }
          style={styles.poster}
        />

        {/* Movie Info */}
        <View style={styles.infoContainer}>
          {/* Rating Badge */}
          {movie.release_dates?.results?.[0]?.release_dates?.[0]?.certification && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>
                {movie.release_dates.results[0].release_dates[0].certification}
              </Text>
            </View>
          )}

          {/* Release Date & Runtime */}
          <Text style={styles.infoText}>
            {formatDate(movie.release_date)} (
            {movie.production_countries?.[0]?.iso_3166_1 || 'US'}) •{' '}
            {formatRuntime(movie.runtime)}
          </Text>

          {/* Genres */}
          <Text style={styles.infoText}>
            {movie.genres?.map((g) => g.name).join(', ')}
          </Text>

          {/* Status */}
          <Text style={styles.infoLabel}>
            Status: <Text style={styles.infoValue}>{movie.status}</Text>
          </Text>

          {/* Original Language */}
          <Text style={styles.infoLabel}>
            Original Language:{' '}
            <Text style={styles.infoValue}>
              {movie.original_language?.toUpperCase()}
            </Text>
          </Text>
        </View>
      </View>

      {/* User Score and Credits Section */}
      <View style={styles.scoreCreditsSection}>
        {/* User Score */}
        <View style={styles.userScoreContainer}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>
              {Math.round(movie.vote_average * 10)}%
            </Text>
          </View>
          <Text style={styles.userScoreLabel}>User Score</Text>
        </View>

        {/* Credits */}
        <View style={styles.creditsContainer}>
          {directorAndWriters.map((person, index) => (
            <View key={`${person.id}-${index}`} style={styles.creditItem}>
              <Text style={styles.creditName}>{person.name}</Text>
              <Text style={styles.creditJob}>{person.job}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tagline */}
      {movie.tagline && (
        <Text style={styles.tagline}>{movie.tagline}</Text>
      )}

      {/* Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overviewText}>{movie.overview}</Text>
      </View>

      {/* Add To Watchlist Button */}
      <TouchableOpacity
        style={styles.watchlistButton}
        onPress={handleWatchlistToggle}
        disabled={addToWatchlistState.loading}
      >
        {addToWatchlistState.loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            {/* <Text style={styles.watchlistIcon}>🔖</Text> */}
            <SvgXml xml={svgs.watchlistIcon} width={24} height={24} fill={colors.white} />
            <Text style={styles.watchlistButtonText}>
              {isInWatchlist ? 'Remove from Watchlist' : 'Add To Watchlist'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Top Billed Cast */}
      {topCast.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Billed Cast</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {topCast.map(renderCastMember)}
          </ScrollView>
        </View>
      )}

      {/* Recommendations */}
      {recommendations?.results && recommendations.results.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {recommendations.results.map(renderRecommendation)}
          </ScrollView>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00B4E4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00B4E4',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainInfoSection: {
    flexDirection: 'row',
    padding: 16,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  ratingBadge: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
  },
  infoLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontWeight: '400',
  },
  scoreCreditsSection: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  userScoreContainer: {
    alignItems: 'center',
    marginRight: 32,
  },
  scoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userScoreLabel: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  creditsContainer: {
    flex: 1,
  },
  creditItem: {
    marginBottom: 12,
  },
  creditName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  creditJob: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 16,
    fontStyle: 'italic',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  overviewText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'justify',
  },
  watchlistButton: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchlistIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  watchlistButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  horizontalScroll: {
    marginTop: 8,
  },
  castCard: {
    width: 120,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  castImage: {
    width: 120,
    height: 150,
    backgroundColor: '#E0E0E0',
  },
  castName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    padding: 8,
    paddingBottom: 4,
  },
  castCharacter: {
    fontSize: 12,
    color: '#666666',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  recommendationCard: {
    width: 150,
    marginRight: 12,
  },
  recommendationImage: {
    width: 150,
    height: 225,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  recommendationTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: '600',
  },
  recommendationRating: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
  },
  bottomPadding: {
    height: 32,
  },
});

export default DetailsScreen;
