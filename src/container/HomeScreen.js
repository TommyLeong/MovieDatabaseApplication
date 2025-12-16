import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import colors from '../config/colors';

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.subtitle}>Movie Database Application</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
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

export default HomeScreen;
