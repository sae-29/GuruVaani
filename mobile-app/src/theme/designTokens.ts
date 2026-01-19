// Guru Vaani Design Tokens - Mobile (React Native)
import {Dimensions} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export const designTokens = {
  colors: {
    primary: '#FF7043', // Saffron Orange - Warm & Energetic
    secondary: '#26A69A', // Teal - Calm & Natural
    accent: '#5C6BC0', // Indigo - Deep & Intellectual
    background: '#FAFAFA', // Warm Off-White (was #FAFAFA)
    surface: '#FDFBF7', // Paper-like Warm White (was #FFFFFF)
    surfaceHighlight: '#FFFFFF', // Pure White for highlights
    error: '#E53935', // Red
    warning: '#FFA726', // Amber
    success: '#4CAF50', // Green
    textPrimary: '#3E2723', // Dark Warm Brown (was #212121)
    textSecondary: '#5D4037', // Medium Warm Brown (was #757575)
    disabled: '#D7CCC8', // Light Warm Gray
    outline: '#EFEBE9', // Warm Border
    scrim: 'rgba(0,0,0,0.3)', // Soft overlay
  },
  spacing: {
    xs: 4, // 4px
    sm: 8, // 8px
    md: 16, // 16px
    lg: 24, // 24px
    xl: 32, // 32px
    xxl: 48, // 48px
    xxxl: 64, // 64px - Added for large pauses
  },
  borderRadius: {
    button: 12, // Softer buttons
    card: 16, // Softer cards
    pill: 24, // 24px for pills/badges
    organic: [12, 16, 20, 14], // Array for random selection logic
  },
  shadows: {
    card: {
      shadowColor: '#3E2723', // Warm shadow
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08, // Softer opacity
      shadowRadius: 8, // Blurrrier
      elevation: 2,
    },
    elevated: {
      shadowColor: '#3E2723',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 4,
    },
    soft: {
      shadowColor: '#5D4037',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    modal: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 8,
    },
  },
  typography: {
    fontFamily: {
      regular: 'Noto Sans',
      medium: 'Noto Sans Medium',
      semibold: 'Noto Sans SemiBold',
    },
    sizes: {
      xs: 12, // 12px
      sm: 14, // 14px
      base: 16, // 16px
      lg: 18, // 18px
      xl: 22, // 22px
      xxl: 28, // 28px
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
  layout: {
    screenWidth,
    screenHeight,
    isSmallScreen: screenWidth < 375,
    isLargeScreen: screenWidth > 414,
    headerHeight: 56,
    tabBarHeight: 56,
    statusBarHeight: 24, // Approximate, varies by device
  },
  touchTargets: {
    minimum: 48, // Minimum touch target size
    comfortable: 56, // Comfortable touch target size
    large: 72, // Large touch target size
  },
  animations: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
} as const;

// Type definitions
export type ColorToken = keyof typeof designTokens.colors;
export type SpacingToken = keyof typeof designTokens.spacing;
export type BorderRadiusToken = keyof typeof designTokens.borderRadius;
export type TypographySizeToken = keyof typeof designTokens.typography.sizes;

// Utility functions
export const getColor = (token: ColorToken): string =>
  designTokens.colors[token];
export const getSpacing = (token: SpacingToken): number =>
  designTokens.spacing[token];
export const getBorderRadius = (token: BorderRadiusToken): number =>
  designTokens.borderRadius[token];
export const getFontSize = (token: TypographySizeToken): number =>
  designTokens.typography.sizes[token];

// Style mixins for React Native
export const mixins = {
  button: {
    base: {
      borderRadius: designTokens.borderRadius.button,
      paddingVertical: designTokens.spacing.sm,
      paddingHorizontal: designTokens.spacing.md,
      minHeight: designTokens.touchTargets.minimum,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
    },
    primary: {
      backgroundColor: designTokens.colors.primary,
      ...designTokens.shadows.card,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: designTokens.colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  },
  card: {
    base: {
      backgroundColor: designTokens.colors.surface,
      borderRadius: designTokens.borderRadius.card,
      padding: designTokens.spacing.md,
      ...designTokens.shadows.card,
    },
    interactive: {
      backgroundColor: designTokens.colors.surface,
      borderRadius: designTokens.borderRadius.card,
      padding: designTokens.spacing.md,
      ...designTokens.shadows.card,
    },
  },
  input: {
    base: {
      borderWidth: 1,
      borderColor: designTokens.colors.outline,
      borderRadius: designTokens.borderRadius.button,
      backgroundColor: designTokens.colors.surface,
      paddingVertical: designTokens.spacing.sm + 4,
      paddingHorizontal: designTokens.spacing.md,
      fontSize: designTokens.typography.sizes.base,
      minHeight: designTokens.touchTargets.minimum,
      color: designTokens.colors.textPrimary,
    },
    focused: {
      borderColor: designTokens.colors.primary,
      borderWidth: 2,
    },
    disabled: {
      backgroundColor: designTokens.colors.disabled,
      color: designTokens.colors.textSecondary,
    },
  },
  chip: {
    base: {
      paddingVertical: designTokens.spacing.xs + 2,
      paddingHorizontal: designTokens.spacing.sm + 4,
      borderRadius: designTokens.borderRadius.pill,
      borderWidth: 1,
      borderColor: designTokens.colors.outline,
      backgroundColor: designTokens.colors.background,
      height: 32,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    selected: {
      backgroundColor: designTokens.colors.primary,
      borderColor: designTokens.colors.primary,
    },
  },
  text: {
    h1: {
      fontSize: designTokens.typography.sizes.xxl,
      fontWeight: designTokens.typography.weights.semibold,
      lineHeight:
        designTokens.typography.sizes.xxl *
        designTokens.typography.lineHeights.tight,
      color: designTokens.colors.textPrimary,
    },
    h2: {
      fontSize: designTokens.typography.sizes.xl,
      fontWeight: designTokens.typography.weights.semibold,
      lineHeight:
        designTokens.typography.sizes.xl *
        designTokens.typography.lineHeights.normal,
      color: designTokens.colors.textPrimary,
    },
    h3: {
      fontSize: designTokens.typography.sizes.lg,
      fontWeight: designTokens.typography.weights.semibold,
      lineHeight:
        designTokens.typography.sizes.lg *
        designTokens.typography.lineHeights.normal,
      color: designTokens.colors.textPrimary,
    },
    body1: {
      fontSize: designTokens.typography.sizes.base,
      fontWeight: designTokens.typography.weights.normal,
      lineHeight:
        designTokens.typography.sizes.base *
        designTokens.typography.lineHeights.relaxed,
      color: designTokens.colors.textPrimary,
    },
    body2: {
      fontSize: designTokens.typography.sizes.sm,
      fontWeight: designTokens.typography.weights.normal,
      lineHeight:
        designTokens.typography.sizes.sm *
        designTokens.typography.lineHeights.normal,
      color: designTokens.colors.textSecondary,
    },
    caption: {
      fontSize: designTokens.typography.sizes.xs,
      fontWeight: designTokens.typography.weights.normal,
      lineHeight:
        designTokens.typography.sizes.xs *
        designTokens.typography.lineHeights.normal,
      color: designTokens.colors.textSecondary,
    },
    button: {
      fontSize: designTokens.typography.sizes.base,
      fontWeight: designTokens.typography.weights.medium,
      lineHeight:
        designTokens.typography.sizes.base *
        designTokens.typography.lineHeights.normal,
    },
  },
  layout: {
    container: {
      flex: 1,
      backgroundColor: designTokens.colors.background,
    },
    content: {
      flex: 1,
      padding: designTokens.spacing.md,
    },
    section: {
      marginBottom: designTokens.spacing.lg,
    },
    row: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    column: {
      flexDirection: 'column' as const,
    },
    center: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    spaceBetween: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
  },
};

// Responsive helpers
export const responsive = {
  isSmallScreen: () => designTokens.layout.isSmallScreen,
  isLargeScreen: () => designTokens.layout.isLargeScreen,
  getResponsiveSpacing: (base: number) => {
    if (designTokens.layout.isSmallScreen) {
      return base * 0.75;
    }
    if (designTokens.layout.isLargeScreen) {
      return base * 1.25;
    }
    return base;
  },
  getResponsiveFontSize: (base: number) => {
    if (designTokens.layout.isSmallScreen) {
      return base * 0.9;
    }
    if (designTokens.layout.isLargeScreen) {
      return base * 1.1;
    }
    return base;
  },
};

// Accessibility helpers
export const a11y = {
  minimumTouchTarget: designTokens.touchTargets.minimum,
  comfortableTouchTarget: designTokens.touchTargets.comfortable,
  largeTouchTarget: designTokens.touchTargets.large,

  // Screen reader helpers
  accessibilityLabel: (label: string) => ({accessibilityLabel: label}),
  accessibilityHint: (hint: string) => ({accessibilityHint: hint}),
  accessibilityRole: (role: string) => ({accessibilityRole: role}),

  // Focus helpers
  focusable: {accessible: true, focusable: true},
  notFocusable: {accessible: false, focusable: false},
};

// Animation presets
export const animations = {
  fadeIn: {
    from: {opacity: 0},
    to: {opacity: 1},
  },
  slideUp: {
    from: {transform: [{translateY: 20}], opacity: 0},
    to: {transform: [{translateY: 0}], opacity: 1},
  },
  scale: {
    from: {transform: [{scale: 0.9}], opacity: 0},
    to: {transform: [{scale: 1}], opacity: 1},
  },
  bounce: {
    from: {transform: [{scale: 0.3}]},
    to: {transform: [{scale: 1}]},
  },
};

export default designTokens;
