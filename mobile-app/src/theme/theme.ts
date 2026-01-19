import {MD3LightTheme, configureFonts} from 'react-native-paper';

// Guru Vaani Design Tokens - Mobile
import {designTokens} from './designTokens';

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'Noto Sans, system-ui, sans-serif',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Noto Sans, system-ui, sans-serif',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'Noto Sans, system-ui, sans-serif',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'Noto Sans, system-ui, sans-serif',
      fontWeight: '100',
    },
  },
  ios: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  android: {
    regular: {
      fontFamily: 'Roboto, Noto Sans, sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Roboto, Noto Sans, sans-serif',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'Roboto, Noto Sans, sans-serif',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'Roboto, Noto Sans, sans-serif',
      fontWeight: '100',
    },
  },
};

export const theme = {
  ...MD3LightTheme,
  fonts: configureFonts({config: fontConfig}),
  colors: {
    ...MD3LightTheme.colors,
    primary: designTokens.colors.primary,
    primaryContainer: '#FFE8D6',
    onPrimary: designTokens.colors.surface,
    onPrimaryContainer: '#4D2600',
    secondary: designTokens.colors.secondary,
    secondaryContainer: '#B2DFDB',
    onSecondary: designTokens.colors.surface,
    onSecondaryContainer: '#004D40',
    tertiary: designTokens.colors.accent,
    tertiaryContainer: '#E8EAF6',
    onTertiary: designTokens.colors.surface,
    onTertiaryContainer: '#1A237E',
    error: designTokens.colors.error,
    errorContainer: '#FFEBEE',
    onError: designTokens.colors.surface,
    onErrorContainer: '#B71C1C',
    background: designTokens.colors.background,
    onBackground: designTokens.colors.textPrimary,
    surface: designTokens.colors.surface,
    onSurface: designTokens.colors.textPrimary,
    surfaceVariant: '#F5F5F5',
    onSurfaceVariant: designTokens.colors.textSecondary,
    outline: designTokens.colors.outline,
    outlineVariant: '#E8E8E8',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#303030',
    inverseOnSurface: '#F5F5F5',
    inversePrimary: '#FFB74D',
    elevation: {
      level0: 'transparent',
      level1: '#FCFCFC',
      level2: '#F8F8F8',
      level3: '#F3F3F3',
      level4: '#F1F1F1',
      level5: '#EEEEEE',
    },
    surfaceDisabled: 'rgba(33, 33, 33, 0.12)',
    onSurfaceDisabled: 'rgba(33, 33, 33, 0.38)',
    backdrop: 'rgba(33, 33, 33, 0.4)',
  },
  roundness: designTokens.borderRadius.card,
};

// Export design tokens for use in components
export {designTokens};
