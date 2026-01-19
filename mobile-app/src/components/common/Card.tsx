import React, {useMemo, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TouchableOpacityProps,
  Animated,
} from 'react-native';
import {designTokens, mixins, a11y} from '../../theme/designTokens';

interface CardProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: 'default' | 'outlined' | 'elevated' | 'soft';
  interactive?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  children: React.ReactNode;
  style?: ViewStyle;
  imperfectionLevel?: 'none' | 'low' | 'medium' | 'high';
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  interactive = false,
  padding = 'medium',
  children,
  style,
  onPress,
  imperfectionLevel = 'none',
  ...props
}) => {
  const imperfectionStyles = useMemo(() => {
    if (imperfectionLevel === 'none') {
      return {};
    }

    const organicRadius = designTokens.borderRadius.organic as number[];
    const randomRadius =
      organicRadius[Math.floor(Math.random() * organicRadius.length)];

    const rotation =
      imperfectionLevel === 'high'
        ? `${(Math.random() * 1 - 0.5).toFixed(2)}deg`
        : '0deg';

    return {
      borderRadius: randomRadius,
      transform: [{rotate: rotation}],
    };
  }, [imperfectionLevel]);

  const opacity = useRef(new Animated.Value(0.96)).current;
  const scale = useRef(new Animated.Value(0.98)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  const baseTransform = (imperfectionStyles as any).transform || [];
  const cardStyles = [
    styles.base,
    styles[variant],
    styles[`${padding}Padding`],
    {
      borderRadius: (imperfectionStyles as any).borderRadius,
      opacity,
      transform: [...baseTransform, {scale}],
    },
    style,
  ];

  if (interactive && onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.95}
        {...a11y.accessibilityRole('button')}
        {...props}>
        <Animated.View style={cardStyles}>{children}</Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View style={cardStyles} {...props}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    ...mixins.card.base,
    borderRadius: designTokens.borderRadius.card,
  },

  // Variant styles
  default: {
    backgroundColor: designTokens.colors.surface,
    ...designTokens.shadows.card,
  },
  outlined: {
    backgroundColor: designTokens.colors.surface,
    borderWidth: 1,
    borderColor: designTokens.colors.outline,
    shadowOpacity: 0,
    elevation: 0,
  },
  elevated: {
    backgroundColor: designTokens.colors.surface,
    ...designTokens.shadows.elevated,
  },
  soft: {
    backgroundColor: designTokens.colors.surface,
    ...designTokens.shadows.soft,
  },

  // Padding variants
  nonePadding: {
    padding: 0,
  },
  smallPadding: {
    padding: designTokens.spacing.sm,
  },
  mediumPadding: {
    padding: designTokens.spacing.md,
  },
  largePadding: {
    padding: designTokens.spacing.lg,
  },
});

export default Card;
