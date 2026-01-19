import React from 'react';
import { Container, Box, Typography, Paper, Grid } from '@mui/material';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const engagementData = [
    { period: 'Week 1', entries: 45, completions: 35, engagement: 78 },
    { period: 'Week 2', entries: 52, completions: 42, engagement: 81 },
    { period: 'Week 3', entries: 48, completions: 39, engagement: 81 },
    { period: 'Week 4', entries: 61, completions: 49, engagement: 80 },
  ];

  const topModules = [
    { name: 'Classroom Management', rating: 4.8, completions: 56 },
    { name: 'Engaging Learners', rating: 4.7, completions: 42 },
    { name: 'Visualizing Math', rating: 4.6, completions: 38 },
  ];

  const sentimentData = [
    { name: 'Positive', value: 68, fill: '#66BB6A' },
    { name: 'Neutral', value: 24, fill: '#FFA726' },
    { name: 'Negative', value: 8, fill: '#E53935' },
  ];

  // Placeholder datasets for future visualizations removed to satisfy lint

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Analytics Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track engagement, completion rates, and teacher feedback
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Engagement Trends */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Engagement Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="entries" stroke="#FF7043" strokeWidth={2} />
                <Line type="monotone" dataKey="completions" stroke="#26A69A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Sentiment Breakdown */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Sentiment Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Topic Evolution Placeholder */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>Topic Evolution</Typography>
            <Box sx={{ height: 250, bgcolor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Typography color="text.secondary">Topic Growth Chart (Mock)</Typography>
            </Box>
          </Paper>
        </Grid>

         {/* Teacher Journey Funnel Placeholder */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>Teacher Journey Funnel</Typography>
            <Box sx={{ height: 250, bgcolor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Typography color="text.secondary">Funnel Visualization (Mock)</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Geographic Performance Placeholder */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>Geographic Performance</Typography>
             <Box sx={{ height: 200, bgcolor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Typography color="text.secondary">Regional Stats Table (Mock)</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Top Rated Modules */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Top Performing Modules
            </Typography>
            <Box>
              {topModules.map((module, idx) => (
                <Box key={idx} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #E0E0E0', '&:last-child': { borderBottom: 'none' } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {module.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="warning.main" sx={{ mr: 1, fontWeight: 'bold' }}>
                        ★ {module.rating}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({module.completions} completions)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsPage;
