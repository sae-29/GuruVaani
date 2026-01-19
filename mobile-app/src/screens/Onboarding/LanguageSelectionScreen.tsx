import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {Text, Surface, Button} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {designTokens, mixins} from '../../theme/designTokens';

const {width} = Dimensions.get('window');

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  {code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳'},
  {code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧'},
  {code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳'},
  {code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳'},
  {code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳'},
  {code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳'},
  {code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳'},
  {code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳'},
  {code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳'},
  {code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳'},
];

const LanguageSelectionScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      // Save language preference
      navigation.navigate('OfflineModeExplanation' as never);
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.onBackground}]}>
          Choose Your Language
        </Text>
        <Text style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
          अपनी भाषा चुनें
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.languageGrid}>
          {languages.map(language => {
            const isSelected = selectedLanguage === language.code;
            return (
              <Surface
                key={language.code}
                style={[
                  styles.languageCard,
                  {
                    backgroundColor: isSelected
                      ? designTokens.colors.primary
                      : theme.colors.surface,
                    borderColor: isSelected
                      ? designTokens.colors.primary
                      : designTokens.colors.outline,
                    borderWidth: isSelected ? 3 : 1,
                  },
                ]}
                onTouchEnd={() => handleLanguageSelect(language.code)}>
                <Text style={styles.flag}>{language.flag}</Text>
                <Text
                  style={[
                    styles.languageName,
                    {
                      color: isSelected
                        ? designTokens.colors.surface
                        : theme.colors.onSurface,
                    },
                  ]}>
                  {language.nativeName}
                </Text>
                <Text
                  style={[
                    styles.languageNameEn,
                    {
                      color: isSelected
                        ? designTokens.colors.surface
                        : theme.colors.onSurfaceVariant,
                    },
                  ]}>
                  {language.name}
                </Text>
                {isSelected && (
                  <Icon
                    name="check-circle"
                    size={24}
                    color={designTokens.colors.surface}
                    style={styles.checkIcon}
                  />
                )}
              </Surface>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={!selectedLanguage}
          style={styles.continueButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}>
          Continue
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
    alignItems: 'center',
  },
  title: {
    ...mixins.text.h1,
    marginBottom: designTokens.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...mixins.text.body2,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: designTokens.spacing.md,
    paddingBottom: designTokens.spacing.xl,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  languageCard: {
    width: (width - designTokens.spacing.md * 3) / 2,
    height: 160,
    borderRadius: designTokens.borderRadius.card,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...designTokens.shadows.card,
    position: 'relative',
  },
  flag: {
    fontSize: 48,
    marginBottom: designTokens.spacing.sm,
  },
  languageName: {
    ...mixins.text.h3,
    textAlign: 'center',
    marginBottom: designTokens.spacing.xs,
  },
  languageNameEn: {
    ...mixins.text.caption,
    textAlign: 'center',
  },
  checkIcon: {
    position: 'absolute',
    top: designTokens.spacing.sm,
    right: designTokens.spacing.sm,
  },
  footer: {
    padding: designTokens.spacing.xl,
    paddingBottom: designTokens.spacing.xxl,
  },
  continueButton: {
    ...mixins.button.primary,
  },
  buttonContent: {
    paddingVertical: designTokens.spacing.sm,
  },
  buttonLabel: {
    ...mixins.text.button,
  },
});

export default LanguageSelectionScreen;
