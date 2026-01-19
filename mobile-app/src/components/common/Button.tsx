import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import {designTokens, mixins, a11y} from '../../theme/designTokens';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  icon,
  children,
  disabled,
  style,
  textStyle,
  onPress,
  ...props
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const handlePress = (event: any) => {
    if (!disabled && !loading && onPress) {
      onPress(event);
    }
  };

  const getSpinnerColor = () => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return designTokens.colors.surface;
      case 'secondary':
      case 'ghost':
        return designTokens.colors.primary;
      default:
        return designTokens.colors.surface;
    }
  };

  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...a11y.accessibilityRole('button')}
      {...(disabled && a11y.notFocusable)}
      {...props}>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size={getSpinnerSize()}
            color={getSpinnerColor()}
          />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={textStyles}>{children}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    ...mixins.button.base,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Variant styles
  primary: {
    ...mixins.button.primary,
  },
  secondary: {
    ...mixins.button.secondary,
  },
  ghost: {
    ...mixins.button.ghost,
  },
  danger: {
    backgroundColor: designTokens.colors.error,
    ...designTokens.shadows.card,
  },

  // Size styles
  small: {
    paddingVertical: designTokens.spacing.xs,
    paddingHorizontal: designTokens.spacing.sm,
    minHeight: 36,
  },
  medium: {
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    minHeight: designTokens.touchTargets.minimum,
  },
  large: {
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.lg,
    minHeight: designTokens.touchTargets.comfortable,
  },

  // Layout styles
  fullWidth: {
    width: '100%',
  },

  // State styles
  disabled: {
    backgroundColor: designTokens.colors.disabled,
    borderColor: designTokens.colors.disabled,
    opacity: 0.6,
  },

  // Content styles
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    marginRight: designTokens.spacing.sm,
  },

  // Text styles
  text: {
    fontSize: designTokens.typography.sizes.base,
    fontWeight: designTokens.typography.weights.medium,
    textAlign: 'center',
  },

  // Variant text styles
  primaryText: {
    color: designTokens.colors.surface,
  },
  secondaryText: {
    color: designTokens.colors.primary,
  },
  ghostText: {
    color: designTokens.colors.primary,
  },
  dangerText: {
    color: designTokens.colors.surface,
  },

  // Size text styles
  smallText: {
    fontSize: designTokens.typography.sizes.sm,
  },
  mediumText: {
    fontSize: designTokens.typography.sizes.base,
  },
  largeText: {
    fontSize: designTokens.typography.sizes.lg,
  },

  // Disabled text
  disabledText: {
    color: designTokens.colors.textSecondary,
  },
});

export default Button;
