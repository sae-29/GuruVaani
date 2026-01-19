import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Alert} from 'react-native';
import {
  Appbar,
  Text,
  Avatar,
  List,
  Divider,
  Switch,
  TextInput,
  Chip,
} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {designTokens, mixins} from '../../theme/designTokens';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Mock user data - in real app, this would come from Redux
  const [userProfile, setUserProfile] = useState({
    name: 'Radha Sharma',
    email: 'radha.sharma@school.edu.in',
    phone: '+91 98765 43210',
    school: 'Government Primary School, Sector 15',
    subjects: ['Mathematics', 'Science', 'Hindi'],
    grades: ['Class 3', 'Class 4', 'Class 5'],
    experience: '8 years',
    qualification: 'B.Ed, M.A. Mathematics',
    avatar: null,
  });

  const stats = {
    totalReflections: 47,
    completedTrainings: 12,
    communityPosts: 8,
    streakDays: 15,
    nepHours: 24.5,
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save profile logic here
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // Handle logout logic
          navigation.navigate('Login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: theme.colors.surface}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Profile" />
        <Appbar.Action
          icon={isEditing ? 'check' : 'edit'}
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar.Text
              size={80}
              label={userProfile.name
                .split(' ')
                .map(n => n[0])
                .join('')}
              style={{backgroundColor: theme.colors.primary}}
            />
            <View style={styles.profileInfo}>
              {isEditing ? (
                <TextInput
                  value={userProfile.name}
                  onChangeText={text =>
                    setUserProfile(prev => ({...prev, name: text}))
                  }
                  style={styles.nameInput}
                  mode="outlined"
                />
              ) : (
                <Text style={styles.name}>{userProfile.name}</Text>
              )}
              <Text style={styles.school}>{userProfile.school}</Text>
              <Text style={styles.experience}>
                {userProfile.experience} experience
              </Text>
            </View>
          </View>
        </Card>

        {/* Stats */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>My Progress</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalReflections}</Text>
              <Text style={styles.statLabel}>Reflections</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.completedTrainings}</Text>
              <Text style={styles.statLabel}>Trainings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.streakDays}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.nepHours}</Text>
              <Text style={styles.statLabel}>NEP Hours</Text>
            </View>
          </View>
        </Card>

        {/* Contact Information */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <List.Item
            title="Email"
            description={userProfile.email}
            left={() => <List.Icon icon="email" />}
            right={() =>
              isEditing ? (
                <Icon name="edit" size={20} color={theme.colors.outline} />
              ) : null
            }
          />

          <List.Item
            title="Phone"
            description={userProfile.phone}
            left={() => <List.Icon icon="phone" />}
            right={() =>
              isEditing ? (
                <Icon name="edit" size={20} color={theme.colors.outline} />
              ) : null
            }
          />

          <List.Item
            title="Qualification"
            description={userProfile.qualification}
            left={() => <List.Icon icon="school" />}
            right={() =>
              isEditing && (
                <Icon name="edit" size={20} color={theme.colors.outline} />
              )
            }
          />
        </Card>

        {/* Teaching Details */}
        <Card style={styles.teachingCard}>
          <Text style={styles.sectionTitle}>Teaching Details</Text>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Subjects</Text>
            <View style={styles.chipsContainer}>
              {userProfile.subjects.map((subject, index) => (
                <Chip
                  key={index}
                  style={styles.chip}
                  textStyle={styles.chipText}>
                  {subject}
                </Chip>
              ))}
              {isEditing && (
                <Chip
                  icon="plus"
                  style={[styles.chip, styles.addChip]}
                  textStyle={styles.chipText}
                  onPress={() => {}}>
                  Add
                </Chip>
              )}
            </View>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Grades</Text>
            <View style={styles.chipsContainer}>
              {userProfile.grades.map((grade, index) => (
                <Chip
                  key={index}
                  style={styles.chip}
                  textStyle={styles.chipText}>
                  {grade}
                </Chip>
              ))}
              {isEditing && (
                <Chip
                  icon="plus"
                  style={[styles.chip, styles.addChip]}
                  textStyle={styles.chipText}
                  onPress={() => {}}>
                  Add
                </Chip>
              )}
            </View>
          </View>
        </Card>

        {/* Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <List.Item
            title="Notifications"
            description="Receive push notifications"
            left={() => <List.Icon icon="notifications" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            )}
          />

          <List.Item
            title="Privacy Settings"
            description="Manage your privacy preferences"
            left={() => <List.Icon icon="security" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => navigation.navigate('Settings')}
          />

          <List.Item
            title="Language"
            description="English"
            left={() => <List.Icon icon="language" />}
            right={() => <List.Icon icon="chevron-right" />}
          />

          <List.Item
            title="Help & Support"
            description="Get help and contact support"
            left={() => <List.Icon icon="help" />}
            right={() => <List.Icon icon="chevron-right" />}
          />
        </Card>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            variant="secondary"
            size="large"
            fullWidth
            icon={<Icon name="backup" size={24} color={theme.colors.primary} />}
            onPress={() => {}}
            style={styles.actionButton}>
            Export My Data
          </Button>

          <Button
            variant="danger"
            size="large"
            fullWidth
            icon={
              <Icon
                name="logout"
                size={24}
                color={designTokens.colors.surface}
              />
            }
            onPress={handleLogout}
            style={styles.actionButton}>
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
    marginBottom: designTokens.spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: designTokens.spacing.md,
  },
  name: {
    ...mixins.text.h2,
    marginBottom: designTokens.spacing.xs,
  },
  nameInput: {
    marginBottom: designTokens.spacing.xs,
    backgroundColor: 'transparent',
  },
  school: {
    ...mixins.text.body2,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.xs,
  },
  experience: {
    ...mixins.text.caption,
    color: designTokens.colors.textSecondary,
  },
  statsCard: {
    marginBottom: designTokens.spacing.md,
  },
  sectionTitle: {
    ...mixins.text.h3,
    marginBottom: designTokens.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...mixins.text.h2,
    color: designTokens.colors.primary,
    marginBottom: designTokens.spacing.xs,
  },
  statLabel: {
    ...mixins.text.caption,
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: designTokens.spacing.md,
  },
  teachingCard: {
    marginBottom: designTokens.spacing.md,
  },
  detailSection: {
    marginBottom: designTokens.spacing.md,
  },
  detailLabel: {
    ...mixins.text.body2,
    fontWeight: designTokens.typography.weights.medium,
    marginBottom: designTokens.spacing.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: designTokens.spacing.sm,
  },
  chip: {
    backgroundColor: designTokens.colors.background,
  },
  addChip: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: designTokens.colors.outline,
    backgroundColor: 'transparent',
  },
  chipText: {
    ...mixins.text.caption,
  },
  settingsCard: {
    marginBottom: designTokens.spacing.lg,
  },
  actionsContainer: {
    gap: designTokens.spacing.md,
    paddingBottom: designTokens.spacing.xl,
  },
  actionButton: {
    marginBottom: designTokens.spacing.sm,
  },
});

export default ProfileScreen;
