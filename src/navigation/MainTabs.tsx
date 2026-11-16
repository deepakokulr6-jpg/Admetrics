import React from 'react';
import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';

import BottomNavigation, {
  type TabName,
} from '../components/shared/BottomNavigation';
import A15HomeScreen from '../screens/home/a15HomeScreen';
import RevenueScreen from '../screens/revenue/RevenueScreen';
import StatementScreen from '../screens/revenue/StatementScreen';
import SupportScreen from '../screens/revenue/SupportScreen';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Figma bottom bar wired to the tab navigator.
 *
 * A screen can hide the bar with
 *   navigation.setOptions({ tabBarStyle: { display: 'none' } })
 * (the Clinics tab does this while the user has no clinics yet).
 */
const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const route = state.routes[state.index];
  const tabBarStyle = StyleSheet.flatten(
    descriptors[route.key].options.tabBarStyle,
  );

  if (tabBarStyle?.display === 'none') {
    return null;
  }

  const handleTabPress = (name: TabName) => {
    const target = state.routes.find(r => r.name === name);
    if (!target) {
      return;
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: target.key,
      canPreventDefault: true,
    });

    if (route.name !== name && !event.defaultPrevented) {
      navigation.navigate(name);
    }
  };

  return (
    <BottomNavigation
      activeTab={route.name as TabName}
      onTabPress={handleTabPress}
    />
  );
};

const renderTabBar = (props: BottomTabBarProps) => <TabBar {...props} />;

/**
 * The four main sections. Tabs stay mounted once visited, so switching is
 * instant and each tab keeps its scroll position. Android back from any tab
 * returns to Clinics first, then leaves the app.
 */
const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="Clinics"
    backBehavior="initialRoute"
    tabBar={renderTabBar}
    screenOptions={{ headerShown: false, animation: 'none' }}
  >
    <Tab.Screen name="Revenue" component={RevenueScreen} />
    <Tab.Screen name="Clinics" component={A15HomeScreen} />
    <Tab.Screen name="Statement" component={StatementScreen} />
    <Tab.Screen name="Support" component={SupportScreen} />
  </Tab.Navigator>
);

export default MainTabs;
