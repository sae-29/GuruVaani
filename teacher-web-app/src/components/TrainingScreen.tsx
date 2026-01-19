import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  LinearProgress,
  Rating,
  Alert,
} from '@mui/material';
import {
  Search,
  PlayArrow,
  Bookmark,
  BookmarkBorder,
  Star,
  TrendingUp,
  Psychology,
} from '@mui/icons-material';

const TrainingScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('recommended');

  // Mock data
  const recommendations = [
    {
      id: '1',
      title: 'Visual Learning Strategies',
      description: 'Learn effective techniques for visual learners based on your recent reflections about math concepts.',
      duration: 45,
      difficulty: 'INTERMEDIATE',
      rating: 4.7,
      totalRatings: 156,
      relevanceScore: 0.92,
      reasoning: 'Matches your recent challenges with visual aids in mathematics',
      isBookmarked: false,
    },
    {
      id: '2',
      title: 'Classroom Management for Primary Grades',
      description: 'Proven strategies to maintain engagement and handle disruptions effectively.',
      duration: 60,
      difficulty: 'BEGINNER',
      rating: 4.5,
      totalRatings: 203,
      relevanceScore: 0.85,
      reasoning: 'Recommended based on community discussions you might find helpful',
      isBookmarked: true,
    },
  ];

  const myTrainings = [
    {
      id: '3',
      title: 'Student Assessment Methods',
      progress: 75,
      completedAt: null,
      rating: 4,
      duration: 90,
    },
    {
      id: '4',
      title: 'Inclusive Teaching Practices',
      progress: 100,
      completedAt: '2024-01-10',
      rating: 5,
      duration: 120,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return '#4CAF50';
      case 'INTERMEDIATE': return '#FF9800';
      case 'ADVANCED': return '#E53935';
      default: return '#757575';
    }
  };

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#26A69A', minHeight: 64 }}>
        <Toolbar sx={{ minHeight: 64 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Learning & Training
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Search */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search training modules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={activeTab === 'recommended' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('recommended')}
            startIcon={<Psychology />}
          >
            AI Recommended
          </Button>
          <Button
            variant={activeTab === 'my-trainings' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('my-trainings')}
          >
            My Trainings
          </Button>
        </Box>
      </Box>

              <Box sx={{ px: 2, pb: 2 }}>
        {activeTab === 'recommended' && (
          <>
            {/* AI Recommendations Header */}
            <Alert severity="info" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Personalized recommendations based on your recent reflections and teaching challenges
                </Typography>
              </Box>
            </Alert>

            {/* Recommended Trainings */}
            {recommendations.map((training) => (
              <Card key={training.id} sx={{ mb: 2, borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                      {training.title}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={training.isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                      sx={{ minWidth: 'auto', p: 1 }}
                    >
                    </Button>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {training.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      size="small"
                      label={training.difficulty}
                      sx={{
                        backgroundColor: getDifficultyColor(training.difficulty),
                        color: 'white',
                      }}
                    />
                    <Chip
                      size="small"
                      label={`${training.duration} min`}
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      label={`${Math.round(training.relevanceScore * 100)}% match`}
                      color="primary"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={training.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      {training.rating} ({training.totalRatings} reviews)
                    </Typography>
                  </Box>

                  <Alert severity="success" sx={{ mb: 2 }}>
                    <Typography variant="caption">
                      <strong>Why recommended:</strong> {training.reasoning}
                    </Typography>
                  </Alert>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PlayArrow />}
                    sx={{
                      backgroundColor: '#26A69A',
                      '&:hover': { backgroundColor: '#00897B' },
                    }}
                  >
                    Start Training
                  </Button>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {activeTab === 'my-trainings' && (
          <>
            {/* My Trainings */}
            {myTrainings.map((training) => (
              <Card key={training.id} sx={{ mb: 2, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {training.title}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Progress: {training.progress}%
                      </Typography>
                      <Typography variant="caption">
                        {training.duration} min
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={training.progress}
                      sx={{
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: training.progress === 100 ? '#4CAF50' : '#26A69A',
                        },
                      }}
                    />
                  </Box>

                  {training.completedAt ? (
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label="Completed"
                        color="success"
                        size="small"
                        icon={<Star />}
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ mr: 1 }}>
                          Your rating:
                        </Typography>
                        <Rating value={training.rating} size="small" readOnly />
                      </Box>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<PlayArrow />}
                      sx={{
                        backgroundColor: '#26A69A',
                        '&:hover': { backgroundColor: '#00897B' },
                      }}
                    >
                      Continue Training
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}

            {myTrainings.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No trainings started yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check out our AI recommendations to get started
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default TrainingScreen;