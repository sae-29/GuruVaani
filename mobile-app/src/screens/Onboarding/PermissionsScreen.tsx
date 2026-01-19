import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {Text, Surface, Button, Card} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {designTokens, mixins} from '../../theme/designTokens';

const PermissionsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [microphoneGranted, setMicrophoneGranted] = useState(false);
  const [notificationsGranted, setNotificationsGranted] = useState(false);

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message:
              'Guru Vaani needs access to your microphone for voice diary entries.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setMicrophoneGranted(true);
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // iOS permission handling would go here
      setMicrophoneGranted(true);
    }
  };

  const requestNotificationPermission = async () => {
    // Notification permission handling
    setNotificationsGranted(true);
  };

  const handleSkip = () => {
    navigation.navigate('ProfileSetup' as never);
  };

  const handleContinue = () => {
    navigation.navigate('ProfileSetup' as never);
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.onBackground}]}>
          We Need Your Permission
        </Text>
        <Text style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
          These permissions help us provide the best experience
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Microphone Permission */}
        <Card
          style={[
            styles.permissionCard,
            {
              backgroundColor: microphoneGranted
                ? designTokens.colors.secondary + '20'
                : theme.colors.surface,
            },
          ]}>
          <View style={styles.permissionContent}>
            <View style={styles.iconContainer}>
              <Icon
                name="mic"
                size={48}
                color={
                  microphoneGranted
                    ? designTokens.colors.secondary
                    : designTokens.colors.primary
                }
              />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.permissionTitle,
                  {color: theme.colors.onSurface},
                ]}>
                Voice Recording
              </Text>
              <Text
                style={[
                  styles.permissionDescription,
                  {color: theme.colors.onSurfaceVariant},
                ]}>
                For audio diary entries
              </Text>
            </View>
            {microphoneGranted ? (
              <Icon
                name="check-circle"
                size={32}
                color={designTokens.colors.secondary}
              />
            ) : (
              <Button
                mode="outlined"
                onPress={requestMicrophonePermission}
                style={styles.permissionButton}>
                Allow
              </Button>
            )}
          </View>
        </Card>

        {/* Notification Permission */}
        <Card
          style={[
            styles.permissionCard,
            {
              backgroundColor: notificationsGranted
                ? designTokens.colors.secondary + '20'
                : theme.colors.surface,
            },
          ]}>
          <View style={styles.permissionContent}>
            <View style={styles.iconContainer}>
              <Icon
                name="notifications"
                size={48}
                color={
                  notificationsGranted
                    ? designTokens.colors.secondary
                    : designTokens.colors.primary
                }
              />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.permissionTitle,
                  {color: theme.colors.onSurface},
                ]}>
                Notifications
              </Text>
              <Text
                style={[
                  styles.permissionDescription,
                  {color: theme.colors.onSurfaceVariant},
                ]}>
                Get alerts for new trainings
              </Text>
            </View>
            {notificationsGranted ? (
              <Icon
                name="check-circle"
                size={32}
                color={designTokens.colors.secondary}
              />
            ) : (
              <Button
                mode="outlined"
                onPress={requestNotificationPermission}
                style={styles.permissionButton}>
                Allow
              </Button>
            )}
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleContinue}
          style={styles.continueButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}>
          Continue
        </Button>
        <Button
          mode="text"
          onPress={handleSkip}
          style={styles.skipButton}
          labelStyle={[
            styles.skipLabel,
            {color: theme.colors.onSurfaceVariant},
          ]}>
          Skip for Now
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: designTokens.spacing.xl,
    paddingTop: designTokens.spacing.xxl,
  },
  title: {
    ...mixins.text.h1,
    marginBottom: designTokens.spacing.sm,
  },
  subtitle: {
    ...mixins.text.body2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: designTokens.spacing.xl,
  },
  permissionCard: {
    marginBottom: designTokens.spacing.lg,
    ...designTokens.shadows.card,
  },
  permissionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.lg,
  },
  iconContainer: {
    marginRight: designTokens.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  permissionTitle: {
    ...mixins.text.h3,
    marginBottom: designTokens.spacing.xs,
  },
  permissionDescription: {
    ...mixins.text.body2,
  },
  permissionButton: {
    marginLeft: designTokens.spacing.md,
  },
  footer: {
    padding: designTokens.spacing.xl,
    paddingBottom: designTokens.spacing.xxl,
  },
  continueButton: {
    ...mixins.button.primary,
    marginBottom: designTokens.spacing.sm,
  },
  buttonContent: {
    paddingVertical: designTokens.spacing.sm,
  },
  buttonLabel: {
    ...mixins.text.button,
  },
  skipButton: {
    marginTop: designTokens.spacing.sm,
  },
  skipLabel: {
    ...mixins.text.body2,
  },
});

export default PermissionsScreen;
