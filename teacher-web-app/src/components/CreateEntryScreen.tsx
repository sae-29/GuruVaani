import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  AppBar,
  Toolbar,
  Dialog,
  DialogContent,
  Zoom,
  Container,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  Mic,
  MicOff,
  Send,
  Lightbulb,
  AutoAwesome,
  Celebration,
} from '@mui/icons-material';
import { designTokens } from 'guru-vaani-shared';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const CreateEntryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
    grade: '',
    topic: '',
    mood: '',
    tags: [] as string[],
  });
  const [isRecording, setIsRecording] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const moods = [
    { value: 'HAPPY', label: '😊 Happy', color: '#4CAF50' },
    { value: 'EXCITED', label: '🤩 Excited', color: '#FFD700' },
    { value: 'NEUTRAL', label: '😐 Neutral', color: '#757575' },
    { value: 'FRUSTRATED', label: '😤 Frustrated', color: '#E53935' },
    { value: 'CONFUSED', label: '😕 Confused', color: '#FF9800' },
  ];

  const subjects = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Art', 'Physical Education'];
  const grades = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];

  const handleContentChange = async (content: string) => {
    setFormData(prev => ({ ...prev, content }));

    // Auto-save/Analyze debounce
    if (content.length > 50) {
      const timer = setTimeout(async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE}/entries/analyze`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify({
              content,
              subject: formData.subject,
              grade: formData.grade
            }),
          });
          const result = await response.json();
          if (result.success) {
            setAiSuggestions(result.data.suggestions);
          }
        } catch (error) {
          console.error('AI Analysis failed', error);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would integrate with speech-to-text
    if (!isRecording) {
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          content: prev.content + ' [Voice recording would be transcribed here...]'
        }));
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      alert('Please fill in title and content');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Call backend API to save reflection
      const response = await fetch(`${API_BASE}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          subject: formData.subject,
          grade: formData.grade,
          topic: formData.topic,
          tags: formData.tags,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Show success message
        setShowSuccess(true);

        // Navigate after showing success
        setTimeout(() => {
          navigate('/entries');
        }, 2500);
      } else {
        throw new Error(result.error || 'Failed to save reflection');
      }
    } catch (error) {
      console.error('Error submitting reflection:', error);
      alert('Failed to save reflection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (showSuccess) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', mt: 8 }}>
        <Box sx={{
          display: 'inline-flex',
          p: 3,
          bgcolor: 'success.light',
          borderRadius: '50%',
          mb: 3,
          animation: 'bounce 1s ease-in-out'
        }}>
          <Celebration sx={{ fontSize: 64, color: 'success.main' }} />
        </Box>
        <Typography variant="h2" fontWeight="800" gutterBottom>
          Story Saved! ✨
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
          Thank you for sharing your journey. Your reflection helps us support you better.
        </Typography>
        <Card sx={{ bgcolor: 'success.light', border: 'none', borderRadius: '16px' }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'success.dark', mb: 1 }}>
              🌱 Educator Growth Detected
            </Typography>
            <Typography variant="body2" sx={{ color: 'success.dark', fontWeight: 600 }}>
              Your focus on visual aids today is a great step. Check the Learning section for more tips!
            </Typography>
          </CardContent>
        </Card>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/')}
          sx={{ mt: 4, py: 2, borderRadius: '12px', fontWeight: 800 }}
        >
          Back Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#FAFAFA' }}>
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
          <IconButton
            edge="start"
            onClick={() => navigate('/')}
            sx={{ mr: 1 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
            Share your story
          </Typography>
          <Box sx={{ position: 'relative' }}>
            {isRecording && (
              <Box sx={{
                position: 'absolute',
                top: -4,
                left: -4,
                right: -4,
                bottom: -4,
                bgcolor: 'primary.light',
                borderRadius: '50%',
                animation: 'pulse 1.5s infinite',
                zIndex: 0
              }} />
            )}
            <IconButton
              onClick={handleVoiceRecording}
              sx={{
                bgcolor: isRecording ? 'primary.main' : 'rgba(0,0,0,0.05)',
                color: isRecording ? 'white' : 'primary.main',
                position: 'relative',
                zIndex: 1,
                '&:hover': { bgcolor: isRecording ? 'primary.dark' : 'rgba(0,0,0,0.1)' }
              }}
            >
              {isRecording ? <Mic /> : <MicOff />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>



      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Section 1: Context Details */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: 'text.secondary', ml: 1 }}>
                REFLECTION TITLE
              </Typography>
              <TextField
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="e.g. My Morning Math Class"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    bgcolor: '#F9FAFB',
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: '1px solid rgba(0,0,0,0.1)' },
                    '&.Mui-focused fieldset': { border: `1px solid ${designTokens.colors.primary.main}` }
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <Select
                  displayEmpty
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  sx={{
                    borderRadius: '16px',
                    bgcolor: '#F9FAFB',
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                  }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography color="text.secondary">Subject</Typography>;
                    }
                    return selected;
                  }}
                >
                  <MenuItem disabled value="">
                    <Typography variant="body2" color="text.secondary">Select Subject</Typography>
                  </MenuItem>
                  {subjects.map(subject => (
                    <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <Select
                  displayEmpty
                  value={formData.grade}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                  sx={{
                    borderRadius: '16px',
                    bgcolor: '#F9FAFB',
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                  }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography color="text.secondary">Class</Typography>;
                    }
                    return selected;
                  }}
                >
                  <MenuItem disabled value="">
                    <Typography variant="body2" color="text.secondary">Select Grade</Typography>
                  </MenuItem>
                  {grades.map(grade => (
                    <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* Section 2: Mood Data */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: 'text.secondary', ml: 1 }}>
              HOW WAS THE EXPERIENCE?
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, '::-webkit-scrollbar': { display: 'none' } }}>
              {moods.map(mood => (
                <Box
                  key={mood.value}
                  onClick={() => setFormData(prev => ({ ...prev, mood: mood.value }))}
                  sx={{
                    flexShrink: 0,
                    p: 2,
                    minWidth: 90,
                    bgcolor: formData.mood === mood.value ? `${mood.color}15` : '#F9FAFB',
                    borderRadius: '20px',
                    border: '2px solid',
                    borderColor: formData.mood === mood.value ? mood.color : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' }
                  }}
                >
                  <Typography variant="h3" sx={{ mb: 1, fontSize: '2rem' }}>{mood.label.split(' ')[0]}</Typography>
                  <Typography variant="caption" sx={{
                    fontWeight: 700,
                    display: 'block',
                    color: formData.mood === mood.value ? mood.color : 'text.secondary'
                  }}>
                    {mood.label.split(' ')[1]}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Section 3: Story Input */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: 'text.secondary', ml: 1 }}>
              TELL YOUR STORY
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              value={formData.content}
              onChange={(e) => handleContentChange(e.target.value)}
              required
              placeholder="Start typing your reflection here..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  bgcolor: '#F9FAFB',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: '1px solid rgba(0,0,0,0.1)' },
                  '&.Mui-focused fieldset': { border: `1px solid ${designTokens.colors.primary.main}` },
                  padding: 2,
                  fontSize: '1.05rem',
                  lineHeight: 1.6
                }
              }}
            />
          </Paper>

          {/* AI Suggestions Section (Warmer) */}
          {aiSuggestions.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 800, color: 'secondary.main', textTransform: 'uppercase', ml: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesome fontSize="small" /> AI Support Suggestions
              </Typography>
              {aiSuggestions.map((suggestion, index) => (
                <Card key={index} elevation={0} sx={{ mb: 1.5, borderRadius: '16px', bgcolor: 'secondary.light', border: 'none' }}>
                  <CardContent sx={{ p: '16px !important', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Lightbulb sx={{ color: 'secondary.main', mt: 0.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.dark', lineHeight: 1.4 }}>
                      {suggestion}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Tags */}
          <Card sx={{ mb: 2, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {formData.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    color="primary"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['visual-aids', 'group-work', 'struggling-students', 'engagement', 'assessment'].map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    variant="outlined"
                    onClick={() => addTag(tag)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disableElevation
            disabled={loading || !formData.title || !formData.content}
            startIcon={loading ? undefined : <Send />}
            sx={{
              py: 2.5,
              borderRadius: '24px',
              fontSize: '1.2rem',
              fontWeight: 800,
              textTransform: 'none',
              boxShadow: '0 12px 24px rgba(255, 112, 67, 0.25)',
              mb: 6,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            {loading ? 'Thinking & Saving...' : 'Post Reflection'}
          </Button>
        </Box>
      </Container>

      {/* Success Dialog */}
      <Dialog
        open={showSuccess}
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: '32px',
            p: 3,
            textAlign: 'center',
            minWidth: '300px'
          }
        }}
      >
        <DialogContent>
          <Box sx={{ mb: 3, position: 'relative', display: 'inline-flex' }}>
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                bgcolor: 'success.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite'
              }}
            >
              <Celebration sx={{ fontSize: 60, color: 'success.main' }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 900, color: designTokens.colors.primary.main }}>
            Post Success!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Your story has been shared. Coaches and Admins can now see your insights!
          </Typography>
        </DialogContent>
      </Dialog>
    </Box >
  );
};

export default CreateEntryScreen;