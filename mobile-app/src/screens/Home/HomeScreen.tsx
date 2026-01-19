import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  Appbar,
  Title,
  Paragraph,
  Chip,
  Badge,
  Surface,
  Text,
  IconButton,
  ProgressBar,
} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {designTokens, mixins} from '../../theme/designTokens';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const {width} = Dimensions.get('window');

interface QuickStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

interface RecentActivity {
  id: string;
  type: 'entry' | 'training' | 'badge';
  title: string;
  subtitle: string;
  timestamp: string;
  icon: string;
}

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<
    'synced' | 'syncing' | 'offline'
  >('synced');
  const [userName] = useState('Radha'); // This would come from user context
  const [streakDays] = useState(5);
  const [nepHours] = useState(12.5);

  const quickStats: QuickStat[] = [
    {
      label: 'Reflections',
      value: '14',
      icon: 'edit-note',
      color: designTokens.colors.primary,
    },
    {
      label: 'Growth Journey',
      value: '8',
      icon: 'school',
      color: designTokens.colors.secondary,
    },
    {label: 'Milestones', value: '3', icon: 'stars', color: '#FFD700'},
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'entry',
      title: 'Class 4 Math Division',
      subtitle: 'Try "Fun with Fractions" next?',
      timestamp: 'Yesterday',
      icon: 'edit-note',
    },
    {
      id: '2',
      type: 'training',
      title: 'Classroom Management',
      subtitle: 'Completed • Rated 5 stars',
      timestamp: '2 days ago',
      icon: 'school',
    },
    {
      id: '3',
      type: 'badge',
      title: 'Reflective Practitioner',
      subtitle: 'Week 1 milestone achieved',
      timestamp: '3 days ago',
      icon: 'stars',
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'synced':
        return {name: 'cloud-done', color: designTokens.colors.primary};
      case 'syncing':
        return {name: 'cloud-sync', color: designTokens.colors.secondary};
      case 'offline':
        return {name: 'cloud-off', color: designTokens.colors.textSecondary};
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'synced':
        return 'Saved safely online';
      case 'syncing':
        return 'Syncing your thoughts...';
      case 'offline':
        return 'Offline • Work is safe';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: designTokens.colors.background},
      ]}>
      {/* App Bar */}
      <Appbar.Header
        style={{
          backgroundColor: designTokens.colors.background,
          elevation: 0,
        }}>
        <View style={styles.headerContent}>
          <View>
            <Text
              style={[
                styles.greeting,
                {color: designTokens.colors.textPrimary},
              ]}>
              Namaste, {userName} 🙏
            </Text>
            <Text
              style={{color: designTokens.colors.textSecondary, fontSize: 14}}>
              Ready to reflect today?
            </Text>
            <View style={styles.syncStatus}>
              <Icon
                name={getSyncStatusIcon().name}
                size={16}
                color={getSyncStatusIcon().color}
              />
              <Text
                style={[
                  styles.syncText,
                  {color: designTokens.colors.textSecondary},
                ]}>
                {getSyncStatusText()}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <IconButton
              icon="notifications-none"
              size={28}
              color={designTokens.colors.textPrimary}
              onPress={() => {}}
            />
            <Badge visible={true} size={8} style={styles.notificationBadge}>
              3
            </Badge>
          </View>
        </View>
      </Appbar.Header>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[designTokens.colors.primary]}
          />
        }>
        {/* Streak & Progress Section */}
        <Card style={styles.streakCard} imperfectionLevel="low" variant="soft">
          <View style={styles.streakContent}>
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>{streakDays}</Text>
              <Text style={styles.streakLabel}>Day Streak! 🔥</Text>
            </View>
            <View style={styles.nepProgress}>
              <Text style={styles.nepLabel}>NEP Hours: {nepHours}/50</Text>
              <ProgressBar
                progress={nepHours / 50}
                color={designTokens.colors.secondary}
                style={styles.progressBar}
              />
            </View>
          </View>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {quickStats.map((stat, index) => (
            <Card
              key={index}
              style={styles.statCard}
              imperfectionLevel="low"
              padding="small">
              <Icon name={stat.icon} size={28} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        {/* Primary Actions */}
        <View style={styles.actionsContainer}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            icon={
              <Icon name="edit" size={24} color={designTokens.colors.surface} />
            }
            onPress={() => navigation.navigate('CreateEntry')}
            style={styles.primaryAction}>
            Share a Moment
          </Button>

          <View style={styles.secondaryActions}>
            <Button
              variant="secondary"
              size="medium"
              style={styles.secondaryAction}
              onPress={() => navigation.navigate('Training')}>
              My Journey
            </Button>
            <Button
              variant="secondary"
              size="medium"
              style={styles.secondaryAction}
              onPress={() => navigation.navigate('Community')}>
              Teacher Circle
            </Button>
          </View>
        </View>

        {/* Pending Tasks -> For You (Personalized) */}
        <Card
          style={styles.sectionCard}
          imperfectionLevel="medium"
          variant="elevated">
          <Title style={styles.sectionTitle}>For You ✨</Title>
          <View style={styles.taskItem}>
            <Icon
              name="lightbulb"
              size={24}
              color={designTokens.colors.warning}
            />
            <Text style={styles.taskText}>
              2 ideas for your classroom based on your last reflection.
            </Text>
          </View>
          <Button
            variant="ghost"
            onPress={() => navigation.navigate('Training')}
            style={styles.viewAllButton}>
            Explore Ideas
          </Button>
        </Card>

        {/* Recent Activity -> Broken Grid */}
        <View style={styles.sectionContainer}>
          <Title style={[styles.sectionTitle, {marginLeft: 4}]}>
            Recent Moments
          </Title>
          {recentActivities.map(activity => (
            <Card
              key={activity.id}
              style={styles.activityCard}
              variant="soft"
              imperfectionLevel="low">
              <View style={styles.activityItem}>
                <Icon
                  name={activity.icon}
                  size={24}
                  color={designTokens.colors.primary}
                  style={styles.activityIcon}
                />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activitySubtitle}>
                    {activity.subtitle}
                  </Text>
                </View>
                <Text style={styles.activityTime}>{activity.timestamp}</Text>
              </View>
            </Card>
          ))}
        </View>
        <View style={{height: 24}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...mixins.layout.container,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.md,
  },
  greeting: {
    ...mixins.text.h3,
    color: designTokens.colors.textPrimary,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: designTokens.spacing.xs / 2,
  },
  syncText: {
    ...mixins.text.caption,
    marginLeft: designTokens.spacing.xs,
  },
  headerActions: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: designTokens.spacing.sm,
    right: designTokens.spacing.sm,
  },
  content: {
    flex: 1,
    padding: designTokens.spacing.md,
  },
  streakCard: {
    marginBottom: designTokens.spacing.md,
  },
  streakContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakInfo: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: designTokens.typography.sizes.xxl + 4,
    fontWeight: designTokens.typography.weights.semibold,
    color: designTokens.colors.secondary,
  },
  streakLabel: {
    ...mixins.text.body2,
    fontWeight: designTokens.typography.weights.medium,
  },
  nepProgress: {
    flex: 1,
    marginLeft: designTokens.spacing.lg,
  },
  nepLabel: {
    ...mixins.text.body2,
    marginBottom: designTokens.spacing.sm,
  },
  progressBar: {
    height: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.button / 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: designTokens.spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: designTokens.spacing.xs,
    // Shadow and radius handled by Card component now
  },
  statValue: {
    ...mixins.text.h2,
    marginTop: designTokens.spacing.sm,
    color: designTokens.colors.textPrimary,
  },
  statLabel: {
    ...mixins.text.caption,
    marginTop: designTokens.spacing.xs,
    opacity: 0.8,
    color: designTokens.colors.textSecondary,
  },
  actionsContainer: {
    marginBottom: designTokens.spacing.lg,
  },
  primaryAction: {
    marginBottom: designTokens.spacing.md,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryAction: {
    flex: 1,
    marginHorizontal: designTokens.spacing.xs,
  },
  sectionCard: {
    marginBottom: designTokens.spacing.lg,
  },
  sectionContainer: {
    marginBottom: designTokens.spacing.lg,
  },
  sectionTitle: {
    ...mixins.text.h3,
    marginBottom: designTokens.spacing.md,
    color: designTokens.colors.textPrimary,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm + 4,
  },
  taskText: {
    ...mixins.text.body1,
    marginLeft: designTokens.spacing.md,
    flex: 1,
    color: designTokens.colors.textPrimary,
    lineHeight: 22,
  },
  viewAllButton: {
    alignSelf: 'flex-start',
    marginTop: designTokens.spacing.sm,
  },
  activityCard: {
    marginBottom: designTokens.spacing.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.xs,
  },
  activityIcon: {
    marginRight: designTokens.spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...mixins.text.body1,
    fontWeight: designTokens.typography.weights.medium,
    color: designTokens.colors.textPrimary,
  },
  activitySubtitle: {
    ...mixins.text.caption,
    color: designTokens.colors.textSecondary,
    marginTop: 2,
  },
  activityTime: {
    ...mixins.text.caption,
    color: designTokens.colors.textSecondary,
    marginLeft: designTokens.spacing.sm,
  },
});

export default HomeScreen;
