import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Tooltip as MuiTooltip,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend?: string;
  trendColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, trend, trendColor = 'success.main' }) => (
  <Paper sx={{ p: 2, borderRadius: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ mb: 1 }}>
          {value}
        </Typography>
        {trend && (
          <Typography variant="caption" sx={{ color: trendColor }}>
            {trend}
          </Typography>
        )}
      </Box>
      <Box sx={{ color: 'primary.main', opacity: 0.3 }}>{icon}</Box>
    </Box>
  </Paper>
);

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  const districts = [
    { id: 1, name: 'District A', value: 85, color: '#e57373' }, // High intensity
    { id: 2, name: 'District B', value: 65, color: '#ffb74d' }, // Medium
    { id: 3, name: 'District C', value: 45, color: '#fff176' }, // Low
    { id: 4, name: 'District D', value: 92, color: '#e57373' },
    { id: 5, name: 'District E', value: 30, color: '#81c784' }, // Good
    { id: 6, name: 'District F', value: 55, color: '#ffb74d' },
  ];

  const mockData = [
    { date: 'Mon', entries: 24, completions: 18, engagement: 45 },
    { date: 'Tue', entries: 32, completions: 25, engagement: 52 },
    { date: 'Wed', entries: 28, completions: 22, engagement: 48 },
    { date: 'Thu', entries: 35, completions: 30, engagement: 60 },
    { date: 'Fri', entries: 42, completions: 35, engagement: 68 },
    { date: 'Sat', entries: 18, completions: 14, engagement: 38 },
    { date: 'Sun', entries: 15, completions: 12, engagement: 32 },
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
              icon={<SchoolIcon sx={{ fontSize: 40 }} />}
              title="Active Teachers"
              value="247"
              trend="+12 this week"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<AssignmentIcon sx={{ fontSize: 40 }} />}
              title="New Entries This Week"
              value="89"
              trend="62 text, 27 voice"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
              title="Completion Rate"
              value="78%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon={<StarIcon sx={{ fontSize: 40 }} />}
              title="Avg Satisfaction"
              value="4.6"
              trend="+0.2"
            />
          </Grid>
        </Grid>

        {/* Charts Row */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>
                Engagement Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="entries" stroke="#FF7043" />
                  <Line type="monotone" dataKey="completions" stroke="#26A69A" />
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
