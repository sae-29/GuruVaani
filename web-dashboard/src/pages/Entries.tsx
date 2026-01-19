import React, { useState } from 'react';
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
} from '@mui/material';
import {
  FilterList,
  Visibility,
  Mic,
  TextSnippet,
  Close,
} from '@mui/icons-material';
import { ClusterGrid } from '@/components/ClusterGrid';

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
  const [subject, setSubject] = useState('all');
  const [grade, setGrade] = useState('all');

  // AI Override State
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Mock Data
  const entries: DiaryEntry[] = [
    {
      id: '1',
      teacherId: 'T-8392',
      date: 'Jan 18, 2026',
      type: 'voice',
      preview: 'Struggling to explain fraction division to 5th graders...',
      fullContent: "I tried the visual method for fraction division today, but many students were still confused about why we flip the second fraction. They can do the procedure but don't understand the concept. It's frustrating because I want them to really get it.",
      sentiment: 'neutral',
      tags: ['fractions', 'conceptual-understanding', 'math'],
      block: 'Block A',
      grade: '5',
      subject: 'Math',
      clusterId: '1',
      status: 'new',
    },
    {
      id: '2',
      teacherId: 'T-1024',
      date: 'Jan 18, 2026',
      type: 'text',
      preview: 'Classroom noise is getting out of hand during group work...',
      fullContent: "When we do group activities, the noise level rises so much that other classes complain. I want to encourage collaboration, but I don't know how to keep it quiet enough. Need some strategies for noise management.",
      sentiment: 'negative',
      tags: ['classroom-management', 'noise', 'discipline'],
      block: 'Block B',
      grade: '4',
      subject: 'General',
      clusterId: '2',
      status: 'new',
    },
    {
      id: '3',
      teacherId: 'T-5521',
      date: 'Jan 17, 2026',
      type: 'text',
      preview: 'Great success with the new science kit!',
      fullContent: "Used the new science kit for the photosynthesis experiment. The students were so engaged! It was wonderful to see their eyes light up when they saw the results.",
      sentiment: 'positive',
      tags: ['science', 'engagement', 'experiment'],
      block: 'Block A',
      grade: '6',
      subject: 'Science',
      status: 'reviewed',
    },
  ];

  // Filter Logic
  const filteredEntries = entries.filter(entry => {
    // Date filter (mock logic)
    if (dateRange === 'today' && entry.date !== 'Jan 18, 2026') return false;
    
    // Subject filter
    if (subject !== 'all' && entry.subject.toLowerCase() !== subject.toLowerCase()) {
      if (subject === 'language' && entry.subject !== 'English' && entry.subject !== 'Hindi') return false;
      if (subject !== 'language') return false;
    }

    // Grade filter
    if (grade !== 'all' && entry.grade !== grade) return false;

    return true;
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setViewMode(newValue === 0 ? 'list' : 'cluster');
  };

  // Inline tag handlers implemented in AI Analysis section to reduce unused vars


  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'success.main';
      case 'negative': return 'error.main';
      default: return 'warning.main';
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">Entries Review</Typography>
            <Typography variant="body2" color="text.secondary">
              Analyze teacher reflections and identify patterns
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
             {/* Filters - Conceptual Placeholder */}
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
                  <MenuItem value="all">All Subjects</MenuItem>
                  <MenuItem value="math">Math</MenuItem>
                  <MenuItem value="science">Science</MenuItem>
                  <MenuItem value="language">Language</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Grade</InputLabel>
                <Select value={grade} label="Grade" onChange={(e) => setGrade(e.target.value)}>
                  <MenuItem value="all">All Grades</MenuItem>
                  <MenuItem value="1">Grade 1</MenuItem>
                  <MenuItem value="2">Grade 2</MenuItem>
                  <MenuItem value="3">Grade 3</MenuItem>
                  <MenuItem value="4">Grade 4</MenuItem>
                  <MenuItem value="5">Grade 5</MenuItem>
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
                          label={entry.sentiment} 
                          size="small" 
                          sx={{ 
                            bgcolor: `${getSentimentColor(entry.sentiment)}20`, 
                            color: getSentimentColor(entry.sentiment),
                            textTransform: 'capitalize'
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
