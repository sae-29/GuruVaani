import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {
  Appbar,
  Text,
  Chip,
  ProgressBar,
  IconButton,
  Surface,
  Divider,
} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {designTokens, mixins} from '../../theme/designTokens';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const {width} = Dimensions.get('window');

const ModuleDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock data - in real app, this would come from route params or Redux
  const module = {
    id: '1',
    title: 'Effective Classroom Management Strategies',
    description:
      'Learn proven techniques to create a positive learning environment, manage student behavior, and maximize instructional time. This comprehensive module covers everything from setting clear expectations to handling challenging situations with confidence.',
    duration: 45, // minutes
    difficulty: 'INTERMEDIATE',
    subjects: ['General', 'All Subjects'],
    grades: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    topics: [
      'Classroom Management',
      'Student Behavior',
      'Learning Environment',
    ],
    thumbnailUrl: null,
    videoUrl: 'https://example.com/video.mp4',
    materials: [
      'Classroom Management Checklist',
      'Behavior Tracking Sheet',
      'Parent Communication Templates',
      'Positive Reinforcement Ideas',
    ],
    avgRating: 4.7,
    totalRatings: 156,
    completionRate: 89,
    progress: 0,
    isBookmarked: false,
    instructor: 'Dr. Priya Sharma',
    instructorBio:
      'Educational Psychology Expert with 15+ years of experience in teacher training.',
    learningObjectives: [
      'Establish clear classroom rules and procedures',
      'Implement positive behavior management strategies',
      'Handle disruptive behavior effectively',
      'Create an inclusive learning environment',
      'Communicate effectively with students and parents',
    ],
    modules: [
      {
        title: 'Introduction to Classroom Management',
        duration: 8,
        completed: false,
      },
      {
        title: 'Setting Expectations and Rules',
        duration: 12,
        completed: false,
      },
      {
        title: 'Positive Reinforcement Techniques',
        duration: 10,
        completed: false,
      },
      {
        title: 'Handling Challenging Behaviors',
        duration: 15,
        completed: false,
      },
    ],
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return theme.colors.primary;
      case 'INTERMEDIATE':
        return '#FF9800';
      case 'ADVANCED':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Handle bookmark logic
  };

  const handleStartModule = () => {
    // Navigate to video player or first lesson
    console.log('Starting module...');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="star" size={16} color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="star-half" size={16} color="#FFD700" />,
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon
          key={`empty-${i}`}
          name="star-border"
          size={16}
          color="#FFD700"
        />,
      );
    }

    return stars;
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: theme.colors.surface}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Training Module" />
        <Appbar.Action
          icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          onPress={handleBookmark}
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{module.title}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Icon name="schedule" size={16} color={theme.colors.outline} />
                <Text style={styles.metaText}>{module.duration} min</Text>
              </View>
              <Chip
                style={[
                  styles.difficultyChip,
                  {backgroundColor: getDifficultyColor(module.difficulty)},
                ]}
                textStyle={styles.difficultyText}>
                {module.difficulty}
              </Chip>
            </View>

            <View style={styles.ratingRow}>
              <View style={styles.starsContainer}>
                {renderStars(module.avgRating)}
              </View>
              <Text style={styles.ratingText}>
                {module.avgRating} ({module.totalRatings} reviews)
              </Text>
            </View>

            <Text style={styles.description}>{module.description}</Text>
          </View>
        </Card>

        {/* Progress Card */}
        {module.progress > 0 && (
          <Card style={styles.progressCard}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.progressContent}>
              <Text style={styles.progressText}>
                {module.progress}% Complete
              </Text>
              <ProgressBar
                progress={module.progress / 100}
                color={theme.colors.primary}
                style={styles.progressBar}
              />
            </View>
          </Card>
        )}

        {/* Instructor Card */}
        <Card style={styles.instructorCard}>
          <Text style={styles.sectionTitle}>Instructor</Text>
          <View style={styles.instructorContent}>
            <View style={styles.instructorInfo}>
              <Text style={styles.instructorName}>{module.instructor}</Text>
              <Text style={styles.instructorBio}>{module.instructorBio}</Text>
            </View>
          </View>
        </Card>

        {/* Learning Objectives */}
        <Card style={styles.objectivesCard}>
          <Text style={styles.sectionTitle}>What You'll Learn</Text>
          {module.learningObjectives.map((objective, index) => (
            <View key={index} style={styles.objectiveItem}>
              <Icon
                name="check-circle"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.objectiveText}>{objective}</Text>
            </View>
          ))}
        </Card>

        {/* Module Content */}
        <Card style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Module Content</Text>
          {module.modules.map((lesson, index) => (
            <View key={index}>
              <View style={styles.lessonItem}>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonDuration}>
                    {lesson.duration} min
                  </Text>
                </View>
                <Icon
                  name={
                    lesson.completed ? 'check-circle' : 'play-circle-outline'
                  }
                  size={24}
                  color={
                    lesson.completed
                      ? theme.colors.primary
                      : theme.colors.outline
                  }
                />
              </View>
              {index < module.modules.length - 1 && (
                <Divider style={styles.lessonDivider} />
              )}
            </View>
          ))}
        </Card>

        {/* Materials */}
        <Card style={styles.materialsCard}>
          <Text style={styles.sectionTitle}>Course Materials</Text>
          {module.materials.map((material, index) => (
            <View key={index} style={styles.materialItem}>
              <Icon name="description" size={20} color={theme.colors.outline} />
              <Text style={styles.materialText}>{material}</Text>
              <Icon name="download" size={20} color={theme.colors.primary} />
            </View>
          ))}
        </Card>

        {/* Tags */}
        <Card style={styles.tagsCard}>
          <Text style={styles.sectionTitle}>Topics Covered</Text>
          <View style={styles.tagsContainer}>
            {module.topics.map((topic, index) => (
              <Chip
                key={index}
                style={styles.topicChip}
                textStyle={styles.topicText}>
                {topic}
              </Chip>
            ))}
          </View>
        </Card>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            icon={
              <Icon
                name="play-arrow"
                size={24}
                color={designTokens.colors.surface}
              />
            }
            onPress={handleStartModule}
            style={styles.startButton}>
            {module.progress > 0 ? 'Continue Learning' : 'Start Module'}
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
  headerCard: {
    marginBottom: designTokens.spacing.md,
  },
  headerContent: {
    gap: designTokens.spacing.sm,
  },
  title: {
    ...mixins.text.h2,
    lineHeight:
      designTokens.typography.lineHeights.tight *
      designTokens.typography.sizes.xl,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.xs,
  },
  metaText: {
    ...mixins.text.caption,
    color: designTokens.colors.textSecondary,
  },
  difficultyChip: {
    paddingHorizontal: designTokens.spacing.sm,
  },
  difficultyText: {
    ...mixins.text.caption,
    color: designTokens.colors.surface,
    fontWeight: designTokens.typography.weights.medium,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    ...mixins.text.caption,
    color: designTokens.colors.textSecondary,
  },
  description: {
    ...mixins.text.body1,
    lineHeight:
      designTokens.typography.lineHeights.relaxed *
      designTokens.typography.sizes.base,
  },
  progressCard: {
    marginBottom: designTokens.spacing.md,
  },
  progressContent: {
    gap: designTokens.spacing.sm,
  },
  progressText: {
    ...mixins.text.body2,
    fontWeight: designTokens.typography.weights.medium,
  },
  progressBar: {
    height: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.button / 2,
  },
  instructorCard: {
    marginBottom: designTokens.spacing.md,
  },
  instructorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    ...mixins.text.body1,
    fontWeight: designTokens.typography.weights.medium,
    marginBottom: designTokens.spacing.xs,
  },
  instructorBio: {
    ...mixins.text.body2,
    color: designTokens.colors.textSecondary,
  },
  objectivesCard: {
    marginBottom: designTokens.spacing.md,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.sm,
  },
  objectiveText: {
    ...mixins.text.body2,
    flex: 1,
    lineHeight:
      designTokens.typography.lineHeights.normal *
      designTokens.typography.sizes.sm,
  },
  contentCard: {
    marginBottom: designTokens.spacing.md,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: designTokens.spacing.sm,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    ...mixins.text.body2,
    fontWeight: designTokens.typography.weights.medium,
    marginBottom: designTokens.spacing.xs / 2,
  },
  lessonDuration: {
    ...mixins.text.caption,
    color: designTokens.colors.textSecondary,
  },
  lessonDivider: {
    marginVertical: designTokens.spacing.xs,
  },
  materialsCard: {
    marginBottom: designTokens.spacing.md,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.sm,
  },
  materialText: {
    ...mixins.text.body2,
    flex: 1,
  },
  tagsCard: {
    marginBottom: designTokens.spacing.lg,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: designTokens.spacing.sm,
  },
  topicChip: {
    backgroundColor: designTokens.colors.background,
  },
  topicText: {
    ...mixins.text.caption,
  },
  sectionTitle: {
    ...mixins.text.h3,
    marginBottom: designTokens.spacing.md,
  },
  actionContainer: {
    paddingBottom: designTokens.spacing.xl,
  },
  startButton: {
    marginBottom: designTokens.spacing.sm,
  },
});

export default ModuleDetailScreen;
