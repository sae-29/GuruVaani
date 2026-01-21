import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  FilterList,
  Visibility,
  Mic,
  TextSnippet,
  Close,
  Refresh,
} from '@mui/icons-material';
import { ClusterGrid } from '../components/ClusterGrid';
import api from '../services/api';
import { designTokens } from 'guru-vaani-shared';

interface DiaryEntry {
  id: string;
  teacherId: string; // Anonymized
  date: string;
  type: 'text' | 'voice';
  preview: string;
  fullContent: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  tags: string[];
  block: string;
  grade: string;
  subject: string;
  clusterId?: string;
  status: 'new' | 'reviewed' | 'flagged';
}

export const EntriesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'cluster'>('list');
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter States
  const [dateRange, setDateRange] = useState('today');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');

  // AI Override State
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');

  // API State
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setApiError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/entries/admin/list', {
        params: {
          grade: grade || undefined,
          subject: subject || undefined,
        }
      });

      if (response.data.success) {
        // Map backend response to local DiaryEntry interface
        const backendEntries = response.data.data.entries.map((e: any) => ({
          id: e.id,
          teacherId: e.author?.id?.substring(0, 6) || 'N/A',
          date: new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          type: e.audioUrl ? 'voice' : 'text',
          preview: e.content?.substring(0, 100) + (e.content?.length > 100 ? '...' : ''),
          fullContent: e.content,
          sentiment: e.sentiment > 0.3 ? 'positive' : e.sentiment < -0.3 ? 'negative' : 'neutral',
          tags: (e.tags || '').split(',').filter(Boolean),
          block: e.school?.block || 'N/A',
          grade: e.grade || 'N/A',
          subject: e.subject || 'General',
          status: e.status?.toLowerCase() === 'reviewed' ? 'reviewed' : 'new',
        }));
        setEntries(backendEntries);
      }
    } catch (err: any) {
      setApiError(err.response?.data?.error || 'Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  }, [grade, subject]);

  useEffect(() => {
    fetchEntries();

    // Near real-time: Refresh every 30 seconds
    const interval = setInterval(fetchEntries, 30000);
    return () => clearInterval(interval);
  }, [fetchEntries]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setViewMode(newValue === 0 ? 'list' : 'cluster');
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return designTokens.colors.success.main;
      case 'negative': return designTokens.colors.error.main;
      default: return designTokens.colors.warning.main;
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Thriving ✨';
      case 'negative': return 'Struggling ‼️';
      default: return 'Needs Support 🤝';
    }
  };

  // Filter Logic - Apply local filtering on top of API data for smoothest experience
  const filteredEntries = entries.filter(entry => {
    // Subject filter
    if (subject && entry.subject.toLowerCase() !== subject.toLowerCase()) {
      if (subject === 'language' && entry.subject !== 'English' && entry.subject !== 'Hindi') return false;
      if (subject !== 'language') return false;
    }

    // Grade filter
    if (grade && entry.grade !== grade) return false;

    return true;
  });

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h2" fontWeight="800">Community Stories</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Listening to our teachers, one reflection at a time.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
              onClick={fetchEntries}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button variant="outlined" startIcon={<FilterList />} onClick={() => setFilterOpen(!filterOpen)}>
              Filters
            </Button>
          </Box>
        </Box>

        {/* View Toggle */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={viewMode === 'list' ? 0 : 1} onChange={handleTabChange}>
            <Tab label="List View" />
            <Tab label="Cluster View (AI)" />
          </Tabs>
        </Paper>

        {/* Filter Bar (Conditional) */}
        {filterOpen && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Date Range</InputLabel>
                <Select value={dateRange} label="Date Range" onChange={(e) => setDateRange(e.target.value)}>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Subject</InputLabel>
                <Select value={subject} label="Subject" onChange={(e) => setSubject(e.target.value)}>
                  <MenuItem value="">All Subjects</MenuItem>
                  <MenuItem value="Mathematics">Math</MenuItem>
                  <MenuItem value="Science">Science</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Hindi">Hindi</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Grade</InputLabel>
                <Select value={grade} label="Grade" onChange={(e) => setGrade(e.target.value)}>
                  <MenuItem value="">All Grades</MenuItem>
                  <MenuItem value="Class 1">Class 1</MenuItem>
                  <MenuItem value="Class 2">Class 2</MenuItem>
                  <MenuItem value="Class 3">Class 3</MenuItem>
                  <MenuItem value="Class 4">Class 4</MenuItem>
                  <MenuItem value="Class 5">Class 5</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>
        )}

        {viewMode === 'list' ? (
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Teacher (Anon)</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Content Preview</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Sentiment</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id} hover>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.teacherId}</TableCell>
                      <TableCell>
                        {entry.type === 'voice' ? <Mic color="action" /> : <TextSnippet color="action" />}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography variant="body2" noWrap>{entry.preview}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {entry.tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" sx={{ fontSize: '0.7rem' }} />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getSentimentLabel(entry.sentiment)}
                          size="small"
                          sx={{
                            bgcolor: `${getSentimentColor(entry.sentiment)}15`,
                            color: getSentimentColor(entry.sentiment),
                            fontWeight: 600,
                            borderRadius: '6px'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => setSelectedEntry(entry)}>
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <ClusterGrid />
        )}

        {/* Entry Detail Modal */}
        <Dialog open={!!selectedEntry} onClose={() => setSelectedEntry(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">Entry Details</Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedEntry?.date} • {selectedEntry?.teacherId} • {selectedEntry?.block}
              </Typography>
            </Box>
            <IconButton onClick={() => setSelectedEntry(null)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle2" gutterBottom color="primary">Original Reflection</Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#fafafa' }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {selectedEntry?.fullContent}
                  </Typography>
                </Paper>

                {selectedEntry?.type === 'voice' && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Audio Recording</Typography>
                    <audio controls style={{ width: '100%' }}>
                      <source src="" type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ bgcolor: '#F5F9FF', p: 2, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" color="primary">AI Analysis</Typography>
                    <Button
                      size="small"
                      onClick={() => setIsEditing(!isEditing)}
                      sx={{ fontSize: '0.7rem' }}
                    >
                      {isEditing ? 'Done' : 'Override AI'}
                    </Button>
                  </Box>

                  <Typography variant="caption" display="block" sx={{ mb: 1 }}>Key Topics</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {selectedEntry?.tags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        color="primary"
                        variant={isEditing ? "outlined" : "filled"}
                        onDelete={isEditing ? () => setSelectedEntry(prev => prev ? { ...prev, tags: prev.tags.filter(t => t !== tag) } : prev) : undefined}
                      />
                    ))}
                    {isEditing && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                        <TextField
                          size="small"
                          placeholder="Add tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newTag.trim() && selectedEntry) {
                              setSelectedEntry({ ...selectedEntry, tags: [...selectedEntry.tags, newTag.trim()] });
                              setNewTag('');
                            }
                          }}
                          fullWidth
                          sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
                        />
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => {
                            if (newTag.trim() && selectedEntry) {
                              setSelectedEntry({ ...selectedEntry, tags: [...selectedEntry.tags, newTag.trim()] });
                              setNewTag('');
                            }
                          }}
                          sx={{ minWidth: 0, p: 0.5 }}
                        >
                          +
                        </Button>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="caption" display="block" sx={{ mb: 1 }}>Sentiment</Typography>
                  <Chip
                    label={selectedEntry?.sentiment}
                    size="small"
                    sx={{ mb: 2, textTransform: 'capitalize' }}
                  />

                  <Typography variant="caption" display="block" sx={{ mb: 1 }}>Actions</Typography>
                  <Button variant="contained" fullWidth size="small" sx={{ mb: 1 }}>
                    Recommend Training
                  </Button>
                  <Button variant="outlined" fullWidth size="small">
                    Add to Cluster
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default EntriesPage;
