import React, { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface LoginPageProps {
  onLogin?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    district: '',
    username: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const districts = ['Select Your District', 'District A', 'District B', 'District C', 'District D'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      rememberMe: e.target.checked,
    }));
  };

  const handleLogin = async () => {
    if (!formData.district || formData.district === 'Select Your District') {
      setError('Please select a district');
      return;
    }
    if (!formData.username) {
      setError('Please enter username');
      return;
    }
    if (!formData.password) {
      setError('Please enter password');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('adminToken', 'demo_token_' + Date.now());
      localStorage.setItem('adminDistrict', formData.district);
      setLoading(false);
      onLogin?.();
      navigate('/dashboard');
    }, 1000);
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
      <Card
        sx={{
          maxWidth: 480,
          width: '100%',
          padding: 4,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h2" sx={{ fontSize: 48, mb: 1 }}>
            🙏
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
            Guru Vaani Admin Portal
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            DIET / SCERT Login
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* District Selector */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
              Select Your District *
            </Typography>
            <Select
              name="district"
              value={formData.district}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={handleChange as any}
              fullWidth
              sx={{ height: 48 }}
            >
              {districts.map(district => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Username Input */}
          <TextField
            name="username"
            label="Username"
            placeholder="Enter username"
            value={formData.username}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={handleChange as any}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: '#999', mr: 1 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 48,
              },
            }}
          />

          {/* Password Input */}
          <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            value={formData.password}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={handleChange as any}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#999', mr: 1 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 48,
              },
            }}
          />

          {/* Remember Me */}
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleCheckboxChange}
                size="small"
              />
            }
            label={<Typography variant="body2">Remember me</Typography>}
          />

          {/* Login Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              height: 48,
              background: 'linear-gradient(135deg, #FF7043 0%, #E64A19 100%)',
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Secure Login'}
          </Button>

          {/* Forgot Password */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              component="a"
              href="#forgot"
              sx={{
                fontSize: 12,
                color: '#FF7043',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Forgot Password?
            </Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: '1px solid #eee' }}>
          <Typography variant="caption" color="textSecondary">
            Powered by Guru Vaani | DIET/SCERT
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};
