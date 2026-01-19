import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Alert} from 'react-native';
import {Appbar, Text, Avatar, Switch, Divider} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {designTokens, mixins} from '../../theme/designTokens';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'navigation' | 'toggle' | 'info';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  // Settings state
  const [wifiOnly, setWifiOnly] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [emailDigest, setEmailDigest] = useState(true);

  const userProfile = {
    name: 'Radha Sharma',
    school: 'Government Primary School, Rampur',
    subjects: ['Math', 'Science'],
    avatar: 'R',
    nepHours: 32,
    badges: 3,
  };

  const accountSettings: SettingItem[] = [
    {
      id: 'profile',
      title: 'Edit Profile',
      subtitle: 'Update your information',
      icon: 'person',
      type: 'navigation',
      onPress: () => navigation.navigate('EditProfile'),
    },
  ];

  const preferenceSettings: SettingItem[] = [
    {
      id: 'language',
      title: 'Language',
      subtitle: 'English',
      icon: 'language',
      type: 'navigation',
      onPress: () => navigation.navigate('LanguageSettings'),
    },
    {
      id: 'wifiOnly',
      title: 'Download over WiFi only',
      subtitle: 'Save mobile data',
      icon: 'wifi',
      type: 'toggle',
      value: wifiOnly,
      onToggle: setWifiOnly,
    },
    {
      id: 'theme',
      title: 'Appearance',
      subtitle: 'Light',
      icon: 'palette',
      type: 'navigation',
      onPress: () => navigation.navigate('ThemeSettings'),
    },
  ];

  const notificationSettings: SettingItem[] = [
    {
      id: 'pushNotifications',
      title: 'Push Notifications',
      subtitle: 'Training alerts and updates',
      icon: 'notifications',
      type: 'toggle',
      value: pushNotifications,
      onToggle: setPushNotifications,
    },
    {
      id: 'smsAlerts',
      title: 'SMS Alerts',
      subtitle: 'Important announcements',
      icon: 'sms',
      type: 'toggle',
      value: smsAlerts,
      onToggle: setSmsAlerts,
    },
    {
      id: 'emailDigest',
      title: 'Email Digest',
      subtitle: 'Weekly summary',
      icon: 'email',
      type: 'toggle',
      value: emailDigest,
      onToggle: setEmailDigest,
    },
  ];

  const learningSettings: SettingItem[] = [
    {
      id: 'badges',
      title: 'My Badges',
      subtitle: `${userProfile.badges} earned`,
      icon: 'stars',
      type: 'navigation',
      onPress: () => navigation.navigate('Badges'),
    },
    {
      id: 'certificates',
      title: 'Certificates',
      subtitle: 'Download your achievements',
      icon: 'card-membership',
      type: 'navigation',
      onPress: () => navigation.navigate('Certificates'),
    },
    {
      id: 'nepHours',
      title: 'CPD Hours Tracker',
      subtitle: `${userProfile.nepHours}/50 hours`,
      icon: 'schedule',
      type: 'navigation',
      onPress: () => navigation.navigate('CPDTracker'),
    },
  ];

  const supportSettings: SettingItem[] = [
    {
      id: 'help',
      title: 'Help & FAQs',
      subtitle: 'Get support',
      icon: 'help',
      type: 'navigation',
      onPress: () => navigation.navigate('Help'),
    },
    {
      id: 'contact',
      title: 'Contact DIET Admin',
      subtitle: 'Send feedback',
      icon: 'contact-mail',
      type: 'navigation',
      onPress: () => navigation.navigate('ContactAdmin'),
    },
    {
      id: 'bug',
      title: 'Report an Issue',
      subtitle: 'Help us improve',
      icon: 'bug-report',
      type: 'navigation',
      onPress: () => navigation.navigate('ReportBug'),
    },
  ];

  const aboutSettings: SettingItem[] = [
    {
      id: 'version',
      title: 'Version',
      subtitle: '1.2.5',
      icon: 'info',
      type: 'info',
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      icon: 'description',
      type: 'navigation',
      onPress: () => navigation.navigate('Terms'),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: 'privacy-tip',
      type: 'navigation',
      onPress: () => navigation.navigate('Privacy'),
    },
  ];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // Handle logout logic
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        },
      },
    ]);
  };

  const renderSettingItem = (item: SettingItem) => (
    <View key={item.id} style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Icon
          name={item.icon}
          size={24}
          color={designTokens.colors.textSecondary}
          style={styles.settingIcon}
        />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>

      <View style={styles.settingAction}>
        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            color={designTokens.colors.primary}
          />
        )}
        {item.type === 'navigation' && (
          <Icon
            name="chevron-right"
            size={24}
            color={designTokens.colors.textSecondary}
          />
        )}
      </View>
    </View>
  );

  const renderSection = (title: string, items: SettingItem[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Card style={styles.sectionCard}>
        {items.map((item, index) => (
          <View key={item.id}>
            <Button
              variant="ghost"
              style={styles.settingButton}
              onPress={item.onPress}
              disabled={item.type === 'info'}>
              {renderSettingItem(item)}
            </Button>
            {index < items.length - 1 && <Divider />}
          </View>
        ))}
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <Card style={styles.profileCard}>
          <View style={styles.profileContent}>
            <Avatar.Text
              size={64}
              label={userProfile.avatar}
              style={{backgroundColor: designTokens.colors.primary}}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile.name}</Text>
              <Text style={styles.profileSchool}>{userProfile.school}</Text>
              <View style={styles.profileSubjects}>
                {userProfile.subjects.map((subject, index) => (
                  <Text key={index} style={styles.subjectTag}>
                    {subject}
                    {index < userProfile.subjects.length - 1 && ' • '}
                  </Text>
                ))}
              </View>
            </View>
            <Icon
              name="edit"
              size={24}
              color={designTokens.colors.textSecondary}
            />
          </View>
        </Card>

        {/* Settings Sections */}
        {renderSection('Account', accountSettings)}
        {renderSection('Preferences', preferenceSettings)}
        {renderSection('Notifications', notificationSettings)}
        {renderSection('My Learning', learningSettings)}
        {renderSection('Support', supportSettings)}
        {renderSection('About', aboutSettings)}

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            variant="danger"
            fullWidth
            onPress={handleLogout}
            icon={
              <Icon
                name="logout"
                size={20}
                color={designTokens.colors.surface}
              />
            }>
            Logout
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...mixins.layout.container,
  },
  content: {
    flex: 1,
    padding: designTokens.spacing.md,
  },
  profileCard: {
    marginBottom: designTokens.spacing.lg,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: designTokens.spacing.md,
  },
  profileName: {
    ...mixins.text.h3,
    marginBottom: designTokens.spacing.xs,
  },
  profileSchool: {
    ...mixins.text.body2,
    marginBottom: designTokens.spacing.xs,
  },
  profileSubjects: {
    flexDirection: 'row',
  },
  subjectTag: {
    ...mixins.text.caption,
    color: designTokens.colors.primary,
  },
  section: {
    marginBottom: designTokens.spacing.lg,
  },
  sectionTitle: {
    ...mixins.text.body2,
    fontWeight: designTokens.typography.weights.medium,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.sm,
    marginLeft: designTokens.spacing.sm,
  },
  sectionCard: {
    padding: 0,
  },
  settingButton: {
    padding: designTokens.spacing.md,
    borderRadius: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: designTokens.touchTargets.minimum,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: designTokens.spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    ...mixins.text.body1,
    fontWeight: designTokens.typography.weights.medium,
  },
  settingSubtitle: {
    ...mixins.text.body2,
    marginTop: designTokens.spacing.xs / 2,
  },
  settingAction: {
    marginLeft: designTokens.spacing.md,
  },
  logoutSection: {
    marginTop: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.xxl,
  },
});

export default SettingsScreen;
