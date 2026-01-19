import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions, Animated} from 'react-native';
import {Text, Surface} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {designTokens, mixins} from '../../theme/designTokens';

const {width, height} = Dimensions.get('window');

const WelcomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-advance after 2 seconds
    const timer = setTimeout(() => {
      navigation.navigate('LanguageSelection' as never);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        {/* Logo */}
        <Surface style={styles.logoContainer}>
          <Icon
            name="menu-book"
            size={80}
            color={designTokens.colors.primary}
          />
          <View style={styles.soundWaves}>
            <View style={[styles.wave, styles.wave1]} />
            <View style={[styles.wave, styles.wave2]} />
            <View style={[styles.wave, styles.wave3]} />
          </View>
        </Surface>

        {/* App Name */}
        <Text style={[styles.appName, {color: theme.colors.onBackground}]}>
          Guru Vaani
        </Text>

        {/* Tagline */}
        <Text style={[styles.tagline, {color: theme.colors.onSurfaceVariant}]}>
          Empowering Teachers, One Reflection at a Time
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: designTokens.spacing.xl,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.spacing.xl,
    ...designTokens.shadows.elevated,
    backgroundColor: designTokens.colors.surface,
    position: 'relative',
  },
  soundWaves: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: designTokens.colors.secondary,
    opacity: 0.3,
  },
  wave1: {
    transform: [{scale: 1}],
  },
  wave2: {
    transform: [{scale: 1.2}],
  },
  wave3: {
    transform: [{scale: 1.4}],
  },
  appName: {
    ...mixins.text.h1,
    fontSize: designTokens.typography.sizes.xxl + 8,
    fontWeight: designTokens.typography.weights.semibold,
    marginBottom: designTokens.spacing.md,
    textAlign: 'center',
  },
  tagline: {
    ...mixins.text.body1,
    fontSize: designTokens.typography.sizes.lg,
    textAlign: 'center',
    paddingHorizontal: designTokens.spacing.xl,
  },
});

export default WelcomeScreen;
