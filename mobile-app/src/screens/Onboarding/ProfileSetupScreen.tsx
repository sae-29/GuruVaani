import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Chip,
  Surface,
  HelperText,
} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {designTokens, mixins} from '../../theme/designTokens';

const ProfileSetupScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    name: '',
    school: '',
    district: '',
    subjects: [] as string[],
    grades: [] as string[],
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const subjects = [
    'Math',
    'Science',
    'English',
    'Hindi',
    'Social Studies',
    'Arts',
    'Physical Education',
    'Computer Science',
  ];

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

  const schools = ['GHS ABC', 'GHS XYZ', 'GHS PQR', 'GHS DEF', 'GHS GHI'];

  const districts = ['District A', 'District B', 'District C'];

  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const toggleGrade = (grade: string) => {
    setFormData(prev => ({
      ...prev,
      grades: prev.grades.includes(grade)
        ? prev.grades.filter(g => g !== grade)
        : [...prev.grades, grade],
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.school) {
      newErrors.school = 'School selection is required';
    }

    if (formData.subjects.length === 0) {
      newErrors.subjects = 'Select at least one subject';
    }

    if (formData.grades.length === 0) {
      newErrors.grades = 'Select at least one grade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = () => {
    if (validateForm()) {
      // Save profile data
      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.onBackground}]}>
          Tell Us About Yourself
        </Text>
        <Text style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
          This helps us personalize your experience
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, {color: theme.colors.onSurface}]}>
            Your Name
          </Text>
          <TextInput
            mode="outlined"
            placeholder="Enter full name"
            value={formData.name}
            onChangeText={text => setFormData(prev => ({...prev, name: text}))}
            left={
              <TextInput.Icon icon={() => <Icon name="person" size={20} />} />
            }
            style={styles.input}
            error={!!errors.name}
          />
          {errors.name && <HelperText type="error">{errors.name}</HelperText>}
        </View>

        {/* School Dropdown */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, {color: theme.colors.onSurface}]}>
            School/Institution
          </Text>
          <Surface style={styles.dropdown}>
            <Text
              style={[styles.dropdownText, {color: theme.colors.onSurface}]}>
              {formData.school || 'Select from list'}
            </Text>
            <Icon
              name="arrow-drop-down"
              size={24}
              color={theme.colors.onSurfaceVariant}
            />
          </Surface>
          {errors.school && (
            <HelperText type="error">{errors.school}</HelperText>
          )}
        </View>

        {/* District (Auto-filled, read-only) */}
        {formData.school && (
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: theme.colors.onSurface}]}>
              District
            </Text>
            <Surface
              style={[
                styles.dropdown,
                {backgroundColor: theme.colors.surfaceVariant},
              ]}>
              <Text
                style={[
                  styles.dropdownText,
                  {color: theme.colors.onSurfaceVariant},
                ]}>
                {formData.district || 'Auto-filled from school'}
              </Text>
            </Surface>
          </View>
        )}

        {/* Subjects */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, {color: theme.colors.onSurface}]}>
            Subjects You Teach
          </Text>
          <View style={styles.chipContainer}>
            {subjects.map(subject => {
              const isSelected = formData.subjects.includes(subject);
              return (
                <Chip
                  key={subject}
                  selected={isSelected}
                  onPress={() => toggleSubject(subject)}
                  style={styles.chip}
                  selectedColor={designTokens.colors.surface}>
                  {subject}
                </Chip>
              );
            })}
          </View>
          {errors.subjects && (
            <HelperText type="error">{errors.subjects}</HelperText>
          )}
        </View>

        {/* Grades */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, {color: theme.colors.onSurface}]}>
            Grades You Teach
          </Text>
          <View style={styles.chipContainer}>
            {grades.map(grade => {
              const isSelected = formData.grades.includes(grade);
              return (
                <Chip
                  key={grade}
                  selected={isSelected}
                  onPress={() => toggleGrade(grade)}
                  style={styles.chip}
                  selectedColor={designTokens.colors.surface}>
                  Class {grade}
                </Chip>
              );
            })}
          </View>
          {errors.grades && (
            <HelperText type="error">{errors.grades}</HelperText>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleComplete}
          disabled={!formData.name || !formData.school}
          style={styles.completeButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}>
          Complete Setup
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: designTokens.spacing.xl,
    paddingTop: designTokens.spacing.xxl,
  },
  title: {
    ...mixins.text.h1,
    marginBottom: designTokens.spacing.sm,
  },
  subtitle: {
    ...mixins.text.body2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: designTokens.spacing.xl,
    paddingBottom: designTokens.spacing.xxl,
  },
  inputContainer: {
    marginBottom: designTokens.spacing.lg,
  },
  label: {
    ...mixins.text.body2,
    fontWeight: designTokens.typography.weights.medium,
    marginBottom: designTokens.spacing.sm,
  },
  input: {
    ...mixins.input.default,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.button,
    ...designTokens.shadows.card,
  },
  dropdownText: {
    ...mixins.text.body1,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: designTokens.spacing.sm,
  },
  chip: {
    marginRight: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.sm,
  },
  footer: {
    padding: designTokens.spacing.xl,
    paddingBottom: designTokens.spacing.xxl,
  },
  completeButton: {
    ...mixins.button.primary,
  },
  buttonContent: {
    paddingVertical: designTokens.spacing.sm,
  },
  buttonLabel: {
    ...mixins.text.button,
  },
});

export default ProfileSetupScreen;
