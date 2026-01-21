import React, { useState, useEffect } from 'react';
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
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  AutoAwesome,
  Lightbulb,
  HistoryEdu,
  Refresh,
} from '@mui/icons-material';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const EntriesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [reflections, setReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/entries/my`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      const result = await response.json();
      if (result.success) {
        setReflections(result.data.entries || []);
      }
    } catch (error) {
      console.error('Failed to fetch entries', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const getMoodFromSentiment = (sentiment: number | null) => {
    if (sentiment === null) return { label: 'NEUTRAL', color: '#757575' };
    if (sentiment > 0.6) return { label: 'EXCITED', color: '#FFD700' };
    if (sentiment > 0.2) return { label: 'HAPPY', color: '#4CAF50' };
    if (sentiment < -0.6) return { label: 'FRUSTRATED', color: '#E53935' };
    if (sentiment < -0.2) return { label: 'CONFUSED', color: '#FF9800' };
    return { label: 'NEUTRAL', color: '#757575' };
  };

  const filteredReflections = reflections.filter(reflection =>
    (reflection.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (reflection.content?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (reflection.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ pb: 10, width: '100%', bgcolor: '#FAFBFD', minHeight: '100vh' }}>
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
            Your Journey
          </Typography>
          <IconButton size="small" onClick={fetchEntries} sx={{ mr: 1 }}>
            <Refresh color="primary" />
          </IconButton>
          <IconButton size="small" onClick={(e) => setFilterAnchor(e.currentTarget)}>
            <FilterList color="primary" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Search */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Find a memory or lesson..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '16px',
              bgcolor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="primary" sx={{ opacity: 0.5 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* AI Insights Card (Simplified) */}
      <Card elevation={0} sx={{
        mx: 2,
        mb: 3,
        borderRadius: '24px',
        bgcolor: 'rgba(38, 166, 154, 0.1)',
        border: '1px solid rgba(38, 166, 154, 0.1)'
      }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <AutoAwesome sx={{ color: '#26A69A' }} />
            <Typography variant="subtitle2" fontWeight="800" color="#1B7D73">
              Weekly Insight
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#1B7D73', fontWeight: 600, lineHeight: 1.5 }}>
            Consistently sharing reflections helps your community grow. Every story matters!
          </Typography>
        </CardContent>
      </Card>

      {/* Reflections List */}
      <Box sx={{ px: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress size={30} />
          </Box>
        ) : filteredReflections.length > 0 ? (
          filteredReflections.map((reflection) => {
            const mood = getMoodFromSentiment(reflection.sentiment);
            const tags = (reflection.tags || '').split(',').filter(Boolean);

            return (
              <Card
                key={reflection.id}
                elevation={0}
                onClick={() => navigate(`/entry/${reflection.id}`)}
                sx={{
                  mb: 2,
                  borderRadius: '20px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:active': { transform: 'scale(0.98)' }
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        size="small"
                        label={reflection.subject || 'General'}
                        sx={{ fontWeight: 800, borderRadius: '8px', fontSize: '10px' }}
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label={reflection.grade || 'Any'}
                        sx={{ fontWeight: 800, borderRadius: '8px', fontSize: '10px' }}
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                      {new Date(reflection.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 1 }}>
                    {reflection.title || 'Personal Reflection'}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {reflection.content}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {tags.slice(0, 2).map((tag: string, i: number) => (
                        <Typography key={i} variant="caption" sx={{ fontWeight: 800, color: 'primary.main', bgcolor: 'primary.lighter', px: 1, borderRadius: '6px' }}>
                          #{tag.trim()}
                        </Typography>
                      ))}
                    </Box>
                    <Box sx={{
                      bgcolor: `${mood.color}15`,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: mood.color, fontSize: '10px' }}>
                        {mood.label}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 800 }}>
              Your space is waiting
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm ? "We couldn't find that memory." : "Start writing your first story today."}
            </Typography>
            {!searchTerm && (
              <Button
                variant="contained"
                onClick={() => navigate('/create-entry')}
                sx={{ borderRadius: '12px', fontWeight: 800, px: 4 }}
              >
                Start Reflection
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
        PaperProps={{ sx: { borderRadius: '16px', mt: 1 } }}
      >
        <MenuItem onClick={() => setFilterAnchor(null)}>All Subjects</MenuItem>
        <Divider />
        <MenuItem onClick={() => setFilterAnchor(null)}>Earlier This Week</MenuItem>
        <MenuItem onClick={() => setFilterAnchor(null)}>Earlier This Month</MenuItem>
      </Menu>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        variant="extended"
        sx={{
          position: 'fixed',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: '20px',
          fontWeight: 800,
          textTransform: 'none',
          px: 4,
          boxShadow: '0 8px 32px rgba(255, 112, 67, 0.3)',
        }}
        onClick={() => navigate('/create-entry')}
      >
        <HistoryEdu sx={{ mr: 1 }} />
        Tell a Story
      </Fab>
    </Box>
  );
};

export default EntriesScreen;