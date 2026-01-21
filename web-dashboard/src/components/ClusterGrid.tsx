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
import { designTokens } from 'guru-vaani-shared';

interface ClusterGridProps {
  clusters?: Cluster[];
}

export const ClusterGrid: React.FC<ClusterGridProps> = ({ clusters = [] }) => {
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  // ... (mockClusters stay the same or could be improved)
  const mockClusters: Cluster[] = [
    {
      id: '1',
      title: 'Fraction Division Challenges',
      description: 'Teachers are finding it hard to explain the "flip and multiply" concept visually.',
      keywords: ['division', 'fractions', 'visual-aids', 'conceptual'],
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
      title: 'Classroom Noise Levels',
      description: 'Group activities are leading to high noise levels, causing teacher stress.',
      keywords: ['noise', 'management', 'group-work', 'stress'],
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
      case 'CRITICAL': return designTokens.colors.error.main;
      case 'HIGH': return designTokens.colors.warning.main;
      case 'MEDIUM': return designTokens.colors.info.main;
      default: return designTokens.colors.success.main;
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {displayClusters.map((cluster) => (
          <Grid item xs={12} md={6} key={cluster.id}>
            <Card
              sx={{
                cursor: 'pointer',
                borderRadius: '16px',
                borderLeft: `6px solid`,
                borderLeftColor: getPriorityColor(cluster.priority),
                boxShadow: designTokens.shadows.card,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: designTokens.shadows.elevated,
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => handleClusterClick(cluster)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h3" sx={{ flex: 1, fontWeight: 700 }}>
                    {cluster.title}
                  </Typography>
                  <Chip
                    label={`${cluster.teacherCount} Teachers`}
                    size="small"
                    sx={{
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      fontWeight: 600,
                      borderRadius: '8px'
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {cluster.keywords?.slice(0, 5).map((keyword, idx) => (
                    <Chip
                      key={idx}
                      label={`#${keyword}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.7rem',
                        height: '24px',
                        borderColor: 'divider',
                        color: 'text.secondary'
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {cluster.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    disableElevation
                    sx={{ borderRadius: '8px' }}
                  >
                    Help this Cluster
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    sx={{ color: 'text.secondary' }}
                  >
                    Review Entries ({cluster.entryIds.length})
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Cluster Detail Modal */}
      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle>
          <Typography variant="h2" sx={{ fontWeight: 800 }}>{selectedCluster?.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Impacted Group: {selectedCluster?.teacherCount} educators sharing similar challenges
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          {selectedCluster && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                Common Themes Detected
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
                {selectedCluster.keywords?.map((keyword, idx) => (
                  <Chip
                    key={idx}
                    label={keyword}
                    sx={{ borderRadius: '8px', bgcolor: 'grey.100' }}
                  />
                ))}
              </Box>

              <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: '12px', border: '1px dashed', borderColor: 'primary.main', mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'primary.main', mb: 1, fontWeight: 700 }}>
                  🤖 AI Intervention Suggestion
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1.5 }}>
                  Teachers in this cluster are resilient but overwhelmed. Suggesting a light-weight micro-module:
                </Typography>
                <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '8px', border: 'none', bgcolor: 'white' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    📚 Visualizing Math: Fraction Stories (4.6⭐)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Micro-video • 4 mins • High Engagement
                  </Typography>
                </Paper>
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                When should this reach them?
              </Typography>
              <TextField
                fullWidth
                type="date"
                size="small"
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDetail} sx={{ color: 'text.secondary' }}>Not Now</Button>
          <Button
            variant="contained"
            disableElevation
            fullWidth
            sx={{ borderRadius: '8px', py: 1.2 }}
          >
            Dispatch Help to {selectedCluster?.teacherCount} Teachers
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
