import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import colors from '../config/colors';

const DetailsScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>
      <Text style={styles.subtitle}>Movie Details will be displayed here</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
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

export default DetailsScreen;
