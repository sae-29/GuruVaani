import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Visibility, VisibilityOff, School, PersonAdd, Login } from '@mui/icons-material';

interface LoginScreenProps {
  onLogin: (user: any) => void;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState(0); // 0 = Login, 1 = Sign Up
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
  });
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subjects = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Art', 'Physical Education'];
  const grades = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        onLogin(result.data.user);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          subjects: selectedSubjects,
          grades: selectedGrades,
        }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        onLogin(result.data.user);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const toggleGrade = (grade: string) => {
    setSelectedGrades(prev =>
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FF7043 0%, #26A69A 100%)',
        padding: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 420,
          padding: 4,
          borderRadius: 3,
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#FF7043',
              mb: 2,
            }}
          >
            <School sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Guru Vaani
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Empowering Teachers Daily
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, v) => { setActiveTab(v); setError(''); }}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab icon={<Login />} label="Sign In" />
          <Tab icon={<PersonAdd />} label="Sign Up" />
        </Tabs>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        {activeTab === 0 && (
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                height: 48,
                backgroundColor: '#FF7043',
                '&:hover': { backgroundColor: '#E64A19' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        )}

        {/* Sign Up Form */}
        {activeTab === 1 && (
          <Box component="form" onSubmit={handleSignUp}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
                margin="normal"
              />
            </Box>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              margin="normal"
              helperText="At least 6 characters"
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
              margin="normal"
            />

            {/* Subjects */}
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
              Subjects you teach
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {subjects.map(subject => (
                <Chip
                  key={subject}
                  label={subject}
                  onClick={() => toggleSubject(subject)}
                  color={selectedSubjects.includes(subject) ? 'primary' : 'default'}
                  variant={selectedSubjects.includes(subject) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>

            {/* Grades */}
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Classes you teach
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {grades.map(grade => (
                <Chip
                  key={grade}
                  label={grade}
                  onClick={() => toggleGrade(grade)}
                  color={selectedGrades.includes(grade) ? 'secondary' : 'default'}
                  variant={selectedGrades.includes(grade) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
                height: 48,
                backgroundColor: '#26A69A',
                '&:hover': { backgroundColor: '#00897B' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="caption" color="text.secondary">
            Guru Vaani. Empowering Teachers.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginScreen;