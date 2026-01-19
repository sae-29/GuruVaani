import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigation} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screen imports
import HomeScreen from '../screens/Home/HomeScreen';
import EntriesScreen from '../screens/Entries/EntriesScreen';
import TrainingScreen from '../screens/Training/TrainingScreen';
import CommunityScreen from '../screens/Community/CommunityScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import ProgressScreen from '../screens/Progress/ProgressScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({navigation, state, descriptors, insets}) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({route, preventDefault}) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.navigate(route.name);
            }
          }}
          renderIcon={({route, focused, color}) => {
            const {options} = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({focused, color, size: 24});
            }
            return null;
          }}
          getLabelText={({route}) => {
            const {options} = descriptors[route.key];
            return options.tabBarLabel || options.title || route.name;
          }}
        />
      )}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Entries"
        component={EntriesScreen}
        options={{
          tabBarLabel: 'My Entries',
          tabBarIcon: ({color, size}) => (
            <Icon name="edit-note" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Training"
        component={TrainingScreen}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({color, size}) => (
            <Icon name="school" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarLabel: 'Community',
          tabBarIcon: ({color, size}) => (
            <Icon name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progress',
          tabBarIcon: ({color, size}) => (
            <Icon name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color, size}) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
