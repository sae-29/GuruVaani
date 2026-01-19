import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {Appbar, Text, Chip, SearchBar, Badge} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {designTokens, mixins} from '../../theme/designTokens';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const {width} = Dimensions.get('window');

interface TrainingModule {
  id: string;
  title: string;
  duration: number;
  format: 'video' | 'audio' | 'text';
  rating: number;
  reviewCount: number;
  isDownloaded: boolean;
  isCompleted: boolean;
  progress?: number;
  subjects: string[];
  grades: string[];
  thumbnailColor: string;
  isRecommended?: boolean;
}

const TrainingScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<
    'forYou' | 'all' | 'downloaded'
  >('forYou');

  const modules: TrainingModule[] = [
    {
      id: '1',
      title: 'Visualizing Fraction Operations',
      duration: 8,
      format: 'video',
      rating: 4.6,
      reviewCount: 23,
      isDownloaded: true,
      isCompleted: false,
      progress: 0,
      subjects: ['Math'],
      grades: ['4', '5'],
      thumbnailColor: designTokens.colors.primary,
      isRecommended: true,
    },
    {
      id: '2',
      title: 'Engaging Reluctant Learners',
      duration: 12,
      format: 'video',
      rating: 4.7,
      reviewCount: 42,
      isDownloaded: false,
      isCompleted: true,
      subjects: ['General'],
      grades: ['All'],
      thumbnailColor: designTokens.colors.secondary,
    },
    {
      id: '3',
      title: 'Classroom Management Basics',
      duration: 5,
      format: 'audio',
      rating: 4.8,
      reviewCount: 56,
      isDownloaded: true,
      isCompleted: true,
      subjects: ['General'],
      grades: ['All'],
      thumbnailColor: designTokens.colors.accent,
    },
    {
      id: '4',
      title: 'Science Inquiry Methods',
      duration: 15,
      format: 'text',
      rating: 4.4,
      reviewCount: 18,
      isDownloaded: false,
      isCompleted: false,
      subjects: ['Science'],
      grades: ['6', '7', '8'],
      thumbnailColor: designTokens.colors.success,
    },
  ];

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      selectedTab === 'all' ||
      (selectedTab === 'forYou' && module.isRecommended) ||
      (selectedTab === 'downloaded' && module.isDownloaded);

    return matchesSearch && matchesTab;
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video':
        return 'play-circle-outline';
      case 'audio':
        return 'headphones';
      case 'text':
        return 'article';
      default:
        return 'school';
    }
  };

  const renderModule = (module: TrainingModule) => (
    <Card
      key={module.id}
      style={styles.moduleCard}
      interactive
      onPress={() =>
        navigation.navigate('ModuleDetail', {moduleId: module.id})
      }>
      {/* Thumbnail */}
      <View
        style={[styles.thumbnail, {backgroundColor: module.thumbnailColor}]}>
        <Icon
          name={getFormatIcon(module.format)}
          size={32}
          color={designTokens.colors.surface}
        />
        {module.isDownloaded && (
          <View style={styles.downloadBadge}>
            <Icon
              name="download-done"
              size={16}
              color={designTokens.colors.success}
            />
          </View>
        )}
        {module.isRecommended && (
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>For You</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.moduleContent}>
        <Text style={styles.moduleTitle} numberOfLines={2}>
          {module.title}
        </Text>

        <View style={styles.moduleMetaRow}>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{module.duration} min</Text>
          </View>
          <Icon
            name={getFormatIcon(module.format)}
            size={16}
            color={designTokens.colors.textSecondary}
          />
        </View>

        <View style={styles.tagsRow}>
          {module.subjects.slice(0, 2).map((subject, index) => (
            <Chip key={index} style={styles.subjectTag}>
              <Text style={styles.tagText}>{subject}</Text>
            </Chip>
          ))}
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.rating}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>
              {module.rating} ({module.reviewCount})
            </Text>
          </View>
          {module.isCompleted && (
            <View style={styles.completedBadge}>
              <Icon
                name="check-circle"
                size={16}
                color={designTokens.colors.success}
              />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>

        {module.progress !== undefined && module.progress > 0 && (
          <View style={styles.progressContainer}>
            <View
              style={[styles.progressBar, {width: `${module.progress}%`}]}
            />
          </View>
        )}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Training Library" />
        <Appbar.Action icon="search" onPress={() => {}} />
      </Appbar.Header>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search trainings..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            {
              key: 'forYou',
              label: 'For You',
              count: modules.filter(m => m.isRecommended).length,
            },
            {key: 'all', label: 'All Trainings', count: modules.length},
            {
              key: 'downloaded',
              label: 'Downloaded',
              count: modules.filter(m => m.isDownloaded).length,
            },
          ].map(tab => (
            <Button
              key={tab.key}
              variant={selectedTab === tab.key ? 'primary' : 'ghost'}
              size="small"
              onPress={() => setSelectedTab(tab.key as any)}
              style={styles.tabButton}>
              {tab.label}
              {tab.count > 0 && (
                <Badge style={styles.tabBadge}>{tab.count}</Badge>
              )}
            </Button>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.modulesGrid}>
          {filteredModules.length > 0 ? (
            filteredModules.map(renderModule)
          ) : (
            <View style={styles.emptyState}>
              <Icon
                name="school"
                size={64}
                color={designTokens.colors.disabled}
              />
              <Text style={styles.emptyTitle}>No modules found yet</Text>
              <Text style={styles.emptySubtitle}>
                Try exploring different topics
              </Text>
              <Button
                variant="secondary"
                onPress={() => {
                  setSearchQuery('');
                  setSelectedTab('all');
                }}
                style={styles.emptyButton}>
                Explore All Modules
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...mixins.layout.container,
  },
  searchContainer: {
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.surface,
  },
  searchBar: {
    backgroundColor: designTokens.colors.background,
    borderRadius: designTokens.borderRadius.button,
  },
  searchInput: {
    fontSize: designTokens.typography.sizes.base,
  },
  tabContainer: {
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.outline,
  },
  tabButton: {
    marginRight: designTokens.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBadge: {
    marginLeft: designTokens.spacing.xs,
    backgroundColor: designTokens.colors.secondary,
  },
  content: {
    flex: 1,
    padding: designTokens.spacing.md,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: (width - designTokens.spacing.md * 3) / 2,
    marginBottom: designTokens.spacing.md,
    padding: 0,
  },
  thumbnail: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderTopLeftRadius: designTokens.borderRadius.card,
    borderTopRightRadius: designTokens.borderRadius.card,
  },
  downloadBadge: {
    position: 'absolute',
    top: designTokens.spacing.sm,
    right: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.surface,
    borderRadius: designTokens.borderRadius.pill,
    padding: designTokens.spacing.xs,
  },
  recommendedBadge: {
    position: 'absolute',
    top: designTokens.spacing.sm,
    left: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.warning,
    borderRadius: designTokens.borderRadius.button,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
  },
  recommendedText: {
    color: designTokens.colors.surface,
    fontSize: designTokens.typography.sizes.xs,
    fontWeight: designTokens.typography.weights.medium,
  },
  moduleContent: {
    padding: designTokens.spacing.sm,
  },
  moduleTitle: {
    ...mixins.text.body2,
    fontWeight: designTokens.typography.weights.medium,
    marginBottom: designTokens.spacing.sm,
    minHeight: 32, // Ensure consistent height
  },
  moduleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: designTokens.spacing.sm,
  },
  durationBadge: {
    backgroundColor: designTokens.colors.primary,
    borderRadius: designTokens.borderRadius.pill,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
  },
  durationText: {
    color: designTokens.colors.surface,
    fontSize: designTokens.typography.sizes.xs,
    fontWeight: designTokens.typography.weights.medium,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.xs,
  },
  subjectTag: {
    height: 20,
    backgroundColor: designTokens.colors.background,
  },
  tagText: {
    fontSize: designTokens.typography.sizes.xs,
    color: designTokens.colors.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.xs,
  },
  ratingText: {
    ...mixins.text.caption,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.xs,
  },
  completedText: {
    ...mixins.text.caption,
    color: designTokens.colors.success,
  },
  progressContainer: {
    height: 4,
    backgroundColor: designTokens.colors.outline,
    borderRadius: 2,
    marginTop: designTokens.spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: designTokens.colors.primary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: designTokens.spacing.xxl,
    width: '100%',
  },
  emptyTitle: {
    ...mixins.text.h3,
    marginTop: designTokens.spacing.md,
    marginBottom: designTokens.spacing.sm,
  },
  emptySubtitle: {
    ...mixins.text.body2,
    textAlign: 'center',
    marginBottom: designTokens.spacing.lg,
  },
  emptyButton: {
    marginTop: designTokens.spacing.md,
  },
});

export default TrainingScreen;
