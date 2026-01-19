import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {Text, FAB, Chip, Avatar, Appbar} from 'react-native-paper';
// import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation } from '@react-navigation/native';
import {designTokens, mixins} from '../../theme/designTokens';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

interface CommunityPost {
  id: string;
  authorName: string;
  district: string;
  timestamp: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  isBookmarked: boolean;
  type: 'text' | 'audio';
  audioUrl?: string;
}

const CommunityScreen: React.FC = () => {
  // const theme = useTheme();
  // const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'myDistrict' | 'success' | 'questions'
  >('all');

  const posts: CommunityPost[] = [
    {
      id: '1',
      authorName: 'Teacher from Block A',
      district: 'Pune District',
      timestamp: '2 hours ago',
      content:
        'I found a great way to teach fractions using local sweets like laddu and barfi. Students understand parts of whole much better now! 🍬',
      tags: ['Math', 'Grade4', 'SuccessStory'],
      likes: 24,
      comments: 5,
      isBookmarked: false,
      type: 'text',
    },
    {
      id: '2',
      authorName: 'Teacher from Block C',
      district: 'Mumbai District',
      timestamp: '4 hours ago',
      content:
        "How do you handle students who are very shy and don't participate in class discussions? Looking for practical tips.",
      tags: ['ClassroomManagement', 'StudentEngagement'],
      likes: 12,
      comments: 8,
      isBookmarked: true,
      type: 'text',
    },
    {
      id: '3',
      authorName: 'Teacher from Block B',
      district: 'Nashik District',
      timestamp: '1 day ago',
      content:
        'Sharing my experience with using local examples for science concepts...',
      tags: ['Science', 'LocalContext'],
      likes: 18,
      comments: 3,
      isBookmarked: false,
      type: 'audio',
      audioUrl: 'audio_url_here',
    },
  ];

  const filteredPosts = posts.filter(post => {
    switch (selectedFilter) {
      case 'myDistrict':
        return post.district === 'Pune District'; // This would be dynamic
      case 'success':
        return post.tags.includes('SuccessStory');
      case 'questions':
        return post.content.includes('?') || post.tags.includes('Question');
      default:
        return true;
    }
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getAvatarColor = (name: string) => {
    const colors = [
      designTokens.colors.primary,
      designTokens.colors.secondary,
      designTokens.colors.accent,
      designTokens.colors.success,
      designTokens.colors.warning,
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const renderPost = (post: CommunityPost) => (
    <Card key={post.id} style={styles.postCard} imperfectionLevel="medium">
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Avatar.Text
          size={40}
          label={post.authorName.charAt(0)}
          style={{backgroundColor: getAvatarColor(post.authorName)}}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.authorName}</Text>
          <Text style={styles.authorDistrict}>{post.district}</Text>
        </View>
        <Text style={styles.timestamp}>{post.timestamp}</Text>
      </View>

      {/* Post Content */}
      <View style={styles.postContent}>
        {post.type === 'audio' ? (
          <View style={styles.audioPost}>
            <View style={styles.audioPlayer}>
              <Icon
                name="play-circle-outline"
                size={32}
                color={designTokens.colors.primary}
              />
              <View style={styles.audioInfo}>
                <Text style={styles.audioLabel}>Audio Post</Text>
                <Text style={styles.audioDuration}>2:30</Text>
              </View>
            </View>
            <Text style={styles.postText} numberOfLines={2}>
              {post.content}
            </Text>
          </View>
        ) : (
          <Text style={styles.postText}>{post.content}</Text>
        )}
      </View>

      {/* Tags */}
      {post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <Chip key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </Chip>
          ))}
        </View>
      )}

      {/* Post Actions */}
      <View style={styles.postActions}>
        <Button
          variant="ghost"
          size="small"
          icon={
            <Icon
              name="thumb-up"
              size={16}
              color={designTokens.colors.textSecondary}
            />
          }>
          {post.likes}
        </Button>
        <Button
          variant="ghost"
          size="small"
          icon={
            <Icon
              name="comment"
              size={16}
              color={designTokens.colors.textSecondary}
            />
          }>
          {post.comments}
        </Button>
        <Button
          variant="ghost"
          size="small"
          icon={
            <Icon
              name={post.isBookmarked ? 'bookmark' : 'bookmark-border'}
              size={16}
              color={
                post.isBookmarked
                  ? designTokens.colors.primary
                  : designTokens.colors.textSecondary
              }
            />
          }
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Teacher Circle" />
        <Appbar.Action icon="filter-list" onPress={() => {}} />
      </Appbar.Header>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            {key: 'all', label: 'All Posts'},
            {key: 'myDistrict', label: 'My District'},
            {key: 'success', label: 'Success Stories'},
            {key: 'questions', label: 'Questions'},
          ].map(filter => (
            <Chip
              key={filter.key}
              selected={selectedFilter === filter.key}
              onPress={() => setSelectedFilter(filter.key as any)}
              style={[
                styles.filterChip,
                selectedFilter === filter.key && styles.selectedFilterChip,
              ]}>
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter.key &&
                    styles.selectedFilterChipText,
                ]}>
                {filter.label}
              </Text>
            </Chip>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {filteredPosts.length > 0 ? (
          filteredPosts.map(renderPost)
        ) : (
          <View style={styles.emptyState}>
            <Icon
              name="people"
              size={64}
              color={designTokens.colors.disabled}
            />
            <Text style={styles.emptyTitle}>No posts here yet</Text>
            <Text style={styles.emptySubtitle}>
              Your story could help another teacher
            </Text>
            <Button
              variant="primary"
              onPress={() => {}}
              style={styles.emptyButton}>
              Share First Story
            </Button>
          </View>
        )}
      </ScrollView>

      <FAB
        icon="add"
        style={[styles.fab, {backgroundColor: designTokens.colors.primary}]}
        onPress={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...mixins.layout.container,
  },
  filterContainer: {
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.outline,
  },
  filterChip: {
    marginRight: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.background,
  },
  selectedFilterChip: {
    backgroundColor: designTokens.colors.primary,
  },
  filterChipText: {
    color: designTokens.colors.textPrimary,
  },
  selectedFilterChipText: {
    color: designTokens.colors.surface,
  },
  content: {
    flex: 1,
    padding: designTokens.spacing.md,
  },
  postCard: {
    marginBottom: designTokens.spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  authorInfo: {
    flex: 1,
    marginLeft: designTokens.spacing.sm,
  },
  authorName: {
    ...mixins.text.body2,
    fontWeight: designTokens.typography.weights.medium,
  },
  authorDistrict: {
    ...mixins.text.caption,
  },
  timestamp: {
    ...mixins.text.caption,
  },
  postContent: {
    marginBottom: designTokens.spacing.sm,
  },
  postText: {
    ...mixins.text.body1,
    lineHeight: designTokens.typography.sizes.base * 1.5,
  },
  audioPost: {
    gap: designTokens.spacing.sm,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.background,
    padding: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.button,
  },
  audioInfo: {
    marginLeft: designTokens.spacing.sm,
  },
  audioLabel: {
    ...mixins.text.body2,
    fontWeight: designTokens.typography.weights.medium,
  },
  audioDuration: {
    ...mixins.text.caption,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: designTokens.spacing.xs,
    marginBottom: designTokens.spacing.sm,
  },
  tag: {
    height: 24,
    backgroundColor: designTokens.colors.background,
  },
  tagText: {
    fontSize: designTokens.typography.sizes.xs,
    color: designTokens.colors.primary,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.outline,
    paddingTop: designTokens.spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: designTokens.spacing.xxl,
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
  fab: {
    position: 'absolute',
    margin: designTokens.spacing.md,
    right: 0,
    bottom: 0,
  },
});

export default CommunityScreen;
