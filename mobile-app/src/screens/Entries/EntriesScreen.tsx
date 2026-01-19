import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, RefreshControl} from 'react-native';
import {Appbar, Text, Chip, FAB} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {designTokens, mixins} from '../../theme/designTokens';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

interface DiaryEntry {
  id: string;
  date: string;
  subject: string;
  grade: string;
  snippet: string;
  status: 'pending' | 'reviewed' | 'resolved';
  type: 'text' | 'voice';
  hasTraining: boolean;
  trainingTitle?: string;
}

const EntriesScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'pending' | 'reviewed' | 'resolved'
  >('all');

  const entries: DiaryEntry[] = [
    {
      id: '1',
      date: 'Today',
      subject: 'Math',
      grade: '5',
      snippet:
        'Students struggling with division of fractions, confused about invert and multiply rule...',
      status: 'pending',
      type: 'text',
      hasTraining: false,
    },
    {
      id: '2',
      date: 'Yesterday',
      subject: 'Math',
      grade: '4',
      snippet: 'Math Division - Class 4',
      status: 'reviewed',
      type: 'voice',
      hasTraining: true,
      trainingTitle: 'Fun with Fractions',
    },
    {
      id: '3',
      date: '2 days ago',
      subject: 'Science',
      grade: '6',
      snippet: 'Students not understanding photosynthesis concept...',
      status: 'resolved',
      type: 'text',
      hasTraining: true,
      trainingTitle: 'Visual Science Concepts',
    },
  ];

  const filteredEntries = entries.filter(
    entry => selectedFilter === 'all' || entry.status === selectedFilter,
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return designTokens.colors.warning;
      case 'reviewed':
        return designTokens.colors.accent;
      case 'resolved':
        return designTokens.colors.success;
      default:
        return designTokens.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'schedule';
      case 'reviewed':
        return 'visibility';
      case 'resolved':
        return 'check-circle';
      default:
        return 'help';
    }
  };

  const renderEntry = (entry: DiaryEntry) => (
    <Card
      key={entry.id}
      style={styles.entryCard}
      interactive
      onPress={() => {}}>
      <View style={styles.entryHeader}>
        <View style={styles.entryMeta}>
          <Chip
            style={[
              styles.subjectChip,
              {backgroundColor: designTokens.colors.primary},
            ]}>
            <Text style={styles.chipText}>{entry.subject}</Text>
          </Chip>
          <Chip
            style={[
              styles.gradeChip,
              {backgroundColor: designTokens.colors.secondary},
            ]}>
            <Text style={styles.chipText}>Grade {entry.grade}</Text>
          </Chip>
        </View>
        <Text style={styles.entryDate}>{entry.date}</Text>
      </View>

      <View style={styles.entryContent}>
        <View style={styles.contentRow}>
          <Icon
            name={entry.type === 'voice' ? 'mic' : 'edit'}
            size={16}
            color={designTokens.colors.textSecondary}
            style={styles.typeIcon}
          />
          <Text style={styles.entrySnippet} numberOfLines={2}>
            {entry.snippet}
          </Text>
        </View>
      </View>

      <View style={styles.entryFooter}>
        <View style={styles.statusRow}>
          <Icon
            name={getStatusIcon(entry.status)}
            size={16}
            color={getStatusColor(entry.status)}
          />
          <Text
            style={[styles.statusText, {color: getStatusColor(entry.status)}]}>
            {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
          </Text>
        </View>

        {entry.hasTraining && (
          <View style={styles.trainingRow}>
            <Icon name="school" size={16} color={designTokens.colors.accent} />
            <Text style={styles.trainingText}>
              Training: {entry.trainingTitle}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="My Entries" />
        <Appbar.Action icon="filter-list" onPress={() => {}} />
      </Appbar.Header>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'pending', 'reviewed', 'resolved'].map(filter => (
            <Chip
              key={filter}
              selected={selectedFilter === filter}
              onPress={() => setSelectedFilter(filter as any)}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.selectedFilterChip,
              ]}>
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter && styles.selectedFilterChipText,
                ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
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
        {filteredEntries.length > 0 ? (
          filteredEntries.map(renderEntry)
        ) : (
          <View style={styles.emptyState}>
            <Icon
              name="note-add"
              size={64}
              color={designTokens.colors.disabled}
            />
            <Text style={styles.emptyTitle}>No entries yet</Text>
            <Text style={styles.emptySubtitle}>
              Start documenting your classroom experiences
            </Text>
            <Button
              variant="primary"
              onPress={() => navigation.navigate('CreateEntry')}
              style={styles.emptyButton}>
              Create First Entry
            </Button>
          </View>
        )}
      </ScrollView>

      <FAB
        icon="add"
        style={[styles.fab, {backgroundColor: designTokens.colors.primary}]}
        onPress={() => navigation.navigate('CreateEntry')}
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
  entryCard: {
    marginBottom: designTokens.spacing.md,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  entryMeta: {
    flexDirection: 'row',
    gap: designTokens.spacing.sm,
  },
  subjectChip: {
    height: 24,
  },
  gradeChip: {
    height: 24,
  },
  chipText: {
    color: designTokens.colors.surface,
    fontSize: designTokens.typography.sizes.xs,
  },
  entryDate: {
    ...mixins.text.caption,
  },
  entryContent: {
    marginBottom: designTokens.spacing.sm,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  typeIcon: {
    marginRight: designTokens.spacing.sm,
    marginTop: 2,
  },
  entrySnippet: {
    ...mixins.text.body1,
    flex: 1,
  },
  entryFooter: {
    gap: designTokens.spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.xs,
  },
  statusText: {
    ...mixins.text.body2,
    fontWeight: designTokens.typography.weights.medium,
  },
  trainingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.xs,
  },
  trainingText: {
    ...mixins.text.body2,
    color: designTokens.colors.accent,
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

export default EntriesScreen;
