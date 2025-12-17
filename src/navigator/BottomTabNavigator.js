import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StackNavigator from './StackNavigator';
import WatchlistScreen from '../container/WatchlistScreen';
import colors from '../config/colors';
import { SvgXml } from 'react-native-svg';
import svgs from '../config/svg';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName) => {
  switch (routeName) {
    case 'HomeTab':
      return svgs.homeIcon;
    case 'Watchlist':
      return svgs.watchlistIcon;
    default:
      return svgs.homeIcon;
  }
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textGray,
        tabBarStyle: {
          backgroundColor: colors.white,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarIconStyle: {
          width: 24,
          height: 24,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconXml = getTabBarIcon(route.name);

          // on focus to fill with primary color
          if (focused) return <SvgXml xml={iconXml} width={24} height={24} fill={colors.primary} />;

          return <SvgXml xml={iconXml} width={24} height={24} />;
        },
      })}>
      <Tab.Screen
        name="HomeTab"
        component={StackNavigator}
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{
          title: 'Watchlist',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
