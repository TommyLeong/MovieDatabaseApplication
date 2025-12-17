import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../config/colors';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie, onPress, showDeleteButton = false, onDelete }) => {
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Release date unavailable';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Default showing max 150 characters of overview
  const truncateText = (text, maxLength = 150) => {
    if (!text) return 'No overview available';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(movie)}
      activeOpacity={0.7}
    >
      <View style={styles.posterContainer}>
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderPoster}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title || 'Untitled'}
        </Text>

        <Text style={styles.releaseDate}>
          {formatDate(movie.release_date)}
        </Text>

        <Text style={styles.overview} numberOfLines={4}>
          {truncateText(movie.overview)}
        </Text>

        {movie.vote_average > 0 && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Rating: </Text>
            <Text style={styles.ratingValue}>
              {movie.vote_average.toFixed(1)}/10
            </Text>
          </View>
        )}
      </View>

      {showDeleteButton && onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            onDelete(movie);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  posterContainer: {
    width: '100%',
    height: 200,
    backgroundColor: colors.textGray,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  placeholderPoster: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.textGray,
    fontSize: 16,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  releaseDate: {
    fontSize: 14,
    color: colors.textGray,
    marginBottom: 12,
  },
  overview: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 14,
    color: colors.textGray,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});

export default MovieCard;
