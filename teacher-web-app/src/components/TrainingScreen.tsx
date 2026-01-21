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
  IconButton,
} from '@mui/material';
import {
  Search,
  PlayArrow,
  Bookmark,
  BookmarkBorder,
  AutoAwesome,
  Lightbulb,
  Star,
  EmojiEvents,
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

  return (
    <Box sx={{ pb: 4, width: '100%', bgcolor: '#FAFAFA', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          color: 'text.primary',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
            Learn & Grow
          </Typography>
          <EmojiEvents color="secondary" />
        </Toolbar>
      </AppBar>

      {/* Search */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="What do you want to learn today?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '16px',
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="secondary" sx={{ opacity: 0.5 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Custom Tabs */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Box sx={{
          display: 'flex',
          p: 0.5,
          bgcolor: 'rgba(0,0,0,0.04)',
          borderRadius: '16px',
          gap: 0.5
        }}>
          <Button
            fullWidth
            onClick={() => setActiveTab('recommended')}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 800,
              bgcolor: activeTab === 'recommended' ? 'white' : 'transparent',
              color: activeTab === 'recommended' ? 'secondary.main' : 'text.secondary',
              boxShadow: activeTab === 'recommended' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              '&:hover': { bgcolor: activeTab === 'recommended' ? 'white' : 'rgba(0,0,0,0.02)' }
            }}
          >
            Recommended
          </Button>
          <Button
            fullWidth
            onClick={() => setActiveTab('my-trainings')}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 800,
              bgcolor: activeTab === 'my-trainings' ? 'white' : 'transparent',
              color: activeTab === 'my-trainings' ? 'secondary.main' : 'text.secondary',
              boxShadow: activeTab === 'my-trainings' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              '&:hover': { bgcolor: activeTab === 'my-trainings' ? 'white' : 'rgba(0,0,0,0.02)' }
            }}
          >
            My Modules
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        {activeTab === 'recommended' && (
          <>
            <Box sx={{ px: 1, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <AutoAwesome sx={{ color: 'secondary.main', fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight="800" color="secondary.main">
                  PERSONALIZED FOR YOU
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Based on your classroom stories and professional goals.
              </Typography>
            </Box>

            {/* Recommended Trainings */}
            {recommendations.map((training) => (
              <Card key={training.id} elevation={0} sx={{
                mb: 2.5,
                borderRadius: '24px',
                border: '1px solid rgba(0,0,0,0.05)',
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="800" gutterBottom>
                        {training.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip size="small" label={`${training.duration} min`} sx={{ fontWeight: 700, borderRadius: '8px' }} color="secondary" variant="outlined" />
                        <Chip size="small" label={training.difficulty.toLowerCase()} sx={{ fontWeight: 700, borderRadius: '8px' }} variant="outlined" />
                      </Box>
                    </Box>
                    <IconButton size="small" sx={{ bgcolor: 'grey.50' }}>
                      {training.isBookmarked ? <Bookmark color="secondary" /> : <BookmarkBorder />}
                    </IconButton>
                  </Box>

                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.5, fontWeight: 500 }}>
                    {training.description}
                  </Typography>

                  <Box sx={{
                    bgcolor: 'secondary.light',
                    p: 2,
                    borderRadius: '16px',
                    mb: 3,
                    border: '1px dashed',
                    borderColor: 'secondary.main'
                  }}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Lightbulb sx={{ color: 'secondary.main', fontSize: 20, mt: 0.3 }} />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.dark', display: 'block', mb: 0.5 }}>
                          REASONING BY GURU VAANI AI
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'secondary.dark', fontWeight: 600 }}>
                          {training.reasoning}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    disableElevation
                    startIcon={<PlayArrow />}
                    sx={{
                      py: 2,
                      borderRadius: '16px',
                      fontWeight: 800,
                      bgcolor: 'secondary.main',
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    Start Module
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