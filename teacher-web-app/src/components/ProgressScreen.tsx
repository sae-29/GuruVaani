import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  EditNote,
  CheckCircle,
  Chat,
  LocalFireDepartment,
  Lock,
} from '@mui/icons-material';

const ProgressScreen: React.FC = () => {
  const nepHours = 32;
  const nepGoal = 50;
  const nepProgress = nepHours / nepGoal;
  const streakDays = 5;

  const activityStats = [
    {
      label: 'Entries',
      value: '42',
      subtext: 'This year',
      icon: <EditNote sx={{ fontSize: 32, color: '#26A69A' }} />,
    },
    {
      label: 'Completions',
      value: '18',
      subtext: 'Trainings completed',
      icon: <CheckCircle sx={{ fontSize: 32, color: '#FF7043' }} />,
    },
    {
      label: 'Community',
      value: '12',
      subtext: 'Posts shared',
      icon: <Chat sx={{ fontSize: 32, color: '#5C6BC0' }} />,
    },
    {
      label: 'Streak',
      value: `${streakDays} days`,
      subtext: 'Current streak',
      icon: <LocalFireDepartment sx={{ fontSize: 32, color: '#FF7043' }} />,
    },
  ];

  const badges = [
    {
      name: 'Reflective Practitioner',
      icon: <EditNote sx={{ fontSize: 48, color: '#FF7043' }} />,
      earnedDate: 'Earned on 12 Jan',
      color: '#FF7043',
    },
    {
      name: 'Lifelong Learner',
      icon: <CheckCircle sx={{ fontSize: 48, color: '#26A69A' }} />,
      earnedDate: 'Earned on 8 Jan',
      color: '#26A69A',
    },
    {
      name: 'Community Helper',
      icon: <Chat sx={{ fontSize: 48, color: '#5C6BC0' }} />,
      earnedDate: 'Earned on 5 Jan',
      color: '#5C6BC0',
    },
  ];

  return (
    <Box sx={{ maxWidth: '390px', margin: '0 auto', width: '100%', px: 2, py: 3 }}>
      {/* NEP CPD Hours Tracker */}
      <Card
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #FF7043 0%, #26A69A 100%)',
          color: 'white',
          width: '92%',
          margin: '0 auto 24px',
        }}
      >
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            NEP 2020 CPD Hours
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            Annual requirement: 50 hours/year
          </Typography>
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
            <Box
              sx={{
                width: 120, // Smaller for mobile
                height: 120,
                borderRadius: '50%',
                border: '6px solid rgba(255,255,255,0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h2" fontWeight="bold">
                {nepHours}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8 }}>
                / {nepGoal}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={nepProgress * 100}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 150,
                height: 150,
                borderRadius: '50%',
                '& .MuiLinearProgress-bar': {
                  borderRadius: '50%',
                },
              }}
            />
          </Box>
          <Typography variant="h6" fontWeight="medium">
            {Math.round(nepProgress * 100)}% toward annual goal
          </Typography>
        </CardContent>
      </Card>

      {/* Activity Summary - 2x2 Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {activityStats.map((stat, index) => (
          <Grid item xs={6} key={index}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                {stat.icon}
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" fontWeight="medium" sx={{ mt: 1 }}>
                  {stat.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.subtext}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Badges Earned */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Your Badges
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
            {badges.map((badge, index) => (
              <Card
                key={index}
                sx={{
                  minWidth: 140,
                  textAlign: 'center',
                  backgroundColor: `${badge.color}20`,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: `${badge.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                    }}
                  >
                    {badge.icon}
                  </Box>
                  <Typography variant="body2" fontWeight="medium">
                    {badge.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {badge.earnedDate}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            {/* Locked Badge */}
            <Card
              sx={{
                minWidth: 140,
                textAlign: 'center',
                borderRadius: 3,
                backgroundColor: 'grey.100',
                opacity: 0.6,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'grey.300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                  }}
                >
                  <Lock sx={{ fontSize: 48, color: 'grey.600' }} />
                </Box>
                <Typography variant="body2" fontWeight="medium" color="text.secondary">
                  Math Master
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Complete 5 math trainings
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </CardContent>
      </Card>

      {/* Impact Stats */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Your Classroom Impact
          </Typography>
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="h1" fontWeight="bold" color="primary">
              15
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              challenges resolved this year!
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProgressScreen;
