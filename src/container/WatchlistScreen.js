import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../config/colors';

const WatchlistScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Watchlist Screen</Text>
      <Text style={styles.subtitle}>Your movie watchlist will be displayed here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.black,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textGray,
    marginBottom: 20,
  },
});

export default WatchlistScreen;
