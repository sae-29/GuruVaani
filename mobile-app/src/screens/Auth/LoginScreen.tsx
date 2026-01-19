import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Text, TextInput, HelperText} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {designTokens, mixins} from '../../theme/designTokens';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    } catch (error) {
      setErrors({email: 'Invalid credentials. Please try again.'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Icon
              name="menu-book"
              size={64}
              color={designTokens.colors.primary}
            />
          </View>
          <Text style={styles.appTitle}>Guru Vaani</Text>
          <Text style={styles.appSubtitle}>
            Empowering Teachers Through Reflection
          </Text>
        </View>

        {/* Login Form */}
        <Card style={styles.loginCard}>
          <Text style={styles.loginTitle}>Welcome Back</Text>
          <Text style={styles.loginSubtitle}>
            Sign in to continue your learning journey
          </Text>

          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={!!errors.email}
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
              />
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoComplete="password"
                error={!!errors.password}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              <HelperText type="error" visible={!!errors.password}>
                {errors.password}
              </HelperText>
            </View>

            {/* Login Button */}
            <Button
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              onPress={handleLogin}
              style={styles.loginButton}>
              Sign In
            </Button>

            {/* Forgot Password */}
            <Button
              variant="ghost"
              onPress={() => {}}
              style={styles.forgotButton}>
              Forgot Password?
            </Button>
          </View>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Button
            variant="ghost"
            onPress={() => navigation.navigate('Register')}>
            Sign Up
          </Button>
        </View>

        {/* Powered By */}
        <View style={styles.poweredBy}>
          <Text style={styles.poweredByText}>Powered by DIET/SCERT</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...mixins.layout.container,
  },
  scrollContent: {
    flexGrow: 1,
    padding: designTokens.spacing.md,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: designTokens.spacing.xxl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${designTokens.colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: designTokens.spacing.lg,
  },
  appTitle: {
    ...mixins.text.h1,
    color: designTokens.colors.primary,
    marginBottom: designTokens.spacing.sm,
  },
  appSubtitle: {
    ...mixins.text.body1,
    textAlign: 'center',
    color: designTokens.colors.textSecondary,
  },
  loginCard: {
    marginBottom: designTokens.spacing.lg,
  },
  loginTitle: {
    ...mixins.text.h2,
    textAlign: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  loginSubtitle: {
    ...mixins.text.body2,
    textAlign: 'center',
    marginBottom: designTokens.spacing.lg,
  },
  form: {
    gap: designTokens.spacing.md,
  },
  inputContainer: {
    marginBottom: designTokens.spacing.sm,
  },
  input: {
    backgroundColor: designTokens.colors.surface,
  },
  loginButton: {
    marginTop: designTokens.spacing.md,
  },
  forgotButton: {
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: designTokens.spacing.sm,
  },
  footerText: {
    ...mixins.text.body2,
  },
  poweredBy: {
    alignItems: 'center',
    marginTop: designTokens.spacing.lg,
  },
  poweredByText: {
    ...mixins.text.caption,
  },
});

export default LoginScreen;
