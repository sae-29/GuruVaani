import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  LinearProgress,
  IconButton,
  Badge,
  Alert,
} from '@mui/material';
import {
  Add,
  Notifications,
  School,
  People,
  LocalFireDepartment,
  TrendingUp,
} from '@mui/icons-material';

interface HomeScreenProps {
  user: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user }) => {
  const navigate = useNavigate();
  const [syncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Mock data
  const stats = {
    totalReflections: 47,
    weeklyReflections: 3,
    completedTrainings: 12,
    streakDays: 15,
    nepHours: 24.5,
  };

  const recentActivities = [
    {
      id: '1',
      type: 'entry',
      title: 'Math Division - Class 4',
      subtitle: 'AI suggested: Visual Learning Aids',
      timestamp: 'Yesterday',
      mood: 'frustrated',
    },
    {
      id: '2',
      type: 'training',
      title: 'Classroom Management',
      subtitle: 'Completed • Rated 5 stars',
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
    <Box sx={{ pb: 2, maxWidth: '390px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FF7043 0%, #26A69A 100%)',
          color: 'white',
          p: 2.5,
          borderRadius: '0 0 20px 20px',
          mx: 0,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Namaste, {user?.name?.split(' ')[0] || 'Teacher'} 🙏
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: getSyncStatusInfo().color === 'success' ? '#4CAF50' : '#FFA726',
                  mr: 1,
                }}
              />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {getSyncStatusInfo().text}
              </Typography>
            </Box>
          </Box>
          <IconButton sx={{ color: 'white' }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Box>

        {/* Streak Card */}
        <Card sx={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: 3 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalFireDepartment sx={{ color: '#FFD700', mr: 1 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    {stats.streakDays}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Day Streak!
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flex: 1, ml: 3 }}>
                <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                  NEP Hours: {stats.nepHours}/50
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(stats.nepHours / 50) * 100}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#FFD700',
                    },
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

              {/* Quick Stats - 2x2 Grid for Mobile */}
              <Grid container spacing={1.5} sx={{ px: 2, mt: 2 }}>
                <Grid item xs={6}>
                  <Card sx={{ textAlign: 'center', p: 2, borderRadius: 3, minHeight: 80 }}>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      {stats.totalReflections}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Reflections
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ textAlign: 'center', p: 2, borderRadius: 3, minHeight: 80 }}>
                    <Typography variant="h5" color="secondary" fontWeight="bold">
                      {stats.completedTrainings}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Trainings
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ textAlign: 'center', p: 2, borderRadius: 3, minHeight: 80 }}>
                    <Typography variant="h5" sx={{ color: '#FFD700' }} fontWeight="bold">
                      3
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Badges
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ textAlign: 'center', p: 2, borderRadius: 3, minHeight: 80 }}>
                    <Typography variant="h5" sx={{ color: '#FF7043' }} fontWeight="bold">
                      {stats.streakDays}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Day Streak
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

      {/* Primary Actions */}
      <Box sx={{ px: 2, mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<Add />}
          onClick={() => navigate('/create-entry')}
          sx={{
            mb: 2,
            py: 1.5,
            backgroundColor: '#FF7043',
            '&:hover': { backgroundColor: '#E64A19' },
          }}
        >
          New Reflection Entry
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
      <Card sx={{ mx: 2, mt: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          {recentActivities.map((activity) => (
            <Box
              key={activity.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                py: 1.5,
                borderBottom: '1px solid #f0f0f0',
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: getMoodColor(activity.mood),
                  mr: 2,
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="medium">
                  {activity.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {activity.subtitle}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {activity.timestamp}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default HomeScreen;