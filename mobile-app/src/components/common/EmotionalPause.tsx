import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {designTokens, mixins} from '../../theme/designTokens';

export type PauseType = 'reflection' | 'training' | 'offline';

interface EmotionalPauseProps {
  visible: boolean;
  type: PauseType;
  onClose: () => void;
  autoClose?: boolean;
}

const pauseConfig = {
  reflection: {
    icon: 'spa',
    title: 'Take a breath.',
    message: 'Reflecting is the first step to growth.',
    color: designTokens.colors.primary,
    bgColor: '#FFF3E0', // Very light orange
  },
  training: {
    icon: 'school',
    title: 'Well done.',
    message: 'One small step can change a whole class.',
    color: designTokens.colors.secondary,
    bgColor: '#E0F2F1', // Very light teal
  },
  offline: {
    icon: 'cloud-off',
    title: 'No internet?',
    message: 'No problem. Your work is safe with us.',
    color: designTokens.colors.textSecondary,
    bgColor: '#ECEFF1', // Very light gray
  },
};

const EmotionalPause: React.FC<EmotionalPauseProps> = ({
  visible,
  type,
  onClose,
  autoClose = true,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const config = pauseConfig[type];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, 3500); // 3.5 seconds pause
        return () => clearTimeout(timer);
      }
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={[styles.container, {backgroundColor: config.bgColor}]}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{scale: scaleAnim}],
            },
          ]}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: 'rgba(255,255,255,0.8)'},
            ]}>
            <Icon name={config.icon} size={48} color={config.color} />
          </View>

          <Text
            style={[styles.title, {color: designTokens.colors.textPrimary}]}>
            {config.title}
          </Text>

          <Text
            style={[
              styles.message,
              {color: designTokens.colors.textSecondary},
            ]}>
            {config.message}
          </Text>

          {!autoClose && (
            <TouchableOpacity onPress={handleClose} style={styles.button}>
              <Text style={[styles.buttonText, {color: config.color}]}>
                Continue
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
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
    width: '100%',
    maxWidth: 400,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.spacing.xl,
    ...designTokens.shadows.soft,
  },
  title: {
    ...mixins.text.h1,
    marginBottom: designTokens.spacing.md,
    textAlign: 'center',
    fontWeight: '300', // Lighter weight for "Breath" feel
  },
  message: {
    ...mixins.text.h3,
    textAlign: 'center',
    lineHeight: 32,
    opacity: 0.8,
  },
  button: {
    marginTop: designTokens.spacing.xxl,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.xl,
    borderRadius: designTokens.borderRadius.pill,
    backgroundColor: 'white',
    ...designTokens.shadows.soft,
  },
  buttonText: {
    ...mixins.text.button,
    fontWeight: '600',
  },
});

export default EmotionalPause;
