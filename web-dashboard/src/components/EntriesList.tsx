import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import ViewIcon from '@mui/icons-material/Visibility';
import { DiaryEntry } from '@/types/admin';

interface EntriesListProps {
  entries?: DiaryEntry[];
}

export const EntriesList: React.FC<EntriesListProps> = ({ entries = [] }) => {
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [filterSubject, setFilterSubject] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewEntry = (entry: DiaryEntry) => {
    setSelectedEntry(entry);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedEntry(null);
  };

  const mockEntries: DiaryEntry[] = [
    {
      id: '1',
      authorId: 'T-2847',
      content: 'Students struggling with division of fractions...',
      entryMode: 'TEXT',
      type: 'DAILY',
      status: 'AI_ANALYZED',
      grade: '5',
      subject: 'Math',
      sentiment: -0.6,
      keywords: ['fractions', 'division', 'conceptual'],
      priority: 'HIGH',
      isPrivate: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      authorId: 'T-5432',
      content: 'Classroom management techniques needed for noisy students...',
      entryMode: 'VOICE',
      type: 'DAILY',
      status: 'AI_ANALYZED',
      grade: '4',
      subject: 'Math',
      sentiment: -0.4,
      keywords: ['classroom', 'noise', 'management'],
      priority: 'MEDIUM',
      isPrivate: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const displayEntries = entries.length > 0 ? entries : mockEntries;

  const getSentimentEmoji = (sentiment?: number) => {
    if (!sentiment) return '😐';
    if (sentiment < -0.3) return '😟';
    if (sentiment < 0.3) return '😐';
    return '😊';
  };

  return (
    <Box>
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search entries..."
              placeholder="Search keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Subject</InputLabel>
              <Select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                label="Subject"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="math">Math</MenuItem>
                <MenuItem value="science">Science</MenuItem>
                <MenuItem value="language">Language</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Grade</InputLabel>
              <Select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                label="Grade"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="4">Grade 4</MenuItem>
                <MenuItem value="5">Grade 5</MenuItem>
                <MenuItem value="6">Grade 6</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" fullWidth>
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Entries Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#FAFAFA' }}>
              <TableCell>Date/Time</TableCell>
              <TableCell>Teacher ID</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Entry Preview</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Sentiment</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayEntries.map((entry) => (
              <TableRow key={entry.id} hover>
                <TableCell variant="head" sx={{ fontSize: 12 }}>
                  {entry.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell>{entry.authorId}</TableCell>
                <TableCell>{entry.grade}</TableCell>
                <TableCell>{entry.subject}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {entry.content.substring(0, 50)}...
                </TableCell>
                <TableCell>{entry.entryMode === 'TEXT' ? '📝' : '🎤'}</TableCell>
                <TableCell>{getSentimentEmoji(entry.sentiment)}</TableCell>
                <TableCell>
                  <Chip
                    label={entry.priority}
                    size="small"
                    color={
                      entry.priority === 'HIGH' || entry.priority === 'CRITICAL'
                        ? 'error'
                        : 'default'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewEntry(entry)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Entry Detail Modal */}
      <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h3">Entry Details</Typography>
          {selectedEntry && (
            <Typography variant="caption" color="text.secondary">
              Teacher: {selectedEntry.authorId} | Grade {selectedEntry.grade} | {selectedEntry.subject}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedEntry && (
            <Box>
              <Typography variant="h4" sx={{ mb: 2 }}>
                {selectedEntry.subject} - Grade {selectedEntry.grade}
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="body2">{selectedEntry.content}</Typography>
              </Paper>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  AI Analysis
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedEntry.keywords?.map((keyword, idx) => (
                    <Chip key={idx} label={keyword} size="small" />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Assign to Cluster</InputLabel>
                  <Select label="Assign to Cluster" defaultValue="">
                    <MenuItem value="">Create new cluster</MenuItem>
                    <MenuItem value="fractions">Fraction Division Concepts</MenuItem>
                    <MenuItem value="classroom">Classroom Management</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Button variant="contained" fullWidth sx={{ mb: 1 }}>
                  Send Training Module
                </Button>
                <Button variant="outlined" fullWidth>
                  Send Personal Note
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
