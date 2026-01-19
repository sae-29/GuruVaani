import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as ReduxProvider} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from './store/store';
import {theme} from './theme/theme';
import MainTabNavigator from './navigation/MainTabNavigator';
import LoginScreen from './screens/Auth/LoginScreen';
import ReflectionDetailScreen from './screens/Reflections/ReflectionDetailScreen';
import ProfileScreen from './screens/Profile/ProfileScreen';
// Onboarding screens
import WelcomeScreen from './screens/Onboarding/WelcomeScreen';
import LanguageSelectionScreen from './screens/Onboarding/LanguageSelectionScreen';
import OfflineModeScreen from './screens/Onboarding/OfflineModeScreen';
import PermissionsScreen from './screens/Onboarding/PermissionsScreen';
import ProfileSetupScreen from './screens/Onboarding/ProfileSetupScreen';

const Stack = createStackNavigator();

function App(): JSX.Element {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      setIsFirstLaunch(hasLaunched === null);
    } catch (error) {
      console.error('Error checking first launch:', error);
      setIsFirstLaunch(true);
    }
  };

  if (isFirstLaunch === null) {
    // Show loading screen or splash
    return null;
  }

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isFirstLaunch ? 'Welcome' : 'Login'}
            screenOptions={{
              headerShown: false,
            }}>
            {/* Onboarding Flow */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen
              name="LanguageSelection"
              component={LanguageSelectionScreen}
            />
            <Stack.Screen
              name="OfflineModeExplanation"
              component={OfflineModeScreen}
            />
            <Stack.Screen name="Permissions" component={PermissionsScreen} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />

            {/* Auth & Main App */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="ReflectionDetail"
              component={ReflectionDetailScreen}
              options={{
                headerShown: true,
                title: 'Reflection Details',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: true,
                title: 'Profile',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}

export default App;
