import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    district: '',
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implement actual authentication
      console.log('Login attempt:', formData);
      // Simulate successful login
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #FF7043 0%, #26A69A 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h2" sx={{ color: 'primary.main', mb: 1 }}>
              Guru Vaani
            </Typography>
            <Typography variant="h3" sx={{ color: 'text.secondary', fontSize: 18 }}>
              Admin Portal
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>District</InputLabel>
                <Select
                  name="district"
                  value={formData.district}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={handleChange as any}
                  label="District"
                  required
                >
                  <MenuItem value="district1">District 1</MenuItem>
                  <MenuItem value="district2">District 2</MenuItem>
                  <MenuItem value="district3">District 3</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />

            {error && (
              <Typography color="error" sx={{ mt: 2, mb: 2 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Secure Login'}
            </Button>

            <Typography variant="body2" align="center" color="text.secondary">
              <a href="#forgot" style={{ color: 'inherit', textDecoration: 'none' }}>
                Forgot Password?
              </a>
            </Typography>
          </form>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #E0E0E0', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              DIET/SCERT Branding
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
