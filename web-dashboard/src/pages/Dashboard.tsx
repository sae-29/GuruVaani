import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Tooltip as MuiTooltip,
  CircularProgress,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import api from '../services/api';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend?: string;
  trendColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, trend, trendColor = 'success.main' }) => (
  <Paper sx={{
    p: 3,
    borderRadius: '16px', // Slightly larger for "Human-Centered" feel
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
    }
  }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h2" sx={{ mb: 1, fontWeight: 800, color: 'text.primary' }}>
          {value}
        </Typography>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: trendColor }} />
            <Typography variant="caption" sx={{ color: trendColor, fontWeight: 600 }}>
              {trend}
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{
        color: 'primary.main',
        bgcolor: 'primary.light',
        p: 1.5,
        borderRadius: '12px',
        display: 'flex',
        opacity: 0.8
      }}>{icon}</Box>
    </Box>
  </Paper>
);

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analytics/dashboard');
      if (response.data.success) {
        setMetrics(response.data.data.metrics);
        setTrends(response.data.data.trends);
      }
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const districts = [
    { id: 1, name: 'District A', value: 85, color: '#e57373' },
    { id: 2, name: 'District B', value: 65, color: '#ffb74d' },
    { id: 3, name: 'District C', value: 45, color: '#fff176' },
    { id: 4, name: 'District D', value: 92, color: '#e57373' },
    { id: 5, name: 'District E', value: 30, color: '#81c784' },
    { id: 6, name: 'District F', value: 55, color: '#ffb74d' },
  ];

  const challenges = [
    { name: 'Division Concepts', count: 42, percentage: 24 },
    { name: 'Classroom Noise', count: 31, percentage: 18 },
    { name: 'Low Engagement', count: 25, percentage: 14 },
    { name: 'Assessment Methods', count: 18, percentage: 10 },
  ];

  const recentActivity = [
    { id: 1, type: 'cluster', message: 'New cluster detected: "Math Anxiety" (15 teachers)', time: '2h ago', urgent: true, link: '/clusters' },
    { id: 2, type: 'dispatch', message: 'Training "Visualizing Fractions" dispatched to 42 teachers', time: '4h ago', urgent: false, link: '/modules/dispatch' },
    { id: 3, type: 'alert', message: 'Burnout signal detected in Block A', time: '5h ago', urgent: true, link: '/analytics' },
    { id: 4, type: 'entry', message: '12 new voice entries from District B', time: '6h ago', urgent: false, link: '/entries' },
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Metrics Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<SchoolIcon sx={{ fontSize: 28 }} />}
              title="Teachers In Classroom"
              value={metrics?.totalTeachers || 0}
              trend={`${metrics?.activeTeachers || 0} active now`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<AssignmentIcon sx={{ fontSize: 28 }} />}
              title="Stories Shared"
              value={metrics?.totalReflections || 0}
              trend={`${metrics?.weeklyReflections || 0} this week`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
              title="Module Completion"
              value={`${metrics?.completedTrainings || 0}`}
              trend="Rising steadily"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<StarIcon sx={{ fontSize: 28 }} />}
              title="Happiness Index"
              value={metrics?.avgSentiment ? (metrics.avgSentiment * 10).toFixed(1) : '4.6'}
              trend="Teachers feel heard"
            />
          </Grid>
        </Grid>

        {/* Loading Overlay */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        {/* Charts Row */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>
                Engagement Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends.length > 0 ? trends : []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="reflections" stroke="#FF7043" name="Reflections" />
                  <Line type="monotone" dataKey="engagement" stroke="#26A69A" name="Engagement %" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>

            {/* Geographic Heat Map */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h3">Regional Heat Map</Typography>
                <Button endIcon={<ArrowForwardIcon />} size="small">View Full Map</Button>
              </Box>
              <Box sx={{
                height: 300,
                bgcolor: '#F5F5F5',
                borderRadius: 2,
                p: 2,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2
              }}>
                {districts.map((district) => (
                  <MuiTooltip key={district.id} title={`${district.name}: ${district.value} issues reported`} arrow>
                    <Box sx={{
                      bgcolor: district.color,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.05)', boxShadow: 2 }
                    }}>
                      {district.name}
                    </Box>
                  </MuiTooltip>
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            {/* Top Challenges */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>
                Top Challenges This Week
              </Typography>
              {challenges.map((challenge, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{challenge.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {challenge.count}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: 'grey.100',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${challenge.percentage}%`,
                        height: '100%',
                        bgcolor: 'primary.main',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Paper>

            {/* Recent Activity Feed */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h3">Recent Activity</Typography>
                <Button endIcon={<ArrowForwardIcon />} size="small">View All</Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivity.map((activity) => (
                  <Box
                    key={activity.id}
                    onClick={() => navigate(activity.link)}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      alignItems: 'start',
                      pb: 2,
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: activity.urgent ? 'error.main' : 'secondary.main',
                      mt: 1,
                      flexShrink: 0
                    }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {activity.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;
