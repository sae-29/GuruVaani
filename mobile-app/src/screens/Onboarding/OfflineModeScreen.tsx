import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Text, Surface, Button} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {designTokens, mixins} from '../../theme/designTokens';

const {width} = Dimensions.get('window');

const OfflineModeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleContinue = () => {
    navigation.navigate('Permissions' as never);
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.content}>
        {/* Illustration */}
        <Surface style={styles.illustrationContainer}>
          <Icon
            name="phone-android"
            size={80}
            color={designTokens.colors.primary}
          />
          <View style={styles.cloudContainer}>
            <Icon
              name="cloud-sync"
              size={40}
              color={designTokens.colors.secondary}
            />
          </View>
        </Surface>

        {/* Heading */}
        <Text style={[styles.heading, {color: theme.colors.onBackground}]}>
          Use Guru Vaani Anywhere
        </Text>

        {/* Features */}
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Icon
              name="edit-note"
              size={32}
              color={designTokens.colors.primary}
              style={styles.featureIcon}
            />
            <View style={styles.featureText}>
              <Text
                style={[styles.featureTitle, {color: theme.colors.onSurface}]}>
                Save entries offline
              </Text>
              <Text
                style={[
                  styles.featureDescription,
                  {color: theme.colors.onSurfaceVariant},
                ]}>
                Write reflections even without internet
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Icon
              name="cloud-sync"
              size={32}
              color={designTokens.colors.secondary}
              style={styles.featureIcon}
            />
            <View style={styles.featureText}>
              <Text
                style={[styles.featureTitle, {color: theme.colors.onSurface}]}>
                Syncs when connected
              </Text>
              <Text
                style={[
                  styles.featureDescription,
                  {color: theme.colors.onSurfaceVariant},
                ]}>
                Your data automatically syncs when online
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Icon
              name="download"
              size={32}
              color={designTokens.colors.accent}
              style={styles.featureIcon}
            />
            <View style={styles.featureText}>
              <Text
                style={[styles.featureTitle, {color: theme.colors.onSurface}]}>
                Download trainings for later
              </Text>
              <Text
                style={[
                  styles.featureDescription,
                  {color: theme.colors.onSurfaceVariant},
                ]}>
                Access learning modules anytime, anywhere
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleContinue}
          style={styles.continueButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}>
          I Understand
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: designTokens.spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.spacing.xl,
    ...designTokens.shadows.elevated,
    backgroundColor: designTokens.colors.surface,
    position: 'relative',
  },
  cloudContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  heading: {
    ...mixins.text.h1,
    textAlign: 'center',
    marginBottom: designTokens.spacing.xl,
  },
  featuresList: {
    width: '100%',
    paddingHorizontal: designTokens.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: designTokens.spacing.lg,
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.surface,
    borderRadius: designTokens.borderRadius.card,
    ...designTokens.shadows.card,
  },
  featureIcon: {
    marginRight: designTokens.spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...mixins.text.h3,
    marginBottom: designTokens.spacing.xs,
  },
  featureDescription: {
    ...mixins.text.body2,
  },
  footer: {
    paddingBottom: designTokens.spacing.xl,
  },
  continueButton: {
    ...mixins.button.primary,
  },
  buttonContent: {
    paddingVertical: designTokens.spacing.sm,
  },
  buttonLabel: {
    ...mixins.text.button,
  },
});

export default OfflineModeScreen;
