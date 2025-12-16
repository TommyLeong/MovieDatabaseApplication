import React from 'react';
import { Image, StatusBar, useColorScheme, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigator from './src/navigator/BottomTabNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              backgroundColor: 'white'
            }}
          >
            <Image
              source={require('./src/assets/icons/tmbd-icon.png')}
              style={{ width: 80, height: 80, marginTop: 5, marginBottom: 5 }}
            />
          </View>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <BottomTabNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
