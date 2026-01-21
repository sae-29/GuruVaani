import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { ClusterGrid } from '../components/ClusterGrid';

export const ClustersPage: React.FC = () => {
  const [sensitivity, setSensitivity] = useState<number>(70);
  const [timeRange, setTimeRange] = useState('week');

  // Simulate cluster count based on sensitivity (Higher sensitivity = more specific = more clusters)
  const estimatedClusters = Math.round(5 + (sensitivity - 50) * 0.4);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Cluster Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          AI-powered clustering of teacher challenges. Adjust sensitivity to refine groupings.
        </Typography>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Clustering Sensitivity</Typography>
              <Typography fontWeight="bold" color="primary">{sensitivity}%</Typography>
            </Box>
            <Slider
              value={sensitivity}
              onChange={(_, val) => setSensitivity(val as number)}
              valueLabelDisplay="auto"
              step={5}
              marks
              min={50}
              max={100}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Broader Groups
              </Typography>
              <Typography variant="caption" color="primary.main" fontWeight="medium">
                ~{estimatedClusters} Clusters Est.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Specific Groups
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Time Range</InputLabel>
              <Select value={timeRange} label="Time Range" onChange={(e) => setTimeRange(e.target.value)}>
                <MenuItem value="week">Last 7 Days</MenuItem>
                <MenuItem value="month">Last 30 Days</MenuItem>
                <MenuItem value="quarter">Last Quarter</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>AI Method</InputLabel>
              <Select defaultValue="semantic" label="AI Method">
                <MenuItem value="semantic">Semantic Similarity</MenuItem>
                <MenuItem value="keyword">Keyword Matching</MenuItem>
                <MenuItem value="topic">Topic Modeling</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <ClusterGrid />
    </Container>
  );
};
