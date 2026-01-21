import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Grid,
  IconButton,
  Badge,
} from '@mui/material';
import {
  AutoAwesome,
  School,
  TrendingUp,
  Notifications,
  LocalFireDepartment,
  People,
  EmojiEvents,
} from '@mui/icons-material';
import { designTokens } from 'guru-vaani-shared';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface HomeScreenProps {
  user: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user }) => {
  const navigate = useNavigate();
  const [syncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [userStats, setUserStats] = useState<any>(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        const result = await response.json();
        if (result.success) {
          setUserStats(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  const recentActivities = [
    {
      id: '1',
      type: 'entry',
      title: 'Math Division - Class 4',
      subtitle: 'Added visual aids approach',
      timestamp: 'Today',
      mood: 'happy',
    },
    {
      id: '2',
      type: 'training',
      title: 'Completed: Visual Learning',
      subtitle: '45 mins module',
      timestamp: '2 days ago',
      mood: 'happy',
    },
    {
      id: '3',
      type: 'badge',
      title: 'Reflective Practitioner',
      subtitle: 'Week 1 milestone achieved',
      timestamp: '3 days ago',
      mood: 'excited',
    },
  ];

  const getSyncStatusInfo = () => {
    switch (syncStatus) {
      case 'synced':
        return { text: 'All synced', color: 'success' };
      case 'syncing':
        return { text: 'Syncing 3 items...', color: 'warning' };
      case 'offline':
        return { text: 'Offline mode', color: 'error' };
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return '#4CAF50';
      case 'excited': return '#FFD700';
      case 'frustrated': return '#E53935';
      default: return '#757575';
    }
  };

  return (
    <Box sx={{ pb: 4, width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${designTokens.colors.primary.main} 0%, ${designTokens.colors.secondary.main} 100%)`,
          color: 'white',
          p: 3,
          borderRadius: '0 0 32px 32px',
          boxShadow: '0 8px 32px rgba(255, 112, 67, 0.15)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="800">
              Namaste, {user?.firstName || user?.name?.split(' ')[0] || 'Teacher'} 🙏
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
              {getSyncStatusInfo().text}
            </Typography>
          </Box>
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
            <Badge badgeContent={3} color="error" variant="dot">
              <Notifications />
            </Badge>
          </IconButton>
        </Box>

        {/* Streak & NEP Progress */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            p: 1.5,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 80
          }}>
            <LocalFireDepartment sx={{ color: '#FFD700', fontSize: 32 }} />
            <Typography variant="h5" fontWeight="900">{userStats?.streakDays || 0}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Days</Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                NEP Growth Progress
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {userStats?.nepHours || 0}/50 h
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={((userStats?.nepHours || 0) / 50) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'white',
                  borderRadius: 4
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ px: 2, mt: -3 }}>
        <Grid item xs={4}>
          <Card elevation={0} sx={{ textAlign: 'center', p: 2, borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <AutoAwesome sx={{ color: '#FF7043', fontSize: 28, mb: 0.5 }} />
            <Typography variant="h6" fontWeight="800">{userStats?.totalReflections || 0}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight="700">Reflections</Typography>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card elevation={0} sx={{ textAlign: 'center', p: 2, borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <School sx={{ color: '#26A69A', fontSize: 28, mb: 0.5 }} />
            <Typography variant="h6" fontWeight="800">{userStats?.completedTrainings || 0}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight="700">Trainings</Typography>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card elevation={0} sx={{ textAlign: 'center', p: 2, borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <TrendingUp sx={{ color: '#FB8C00', fontSize: 28, mb: 0.5 }} />
            <Typography variant="h6" fontWeight="800">{userStats?.streakDays || 0}d</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight="700">Streak</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Primary Actions */}
      <Box sx={{ px: 2, mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          disableElevation
          startIcon={<AutoAwesome />}
          onClick={() => navigate('/create-entry')}
          sx={{
            mb: 2,
            py: 2,
            borderRadius: '16px',
            fontSize: '1.2rem',
            fontWeight: 800,
            textTransform: 'none',
            boxShadow: '0 8px 16px rgba(255, 112, 67, 0.2)'
          }}
        >
          Share a Story 🎙️
        </Button>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<School />}
              onClick={() => navigate('/training')}
              sx={{ py: 1 }}
            >
              My Trainings
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<People />}
              onClick={() => navigate('/community')}
              sx={{ py: 1 }}
            >
              Community
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Pending Tasks */}
      <Card sx={{ mx: 2, mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Pending Tasks
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            You have 2 new training recommendations based on your recent reflections
          </Alert>
          <Button
            variant="text"
            startIcon={<TrendingUp />}
            onClick={() => navigate('/training')}
          >
            View Recommendations
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Box sx={{ px: 2, mt: 4 }}>
        <Typography variant="h6" fontWeight="800" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          Recent Activity <TrendingUp color="primary" />
        </Typography>
        {recentActivities.map((activity) => (
          <Card key={activity.id} elevation={0} sx={{
            mb: 1.5,
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.05)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.02)' }
          }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{
                  bgcolor: `${getMoodColor(activity.mood)}15`,
                  p: 1.2,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  {activity.type === 'entry' && <AutoAwesome sx={{ color: getMoodColor(activity.mood) }} />}
                  {activity.type === 'training' && <School sx={{ color: getMoodColor(activity.mood) }} />}
                  {activity.type === 'badge' && <EmojiEvents sx={{ color: getMoodColor(activity.mood) }} />}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight="800">{activity.title}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    {activity.subtitle}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  {activity.timestamp}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default HomeScreen;