import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Button,
  Paper,
  TextField,
  DialogActions,
} from '@mui/material';
import { Cluster } from '@/types/admin';

interface ClusterGridProps {
  clusters?: Cluster[];
}

export const ClusterGrid: React.FC<ClusterGridProps> = ({ clusters = [] }) => {
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const mockClusters: Cluster[] = [
    {
      id: '1',
      title: 'Fraction Division - Conceptual Understanding',
      description: 'Students struggling with conceptual understanding of fraction division',
      keywords: ['division', 'fractions', 'why', 'confused', 'visual'],
      priority: 'HIGH',
      teacherCount: 24,
      frequency: 24,
      avgSentiment: -0.6,
      entryIds: ['1', '2', '3'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Classroom Noise Management',
      description: 'Teachers seeking strategies for managing noisy classroom environments',
      keywords: ['noise', 'classroom', 'management', 'discipline', 'silence'],
      priority: 'MEDIUM',
      teacherCount: 18,
      frequency: 18,
      avgSentiment: -0.4,
      entryIds: ['4', '5'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const displayClusters = clusters.length > 0 ? clusters : mockClusters;

  const handleClusterClick = (cluster: Cluster) => {
    setSelectedCluster(cluster);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedCluster(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'error.main';
      case 'HIGH':
        return 'warning.main';
      case 'MEDIUM':
        return 'info.main';
      default:
        return 'success.main';
    }
  };

  return (
    <Box>
      {/* Cluster Cards Grid */}
      <Grid container spacing={3}>
        {displayClusters.map((cluster) => (
          <Grid item xs={12} md={6} key={cluster.id}>
            <Card
              sx={{
                cursor: 'pointer',
                borderLeft: `4px solid`,
                borderLeftColor: getPriorityColor(cluster.priority),
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => handleClusterClick(cluster)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Typography variant="h4" sx={{ flex: 1 }}>
                    {cluster.title}
                  </Typography>
                  <Typography variant="caption" sx={{ backgroundColor: '#E8F5E9', px: 1.5, py: 0.5, borderRadius: 1 }}>
                    {cluster.teacherCount} teachers
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {cluster.keywords?.slice(0, 5).map((keyword, idx) => (
                    <Typography
                      key={idx}
                      variant="caption"
                      sx={{
                        background: '#F5F5F5',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: 11,
                      }}
                    >
                      {keyword}
                    </Typography>
                  ))}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {cluster.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined">
                    View All ({cluster.entryIds.length})
                  </Button>
                  <Button size="small" variant="outlined">
                    Assign Training
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Cluster Detail Modal */}
      <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h3">{selectedCluster?.title}</Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedCluster?.teacherCount} teachers affected
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedCluster && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Keywords
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {selectedCluster.keywords?.map((keyword, idx) => (
                  <Chip key={idx} label={keyword} />
                ))}
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Suggested Training
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  📚 Visualizing Fraction Operations (4.6⭐) - 92% match
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  📚 Concrete-Pictorial-Abstract Math (4.4⭐) - 85% match
                </Typography>
              </Paper>

              <TextField
                fullWidth
                label="Dispatch deadline"
                type="date"
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Cancel</Button>
          <Button variant="contained">Dispatch Training to All</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
