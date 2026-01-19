import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  Fab,
  Menu,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Search,
  Add,
  FilterList,
  MoreVert,
  Psychology,
} from '@mui/icons-material';

const EntriesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

  // Mock data
  const reflections = [
    {
      id: '1',
      title: 'Math Division - Class 4',
      content: 'Today I taught division to my Class 4 students. Many students struggled with the concept of remainders...',
      subject: 'Mathematics',
      grade: 'Class 4',
      mood: 'FRUSTRATED',
      sentiment: -0.2,
      tags: ['division', 'visual-aids', 'struggling-students'],
      aiSuggestions: ['Try using manipulatives', 'Consider peer tutoring'],
      createdAt: '2024-01-15T10:30:00Z',
      status: 'AI_ANALYZED',
    },
    {
      id: '2',
      title: 'Science Experiment Success',
      content: 'The volcano experiment was a huge hit! Students were engaged and asking great questions...',
      subject: 'Science',
      grade: 'Class 5',
      mood: 'EXCITED',
      sentiment: 0.8,
      tags: ['experiment', 'engagement', 'hands-on'],
      aiSuggestions: ['Build on this success', 'Document student questions'],
      createdAt: '2024-01-14T14:20:00Z',
      status: 'CLUSTERED',
    },
    {
      id: '3',
      title: 'Reading Comprehension Challenge',
      content: 'Some students are still struggling with reading comprehension. Need new strategies...',
      subject: 'English',
      grade: 'Class 3',
      mood: 'NEUTRAL',
      sentiment: 0.1,
      tags: ['reading', 'comprehension', 'strategies'],
      aiSuggestions: ['Try guided reading', 'Use graphic organizers'],
      createdAt: '2024-01-13T09:15:00Z',
      status: 'AI_ANALYZED',
    },
  ];

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'HAPPY': return '#4CAF50';
      case 'EXCITED': return '#FFD700';
      case 'NEUTRAL': return '#757575';
      case 'FRUSTRATED': return '#E53935';
      case 'CONFUSED': return '#FF9800';
      default: return '#757575';
    }
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.2) return { label: 'Positive', color: 'success' };
    if (sentiment < -0.2) return { label: 'Negative', color: 'error' };
    return { label: 'Neutral', color: 'default' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AI_ANALYZED': return 'secondary';
      case 'CLUSTERED': return 'success';
      default: return 'default';
    }
  };

  const filteredReflections = reflections.filter(reflection =>
    reflection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reflection.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reflection.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: '390px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#FF7043', maxWidth: '390px', margin: '0 auto' }}>
        <Toolbar sx={{ minHeight: 56, px: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '18px' }}>
            My Reflections
          </Typography>
          <IconButton
            color="inherit"
            onClick={(e) => setFilterAnchor(e.currentTarget)}
            size="small"
          >
            <FilterList />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Search */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search reflections..."
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

      {/* AI Insights */}
      <Card sx={{ mx: 2, mb: 2, borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Psychology sx={{ color: '#FF7043', mr: 1 }} />
            <Typography variant="h6">
              AI Insights
            </Typography>
          </Box>
          <Alert severity="info" sx={{ mb: 1 }}>
            Your recent reflections show a focus on visual learning methods. Consider exploring our "Visual Teaching Strategies" training module.
          </Alert>
          <Alert severity="warning">
            Detected some frustration with math concepts. We've grouped similar challenges from other teachers for collaborative solutions.
          </Alert>
        </CardContent>
      </Card>

              {/* Reflections List */}
              <Box sx={{ px: 2, pb: 2 }}>
        {filteredReflections.map((reflection) => (
          <Card key={reflection.id} sx={{ mb: 2, borderRadius: 3 }}>
            <CardContent>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {reflection.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      size="small"
                      label={reflection.subject}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      label={reflection.grade}
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      label={reflection.mood.toLowerCase()}
                      sx={{
                        backgroundColor: getMoodColor(reflection.mood),
                        color: 'white',
                      }}
                    />
                  </Box>
                </Box>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>

              {/* Content Preview */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {reflection.content.substring(0, 120)}...
              </Typography>

              {/* Tags */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {reflection.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    size="small"
                    label={tag}
                    variant="outlined"
                  />
                ))}
              </Box>

              {/* AI Analysis */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    size="small"
                    label={getSentimentLabel(reflection.sentiment).label}
                    color={getSentimentLabel(reflection.sentiment).color as any}
                  />
                  <Chip
                    size="small"
                    label={reflection.status.replace('_', ' ')}
                    color={getStatusColor(reflection.status) as any}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(reflection.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              {/* AI Suggestions Preview */}
              {reflection.aiSuggestions.length > 0 && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  <strong>AI Suggestion:</strong> {reflection.aiSuggestions[0]}
                  {reflection.aiSuggestions.length > 1 && ` (+${reflection.aiSuggestions.length - 1} more)`}
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredReflections.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No reflections found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by creating your first reflection'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
      >
        <MenuItem onClick={() => setFilterAnchor(null)}>All Subjects</MenuItem>
        <MenuItem onClick={() => setFilterAnchor(null)}>Mathematics</MenuItem>
        <MenuItem onClick={() => setFilterAnchor(null)}>Science</MenuItem>
        <MenuItem onClick={() => setFilterAnchor(null)}>English</MenuItem>
        <MenuItem onClick={() => setFilterAnchor(null)}>This Week</MenuItem>
        <MenuItem onClick={() => setFilterAnchor(null)}>This Month</MenuItem>
      </Menu>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 90,
          right: 16,
          backgroundColor: '#FF7043',
          '&:hover': { backgroundColor: '#E64A19' },
        }}
        onClick={() => navigate('/create-entry')}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default EntriesScreen;