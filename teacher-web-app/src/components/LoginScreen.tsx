import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  InputAdornment,
  IconButton 
} from '@mui/material';
import { Visibility, VisibilityOff, School } from '@mui/icons-material';

interface LoginScreenProps {
  onLogin: (user: any) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: 'radha.sharma@school.edu.in',
    password: 'teacher123',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock teacher login
      if (formData.email.includes('teacher') || formData.email.includes('radha') || formData.email.includes('amit')) {
        const user = {
          id: '1',
          name: formData.email.includes('radha') ? 'Radha Sharma' : 'Amit Kumar',
          email: formData.email,
          school: 'Government Primary School, Sector 15',
          subjects: ['Mathematics', 'Science'],
          grades: ['Class 3', 'Class 4'],
          avatar: null,
        };
        onLogin(user);
      } else {
        setError('Invalid credentials. Try: radha.sharma@school.edu.in / teacher123');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
          maxWidth: 400,
          padding: 4,
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
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
            Teacher Reflection App
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit}>
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
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
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
              '&:hover': {
                backgroundColor: '#E64A19',
              },
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Demo Credentials */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Demo Credentials:
            </Typography>
            <Typography variant="body2" component="div">
              <strong>Email:</strong> radha.sharma@school.edu.in<br />
              <strong>Password:</strong> teacher123
            </Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="caption" color="text.secondary">
            © 2024 Guru Vaani. Empowering Teachers.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginScreen;