import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import {
  Appbar,
  Card,
  TextInput,
  Button,
  Chip,
  Text,
  Surface,
  IconButton,
  ProgressBar,
  Modal,
  Portal,
} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {designTokens, mixins} from '../../theme/designTokens';
import EmotionalPause, {
  PauseType,
} from '../../components/common/EmotionalPause';

const {width, height} = Dimensions.get('window');

interface SuggestionCard {
  id: string;
  title: string;
  teacherCount: number;
  similarity: number;
}

interface VoiceRecordingState {
  isRecording: boolean;
  duration: number;
  transcript: string;
  confidence: number;
}

const CreateEntryScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  // Form state
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [topic, setTopic] = useState('');
  const [entryMode, setEntryMode] = useState<'text' | 'voice'>('text');
  const [textContent, setTextContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  // Voice recording state
  const [voiceState, setVoiceState] = useState<VoiceRecordingState>({
    isRecording: false,
    duration: 0,
    transcript: '',
    confidence: 0,
  });

  // AI suggestions
  const [suggestions, setSuggestions] = useState<SuggestionCard[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // UI state
  const [syncStatus, setSyncStatus] = useState<'offline' | 'online'>('online');
  const [characterCount, setCharacterCount] = useState(0);

  // Emotional Pause State
  const [showPause, setShowPause] = useState(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const suggestionsAnim = useRef(new Animated.Value(0)).current;

  const grades = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ];
  const subjects = [
    'Math',
    'Science',
    'English',
    'Hindi',
    'Social Studies',
    'Art',
    'Physical Education',
  ];

  useEffect(() => {
    // Simulate AI suggestions when user types
    if (textContent.length > 20) {
      const mockSuggestions: SuggestionCard[] = [
        {
          id: '1',
          title: 'Division confusion',
          teacherCount: 24,
          similarity: 87,
        },
        {
          id: '2',
          title: 'Student engagement in math',
          teacherCount: 18,
          similarity: 72,
        },
      ];
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);

      Animated.timing(suggestionsAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setShowSuggestions(false);
      Animated.timing(suggestionsAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [textContent]);

  useEffect(() => {
    setCharacterCount(textContent.length);
  }, [textContent]);

  const startRecording = () => {
    setVoiceState(prev => ({...prev, isRecording: true, duration: 0}));

    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Simulate recording timer
    const timer = setInterval(() => {
      setVoiceState(prev => {
        if (prev.duration >= 60) {
          stopRecording();
          return prev;
        }
        return {...prev, duration: prev.duration + 1};
      });
    }, 1000);

    // Store timer reference for cleanup
    setVoiceState(prev => ({...prev, timer}));
  };

  const stopRecording = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);

    setVoiceState(prev => {
      if (prev.timer) {
        clearInterval(prev.timer);
      }
      return {
        ...prev,
        isRecording: false,
        transcript:
          'Today while teaching division of fractions, I noticed that most students are confused about the invert and multiply rule...',
        confidence: 85,
      };
    });
  };

  const handleSubmit = () => {
    if (!selectedGrade || selectedSubjects.length === 0) {
      Alert.alert(
        'Missing Information',
        'Please select grade and at least one subject.',
      );
      return;
    }

    if (entryMode === 'text' && textContent.trim().length === 0) {
      Alert.alert(
        'Empty Entry',
        'Please write about your classroom challenge.',
      );
      return;
    }

    if (entryMode === 'voice' && !voiceState.transcript) {
      Alert.alert('No Recording', 'Please record your voice entry.');
      return;
    }

    // Trigger emotional pause instead of immediate navigation
    setShowPause(true);
  };

  const handlePauseClose = () => {
    setShowPause(false);
    // Navigate after pause
    navigation.navigate('Training');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={designTokens.colors.textPrimary}
        />
        <Appbar.Content
          title="Share Your Challenge"
          titleStyle={styles.headerTitle}
        />
        <View style={styles.syncIndicator}>
          <Icon
            name={syncStatus === 'online' ? 'cloud-done' : 'cloud-off'}
            size={20}
            color={
              syncStatus === 'online'
                ? designTokens.colors.secondary
                : designTokens.colors.error
            }
          />
          <Text
            style={[
              styles.syncText,
              {
                color:
                  syncStatus === 'online'
                    ? designTokens.colors.secondary
                    : designTokens.colors.error,
              },
            ]}>
            {syncStatus === 'online'
              ? 'Will sync when online'
              : 'Saved locally'}
          </Text>
        </View>
      </Appbar.Header>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}>
        {/* Context Selection */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Context</Text>

            {/* Grade Selection */}
            <Text style={styles.fieldLabel}>Grade *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipContainer}>
              {grades.map(grade => (
                <Chip
                  key={grade}
                  selected={selectedGrade === grade}
                  onPress={() => setSelectedGrade(grade)}
                  style={[
                    styles.chip,
                    selectedGrade === grade && styles.selectedChip,
                  ]}
                  textStyle={
                    selectedGrade === grade && styles.selectedChipText
                  }>
                  Class {grade}
                </Chip>
              ))}
            </ScrollView>

            {/* Subject Selection */}
            <Text style={styles.fieldLabel}>Subjects *</Text>
            <View style={styles.subjectGrid}>
              {subjects.map(subject => (
                <Chip
                  key={subject}
                  selected={selectedSubjects.includes(subject)}
                  onPress={() => {
                    setSelectedSubjects(prev =>
                      prev.includes(subject)
                        ? prev.filter(s => s !== subject)
                        : [...prev, subject],
                    );
                  }}
                  style={[
                    styles.chip,
                    selectedSubjects.includes(subject) && styles.selectedChip,
                  ]}
                  textStyle={
                    selectedSubjects.includes(subject) &&
                    styles.selectedChipText
                  }>
                  {subject}
                </Chip>
              ))}
            </View>

            {/* Topic (Optional) */}
            <TextInput
              label="Topic (Optional)"
              value={topic}
              onChangeText={setTopic}
              style={styles.topicInput}
              placeholder="e.g., Division of fractions"
              mode="outlined"
              outlineColor={designTokens.colors.outline}
              activeOutlineColor={designTokens.colors.primary}
            />
          </Card.Content>
        </Card>

        {/* Input Mode Toggle */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.modeToggle}>
              <Button
                mode={entryMode === 'text' ? 'contained' : 'outlined'}
                onPress={() => setEntryMode('text')}
                style={[
                  styles.modeButton,
                  entryMode === 'text' && styles.activeModeButton,
                ]}
                labelStyle={
                  entryMode === 'text'
                    ? styles.activeModeButtonLabel
                    : styles.modeButtonLabel
                }
                icon="edit">
                Text
              </Button>
              <Button
                mode={entryMode === 'voice' ? 'contained' : 'outlined'}
                onPress={() => setEntryMode('voice')}
                style={[
                  styles.modeButton,
                  entryMode === 'voice' && styles.activeModeButton,
                ]}
                labelStyle={
                  entryMode === 'voice'
                    ? styles.activeModeButtonLabel
                    : styles.modeButtonLabel
                }
                icon="mic">
                Voice
              </Button>
            </View>

            {/* Text Input Mode */}
            {entryMode === 'text' && (
              <View style={styles.textInputContainer}>
                <TextInput
                  multiline
                  numberOfLines={8}
                  value={textContent}
                  onChangeText={setTextContent}
                  placeholder="Describe what happened in class today..."
                  style={styles.textInput}
                  maxLength={500}
                  mode="outlined"
                  outlineColor={designTokens.colors.outline}
                  activeOutlineColor={designTokens.colors.primary}
                />
                <View style={styles.characterCounter}>
                  <Text
                    style={[
                      styles.counterText,
                      {
                        color:
                          characterCount > 450
                            ? designTokens.colors.error
                            : designTokens.colors.textSecondary,
                      },
                    ]}>
                    {characterCount}/500
                  </Text>
                </View>
              </View>
            )}

            {/* Voice Input Mode */}
            {entryMode === 'voice' && (
              <View style={styles.voiceInputContainer}>
                <View style={styles.microphoneContainer}>
                  <Animated.View
                    style={[
                      styles.microphoneButton,
                      {
                        transform: [{scale: pulseAnim}],
                        backgroundColor: voiceState.isRecording
                          ? designTokens.colors.error
                          : designTokens.colors.secondary,
                      },
                    ]}>
                    <IconButton
                      icon={voiceState.isRecording ? 'stop' : 'mic'}
                      size={40}
                      iconColor="white"
                      onPress={
                        voiceState.isRecording ? stopRecording : startRecording
                      }
                    />
                  </Animated.View>
                </View>

                {voiceState.isRecording && (
                  <View style={styles.recordingInfo}>
                    <Text style={styles.timerText}>
                      {formatDuration(voiceState.duration)} / 01:00
                    </Text>
                    <Text style={styles.recordingHint}>
                      Tap to stop recording
                    </Text>
                  </View>
                )}

                {voiceState.transcript && (
                  <View style={styles.transcriptContainer}>
                    <Text style={styles.transcriptLabel}>
                      Transcript (Confidence: {voiceState.confidence}%)
                    </Text>
                    <TextInput
                      multiline
                      value={voiceState.transcript}
                      onChangeText={text =>
                        setVoiceState(prev => ({...prev, transcript: text}))
                      }
                      style={styles.transcriptInput}
                      placeholder="Edit transcript if needed"
                      mode="outlined"
                    />
                    <View style={styles.transcriptActions}>
                      <Button
                        mode="outlined"
                        onPress={() =>
                          setVoiceState(prev => ({...prev, transcript: ''}))
                        }
                        compact
                        textColor={designTokens.colors.primary}
                        style={{borderColor: designTokens.colors.primary}}>
                        Re-record
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() => {}}
                        compact
                        buttonColor={designTokens.colors.primary}>
                        Use This
                      </Button>
                    </View>
                  </View>
                )}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* AI Suggestions */}
        {showSuggestions && (
          <Animated.View
            style={[
              styles.suggestionsContainer,
              {
                opacity: suggestionsAnim,
                transform: [
                  {
                    translateY: suggestionsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}>
            <Card style={styles.suggestionsCard}>
              <Card.Content>
                <Text style={styles.suggestionsTitle}>
                  Similar challenges from other teachers:
                </Text>
                {suggestions.map(suggestion => (
                  <Surface key={suggestion.id} style={styles.suggestionItem}>
                    <View style={styles.suggestionContent}>
                      <Text style={styles.suggestionTitle}>
                        {suggestion.title}
                      </Text>
                      <Text style={styles.suggestionMeta}>
                        {suggestion.teacherCount} teachers •{' '}
                        {suggestion.similarity}% match
                      </Text>
                    </View>
                    <Button
                      mode="text"
                      compact
                      onPress={() => {}}
                      textColor={designTokens.colors.primary}>
                      View Solutions
                    </Button>
                  </Surface>
                ))}
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        {/* Privacy Toggle */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.privacyToggle}>
              <View style={styles.privacyInfo}>
                <Text style={styles.privacyLabel}>
                  Share anonymously with community
                </Text>
                <Text style={styles.privacyHint}>
                  Help other teachers learn from your experience
                </Text>
              </View>
              <IconButton
                icon={isPrivate ? 'toggle-switch-off' : 'toggle-switch'}
                size={32}
                iconColor={
                  isPrivate
                    ? designTokens.colors.outline
                    : designTokens.colors.primary
                }
                onPress={() => setIsPrivate(!isPrivate)}
              />
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Bottom Action Bar */}
      <Surface style={styles.bottomBar}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          labelStyle={styles.submitButtonLabel}
          icon="send"
          buttonColor={designTokens.colors.primary}>
          Save Reflection
        </Button>
      </Surface>

      {/* Emotional Pause Component */}
      <EmotionalPause
        visible={showPause}
        type="reflection"
        onClose={handlePauseClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.background,
  },
  header: {
    backgroundColor: designTokens.colors.surface,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.outline,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  syncText: {
    fontSize: 12,
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: designTokens.borderRadius.card,
    backgroundColor: designTokens.colors.surface,
    ...designTokens.shadows.card,
    borderWidth: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: designTokens.colors.textPrimary,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
    color: designTokens.colors.textSecondary,
  },
  chipContainer: {
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: designTokens.colors.background,
    borderColor: designTokens.colors.outline,
    borderWidth: 1,
  },
  selectedChip: {
    backgroundColor: designTokens.colors.primary,
    borderColor: designTokens.colors.primary,
  },
  selectedChipText: {
    color: 'white',
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicInput: {
    marginTop: 8,
    backgroundColor: designTokens.colors.background,
  },
  modeToggle: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    marginHorizontal: 4,
    borderColor: designTokens.colors.outline,
  },
  activeModeButton: {
    backgroundColor: designTokens.colors.primary,
    borderColor: designTokens.colors.primary,
  },
  modeButtonLabel: {
    color: designTokens.colors.textSecondary,
  },
  activeModeButtonLabel: {
    color: 'white',
  },
  textInputContainer: {
    position: 'relative',
  },
  textInput: {
    minHeight: 120,
    backgroundColor: designTokens.colors.background,
    textAlignVertical: 'top',
  },
  characterCounter: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  counterText: {
    fontSize: 12,
  },
  voiceInputContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  microphoneContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  microphoneButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: designTokens.colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  recordingInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
  },
  recordingHint: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
    color: designTokens.colors.textSecondary,
  },
  transcriptContainer: {
    width: '100%',
    marginTop: 16,
  },
  transcriptLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: designTokens.colors.textSecondary,
  },
  transcriptInput: {
    minHeight: 80,
    marginBottom: 12,
    backgroundColor: designTokens.colors.background,
  },
  transcriptActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  suggestionsContainer: {
    marginBottom: 16,
  },
  suggestionsCard: {
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: designTokens.colors.accent,
    backgroundColor: designTokens.colors.surface,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    color: designTokens.colors.textPrimary,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 0,
    backgroundColor: designTokens.colors.background,
    borderWidth: 1,
    borderColor: designTokens.colors.outline,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: designTokens.colors.textPrimary,
  },
  suggestionMeta: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
    color: designTokens.colors.textSecondary,
  },
  privacyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  privacyInfo: {
    flex: 1,
  },
  privacyLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: designTokens.colors.textPrimary,
  },
  privacyHint: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
    color: designTokens.colors.textSecondary,
  },
  bottomBar: {
    padding: 16,
    elevation: 8,
    backgroundColor: designTokens.colors.surface,
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.outline,
  },
  submitButton: {
    borderRadius: designTokens.borderRadius.button,
    ...designTokens.shadows.card,
  },
  submitButtonContent: {
    height: 48,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateEntryScreen;
