import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Share, Alert} from 'react-native';
import {
  Appbar,
  Text,
  Chip,
  Divider,
  IconButton,
  Menu,
  Card,
  List,
} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {designTokens, mixins} from '../../theme/designTokens';
import Button from '../../components/common/Button';

interface ReflectionDetailProps {
  reflection: {
    id: string;
    title: string;
    content: string;
    subject: string;
    grade: string;
    topic?: string;
    mood: string;
    tags: string[];
    createdAt: string;
    sentiment?: number;
    aiSuggestions?: string[];
  };
}

const ReflectionDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [menuVisible, setMenuVisible] = useState(false);

  // Mock data - in real app, this would come from route params or Redux
  const reflection = {
    id: '1',
    title: 'Math Division - Class 4',
    content:
      'Today I taught division to my Class 4 students. Many students struggled with the concept of remainders. I used visual aids like blocks and drawings, but some students still seemed confused. I think I need to find more engaging ways to explain this concept. Maybe using real-world examples like sharing sweets among friends would help.',
    subject: 'Mathematics',
    grade: 'Class 4',
    topic: 'Division with Remainders',
    mood: 'FRUSTRATED',
    tags: ['division', 'visual-aids', 'struggling-students'],
    createdAt: '2024-01-15T10:30:00Z',
    sentiment: -0.2,
    aiSuggestions: [
      'Try using manipulatives like counting blocks or beans',
      'Consider peer tutoring - pair struggling students with those who understand',
      "Use story problems that relate to students' daily experiences",
    ],
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'HAPPY':
        return theme.colors.primary;
      case 'EXCITED':
        return '#FFD700';
      case 'NEUTRAL':
        return theme.colors.outline;
      case 'FRUSTRATED':
        return theme.colors.error;
      case 'CONFUSED':
        return '#FF9800';
      default:
        return theme.colors.outline;
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'HAPPY':
        return 'sentiment-satisfied';
      case 'EXCITED':
        return 'sentiment-very-satisfied';
      case 'NEUTRAL':
        return 'sentiment-neutral';
      case 'FRUSTRATED':
        return 'sentiment-dissatisfied';
      case 'CONFUSED':
        return 'help-outline';
      default:
        return 'sentiment-neutral';
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${reflection.title}\n\n${reflection.content}`,
        title: 'Teaching Reflection',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleEdit = () => {
    navigation.navigate('CreateEntry', {reflectionId: reflection.id});
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Reflection',
      'Are you sure you want to delete this reflection? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle delete logic
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: theme.colors.surface}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Reflection Details" />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="more-vert"
              onPress={() => setMenuVisible(true)}
            />
          }>
          <Menu.Item onPress={handleEdit} title="Edit" leadingIcon="edit" />
          <Menu.Item onPress={handleShare} title="Share" leadingIcon="share" />
          <Divider />
          <Menu.Item
            onPress={handleDelete}
            title="Delete"
            leadingIcon="delete"
            titleStyle={{color: theme.colors.error}}
          />
        </Menu>
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Header Info */}
        <Card style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>{reflection.title}</Text>
              <Text style={styles.metadata}>
                {reflection.subject} • {reflection.grade}
                {reflection.topic && ` • ${reflection.topic}`}
              </Text>
              <Text style={styles.date}>
                {new Date(reflection.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>

            <View style={styles.moodSection}>
              <Icon
                name={getMoodIcon(reflection.mood)}
                size={32}
                color={getMoodColor(reflection.mood)}
              />
              <Text
                style={[
                  styles.moodText,
                  {color: getMoodColor(reflection.mood)},
                ]}>
                {reflection.mood.toLowerCase()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Tags */}
        {reflection.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsRow}>
              {reflection.tags.map((tag, index) => (
                <Chip key={index} style={styles.tag} textStyle={styles.tagText}>
                  {tag}
                </Chip>
              ))}
            </View>
          </View>
        )}

        {/* Content */}
        <Card style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Reflection</Text>
          <Text style={styles.reflectionContent}>{reflection.content}</Text>
        </Card>

        {/* AI Suggestions */}
        {reflection.aiSuggestions && reflection.aiSuggestions.length > 0 && (
          <Card style={styles.suggestionsCard}>
            <View style={styles.suggestionsHeader}>
              <Icon
                name="lightbulb-outline"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>AI Suggestions</Text>
            </View>
            {reflection.aiSuggestions.map((suggestion, index) => (
              <List.Item
                key={index}
                title={suggestion}
                titleNumberOfLines={3}
                left={() => (
                  <View style={styles.bulletPoint}>
                    <View
                      style={[
                        styles.bullet,
                        {backgroundColor: theme.colors.primary},
                      ]}
                    />
                  </View>
                )}
                titleStyle={styles.suggestionText}
              />
            ))}
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            icon={
              <Icon
                name="school"
                size={24}
                color={designTokens.colors.surface}
              />
            }
            onPress={() => navigation.navigate('Training')}
            style={styles.actionButton}>
            Find Related Training
          </Button>

          <Button
            variant="secondary"
            size="large"
            fullWidth
            icon={<Icon name="people" size={24} color={theme.colors.primary} />}
            onPress={() => navigation.navigate('Community')}
            style={styles.actionButton}>
            Share with Community
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
    marginRight: designTokens.spacing.md,
  },
  title: {
    ...mixins.text.h2,
    marginBottom: designTokens.spacing.xs,
  },
  metadata: {
    ...mixins.text.body2,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.xs,
  },
  date: {
    ...mixins.text.caption,
    color: designTokens.colors.textSecondary,
  },
  moodSection: {
    alignItems: 'center',
  },
  moodText: {
    ...mixins.text.caption,
    marginTop: designTokens.spacing.xs,
    textTransform: 'capitalize',
  },
  tagsContainer: {
    marginBottom: designTokens.spacing.md,
  },
  sectionTitle: {
    ...mixins.text.h3,
    marginBottom: designTokens.spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: designTokens.spacing.sm,
  },
  tag: {
    backgroundColor: designTokens.colors.background,
  },
  tagText: {
    ...mixins.text.caption,
  },
  contentCard: {
    marginBottom: designTokens.spacing.md,
  },
  reflectionContent: {
    ...mixins.text.body1,
    lineHeight:
      designTokens.typography.lineHeights.relaxed *
      designTokens.typography.sizes.base,
  },
  suggestionsCard: {
    marginBottom: designTokens.spacing.lg,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  bulletPoint: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  suggestionText: {
    ...mixins.text.body2,
    lineHeight:
      designTokens.typography.lineHeights.normal *
      designTokens.typography.sizes.sm,
  },
  actionsContainer: {
    gap: designTokens.spacing.md,
    paddingBottom: designTokens.spacing.xl,
  },
  actionButton: {
    marginBottom: designTokens.spacing.sm,
  },
});

export default ReflectionDetailScreen;
