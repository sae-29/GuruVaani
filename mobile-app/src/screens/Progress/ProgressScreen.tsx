import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {Text, Surface, ProgressBar, Card, Chip} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {designTokens, mixins} from '../../theme/designTokens';

const {width} = Dimensions.get('window');

interface Badge {
  id: string;
  name: string;
  icon: string;
  earnedDate: string;
  description: string;
  color: string;
}

interface ActivityStat {
  label: string;
  value: string;
  subtext: string;
  icon: string;
  color: string;
}

const ProgressScreen: React.FC = () => {
  const theme = useTheme();
  const [nepHours] = useState(32);
  const [nepGoal] = useState(50);
  const [streakDays] = useState(5);

  const badges: Badge[] = [
    {
      id: '1',
      name: 'Reflective Practitioner',
      icon: 'edit-note',
      earnedDate: 'Earned on 12 Jan',
      description: 'Complete 10 diary entries',
      color: designTokens.colors.primary,
    },
    {
      id: '2',
      name: 'Lifelong Learner',
      icon: 'school',
      earnedDate: 'Earned on 8 Jan',
      description: 'Complete 5 training modules',
      color: designTokens.colors.secondary,
    },
    {
      id: '3',
      name: 'Community Helper',
      icon: 'people',
      earnedDate: 'Earned on 5 Jan',
      description: 'Help 3 other teachers',
      color: designTokens.colors.accent,
    },
  ];

  const activityStats: ActivityStat[] = [
    {
      label: 'Entries',
      value: '42',
      subtext: 'This year',
      icon: 'edit-note',
      color: designTokens.colors.secondary,
    },
    {
      label: 'Completions',
      value: '18',
      subtext: 'Trainings completed',
      icon: 'check-circle',
      color: designTokens.colors.primary,
    },
    {
      label: 'Community',
      value: '12',
      subtext: 'Posts shared',
      icon: 'chat',
      color: designTokens.colors.accent,
    },
    {
      label: 'Streak',
      value: `${streakDays} days`,
      subtext: 'Current streak',
      icon: 'local-fire-department',
      color: '#FF7043',
    },
  ];

  const nepProgress = nepHours / nepGoal;
  const nepPercentage = Math.round(nepProgress * 100);

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      contentContainerStyle={styles.content}>
      {/* NEP CPD Hours Tracker */}
      <Card style={[styles.nepCard, {backgroundColor: theme.colors.primary}]}>
        <View style={styles.nepContent}>
          <View style={styles.nepHeader}>
            <Text
              style={[styles.nepTitle, {color: designTokens.colors.surface}]}>
              NEP 2020 CPD Hours
            </Text>
            <Text
              style={[
                styles.nepSubtitle,
                {color: designTokens.colors.surface},
              ]}>
              Annual requirement: 50 hours/year
            </Text>
          </View>
          <View style={styles.circularProgress}>
            <View style={styles.progressCircle}>
              <Text
                style={[styles.nepHours, {color: designTokens.colors.surface}]}>
                {nepHours}
              </Text>
              <Text
                style={[styles.nepTotal, {color: designTokens.colors.surface}]}>
                / {nepGoal}
              </Text>
            </View>
            <View style={styles.progressRing}>
              <ProgressBar
                progress={nepProgress}
                color={designTokens.colors.surface}
                style={styles.progressBar}
              />
            </View>
          </View>
          <Text
            style={[
              styles.nepPercentage,
              {color: designTokens.colors.surface},
            ]}>
            {nepPercentage}% toward annual goal
          </Text>
        </View>
      </Card>

      {/* Activity Summary */}
      <View style={styles.activityGrid}>
        {activityStats.map((stat, index) => (
          <Surface
            key={index}
            style={[styles.statCard, {backgroundColor: theme.colors.surface}]}>
            <Icon name={stat.icon} size={32} color={stat.color} />
            <Text style={[styles.statValue, {color: theme.colors.onSurface}]}>
              {stat.value}
            </Text>
            <Text
              style={[
                styles.statLabel,
                {color: theme.colors.onSurfaceVariant},
              ]}>
              {stat.label}
            </Text>
            <Text
              style={[
                styles.statSubtext,
                {color: theme.colors.onSurfaceVariant},
              ]}>
              {stat.subtext}
            </Text>
          </Surface>
        ))}
      </View>

      {/* Badges Earned */}
      <Card
        style={[styles.sectionCard, {backgroundColor: theme.colors.surface}]}>
        <Text style={[styles.sectionTitle, {color: theme.colors.onSurface}]}>
          Your Badges
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.badgesScroll}>
          {badges.map(badge => (
            <Surface
              key={badge.id}
              style={[
                styles.badgeCard,
                {backgroundColor: theme.colors.surfaceVariant},
              ]}>
              <View
                style={[
                  styles.badgeIconContainer,
                  {backgroundColor: badge.color + '20'},
                ]}>
                <Icon name={badge.icon} size={48} color={badge.color} />
              </View>
              <Text style={[styles.badgeName, {color: theme.colors.onSurface}]}>
                {badge.name}
              </Text>
              <Text
                style={[
                  styles.badgeDate,
                  {color: theme.colors.onSurfaceVariant},
                ]}>
                {badge.earnedDate}
              </Text>
            </Surface>
          ))}
          {/* Locked Badge Preview */}
          <Surface
            style={[
              styles.badgeCard,
              styles.lockedBadge,
              {backgroundColor: theme.colors.surfaceVariant},
            ]}>
            <View
              style={[
                styles.badgeIconContainer,
                {backgroundColor: theme.colors.outline + '20'},
              ]}>
              <Icon
                name="lock"
                size={48}
                color={theme.colors.onSurfaceVariant}
              />
            </View>
            <Text
              style={[
                styles.badgeName,
                {color: theme.colors.onSurfaceVariant},
              ]}>
              Math Master
            </Text>
            <Text
              style={[
                styles.badgeDate,
                {color: theme.colors.onSurfaceVariant},
              ]}>
              Complete 5 math trainings
            </Text>
          </Surface>
        </ScrollView>
      </Card>

      {/* Learning Path */}
      <Card
        style={[styles.sectionCard, {backgroundColor: theme.colors.surface}]}>
        <Text style={[styles.sectionTitle, {color: theme.colors.onSurface}]}>
          Your Learning Journey
        </Text>
        <View style={styles.timeline}>
          {[
            {name: 'Classroom Basics', status: 'completed', date: '10 Jan'},
            {name: 'Engaging Learners', status: 'completed', date: '15 Jan'},
            {
              name: 'Assessment Methods',
              status: 'current',
              date: 'In Progress',
            },
            {name: 'Advanced Pedagogy', status: 'upcoming', date: 'Upcoming'},
          ].map((node, index) => (
            <View key={index} style={styles.timelineNode}>
              <View
                style={[
                  styles.timelineDot,
                  {
                    backgroundColor:
                      node.status === 'completed'
                        ? designTokens.colors.secondary
                        : node.status === 'current'
                        ? designTokens.colors.primary
                        : theme.colors.outline,
                  },
                ]}>
                {node.status === 'completed' && (
                  <Icon
                    name="check"
                    size={16}
                    color={designTokens.colors.surface}
                  />
                )}
                {node.status === 'current' && (
                  <View style={styles.pulsingDot} />
                )}
              </View>
              {index < 3 && (
                <View
                  style={[
                    styles.timelineLine,
                    {
                      backgroundColor:
                        node.status === 'completed'
                          ? designTokens.colors.secondary
                          : theme.colors.outline,
                    },
                  ]}
                />
              )}
              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineName,
                    {color: theme.colors.onSurface},
                  ]}>
                  {node.name}
                </Text>
                <Text
                  style={[
                    styles.timelineDate,
                    {color: theme.colors.onSurfaceVariant},
                  ]}>
                  {node.date}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* Impact Stats */}
      <Card
        style={[styles.sectionCard, {backgroundColor: theme.colors.surface}]}>
        <Text style={[styles.sectionTitle, {color: theme.colors.onSurface}]}>
          Your Classroom Impact
        </Text>
        <View style={styles.impactContent}>
          <Text style={[styles.impactNumber, {color: theme.colors.primary}]}>
            15
          </Text>
          <Text style={[styles.impactText, {color: theme.colors.onSurface}]}>
            challenges resolved this year!
          </Text>
        </View>
        <View style={styles.chartPlaceholder}>
          <Text
            style={[styles.chartText, {color: theme.colors.onSurfaceVariant}]}>
            Issues reported vs resolved over months
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: designTokens.spacing.md,
  },
  nepCard: {
    marginBottom: designTokens.spacing.lg,
    padding: designTokens.spacing.xl,
    borderRadius: designTokens.borderRadius.card,
    ...designTokens.shadows.elevated,
  },
  nepContent: {
    alignItems: 'center',
  },
  nepHeader: {
    alignItems: 'center',
    marginBottom: designTokens.spacing.lg,
  },
  nepTitle: {
    ...mixins.text.h2,
    marginBottom: designTokens.spacing.xs,
  },
  nepSubtitle: {
    ...mixins.text.caption,
    opacity: 0.8,
  },
  circularProgress: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  progressCircle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nepHours: {
    ...mixins.text.h1,
    fontSize: designTokens.typography.sizes.xxl + 12,
    fontWeight: designTokens.typography.weights.semibold,
  },
  nepTotal: {
    ...mixins.text.h3,
    opacity: 0.8,
  },
  progressRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: designTokens.colors.surface + '40',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  nepPercentage: {
    ...mixins.text.body1,
    fontWeight: designTokens.typography.weights.medium,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: designTokens.spacing.lg,
  },
  statCard: {
    width: (width - designTokens.spacing.md * 3) / 2,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.card,
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
    ...designTokens.shadows.card,
  },
  statValue: {
    ...mixins.text.h2,
    marginTop: designTokens.spacing.sm,
  },
  statLabel: {
    ...mixins.text.body2,
    marginTop: designTokens.spacing.xs,
    fontWeight: designTokens.typography.weights.medium,
  },
  statSubtext: {
    ...mixins.text.caption,
    marginTop: designTokens.spacing.xs / 2,
  },
  sectionCard: {
    marginBottom: designTokens.spacing.lg,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.card,
    ...designTokens.shadows.card,
  },
  sectionTitle: {
    ...mixins.text.h3,
    marginBottom: designTokens.spacing.md,
  },
  badgesScroll: {
    marginHorizontal: -designTokens.spacing.md,
  },
  badgeCard: {
    width: 140,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.card,
    alignItems: 'center',
    marginRight: designTokens.spacing.md,
    ...designTokens.shadows.card,
  },
  lockedBadge: {
    opacity: 0.6,
  },
  badgeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  badgeName: {
    ...mixins.text.body2,
    fontWeight: designTokens.typography.weights.medium,
    textAlign: 'center',
    marginBottom: designTokens.spacing.xs,
  },
  badgeDate: {
    ...mixins.text.caption,
    textAlign: 'center',
  },
  timeline: {
    marginTop: designTokens.spacing.md,
  },
  timelineNode: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: designTokens.spacing.lg,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.spacing.md,
  },
  pulsingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: designTokens.colors.surface,
  },
  timelineLine: {
    position: 'absolute',
    left: 15,
    top: 32,
    width: 2,
    height: 40,
  },
  timelineContent: {
    flex: 1,
    paddingTop: designTokens.spacing.xs,
  },
  timelineName: {
    ...mixins.text.body1,
    fontWeight: designTokens.typography.weights.medium,
    marginBottom: designTokens.spacing.xs / 2,
  },
  timelineDate: {
    ...mixins.text.caption,
  },
  impactContent: {
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  impactNumber: {
    ...mixins.text.h1,
    fontSize: designTokens.typography.sizes.xxl + 16,
    fontWeight: designTokens.typography.weights.semibold,
    marginBottom: designTokens.spacing.sm,
  },
  impactText: {
    ...mixins.text.body1,
    textAlign: 'center',
  },
  chartPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: designTokens.colors.background,
    borderRadius: designTokens.borderRadius.card,
    marginTop: designTokens.spacing.md,
  },
  chartText: {
    ...mixins.text.body2,
    textAlign: 'center',
  },
});

export default ProgressScreen;
