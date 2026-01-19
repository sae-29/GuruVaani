import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  Add,
  PlayArrow,
  Edit,
  ContentCopy,
  Archive,
  Send,
  FilterList,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Module {
  id: string;
  title: string;
  duration: number;
  format: 'video' | 'audio' | 'text';
  subjects: string[];
  grades: string[];
  usage: {
    sent: number;
    completed: number;
  };
  rating: number;
  reviews: number;
  lastUpdated: string;
  thumbnail?: string;
}

const ModuleLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  const modules: Module[] = [
    {
      id: '1',
      title: 'Engaging Math Reluctant Learners',
      duration: 8,
      format: 'video',
      subjects: ['Math'],
      grades: ['4', '5'],
      usage: { sent: 42, completed: 35 },
      rating: 4.5,
      reviews: 23,
      lastUpdated: '10 Jan 2026',
    },
    {
      id: '2',
      title: 'Visualizing Fraction Operations',
      duration: 5,
      format: 'video',
      subjects: ['Math'],
      grades: ['4', '5', '6'],
      usage: { sent: 38, completed: 32 },
      rating: 4.6,
      reviews: 18,
      lastUpdated: '8 Jan 2026',
    },
    {
      id: '3',
      title: 'Classroom Management Basics',
      duration: 12,
      format: 'audio',
      subjects: ['General'],
      grades: ['1', '2', '3', '4', '5'],
      usage: { sent: 56, completed: 45 },
      rating: 4.8,
      reviews: 34,
      lastUpdated: '15 Jan 2026',
    },
  ];

  const handleCreateModule = () => {
    navigate('/modules/create');
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video':
        return '🎥';
      case 'audio':
        return '🎧';
      case 'text':
        return '📄';
      default:
        return '📄';
    }
  };

  const getCompletionRate = (module: Module) => {
    return Math.round((module.usage.completed / module.usage.sent) * 100);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Training Modules
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateModule}
          sx={{
            bgcolor: '#FF7043',
            '&:hover': { bgcolor: '#FF5722' },
          }}
        >
          Create New Module
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="All Modules" />
        <Tab label="Published" />
        <Tab label="Drafts" />
        <Tab label="Archived" />
      </Tabs>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search modules..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={(e) => setFilterAnchor(e.currentTarget)}
        >
          Filters
        </Button>
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={() => setFilterAnchor(null)}
        >
          <MenuItem onClick={() => setSelectedSubject('all')}>
            Subject: {selectedSubject === 'all' ? 'All' : selectedSubject}
          </MenuItem>
          <MenuItem onClick={() => setSelectedGrade('all')}>
            Grade: {selectedGrade === 'all' ? 'All' : selectedGrade}
          </MenuItem>
          <MenuItem onClick={() => setSelectedFormat('all')}>
            Format: {selectedFormat === 'all' ? 'All' : selectedFormat}
          </MenuItem>
        </Menu>
      </Box>

      {/* Module Grid */}
      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={module.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                sx={{
                  height: 160,
                  bgcolor: '#FF7043',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 48,
                }}
              >
                {getFormatIcon(module.format)}
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom noWrap>
                  {module.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  <Chip label={`${module.duration} min`} size="small" />
                  <Chip label={getFormatIcon(module.format)} size="small" />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  {module.subjects.map((subject) => (
                    <Chip key={subject} label={subject} size="small" variant="outlined" />
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Sent to {module.usage.sent} teachers • {getCompletionRate(module)}% completed
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">⭐ {module.rating}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({module.reviews} reviews)
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Last updated: {module.lastUpdated}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Box>
                  <IconButton size="small" title="Preview">
                    <PlayArrow />
                  </IconButton>
                  <IconButton size="small" title="Edit">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" title="Duplicate">
                    <ContentCopy />
                  </IconButton>
                  <IconButton size="small" title="Archive">
                    <Archive />
                  </IconButton>
                </Box>
                <IconButton size="small" title="Send" color="primary">
                  <Send />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ModuleLibrary;
