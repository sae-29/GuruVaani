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
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  ArrowBack,
  Mic,
  MicOff,
  Psychology,
  Send,
  Lightbulb,
} from '@mui/icons-material';

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

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    
    // Simulate AI analysis as user types
    if (content.length > 50) {
      const suggestions = [
        'Try using visual aids like blocks or drawings to explain concepts',
        'Consider peer tutoring - pair struggling students with those who understand',
        'Break down complex problems into smaller, manageable steps',
      ];
      setAiSuggestions(suggestions);
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
      // Call backend API to save reflection
      const response = await fetch('http://localhost:3001/api/reflections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          subject: formData.subject,
          grade: formData.grade,
          topic: formData.topic,
          mood: formData.mood,
          tags: formData.tags,
          isPrivate: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save reflection');
      }

      const result = await response.json();
      
      // Show success message
      setShowSuccess(true);
      
      // Save to localStorage for offline access
      const savedEntries = JSON.parse(localStorage.getItem('savedReflections') || '[]');
      savedEntries.push(result.data);
      localStorage.setItem('savedReflections', JSON.stringify(savedEntries));
      
      setTimeout(() => {
        navigate('/entries');
      }, 2000);
    } catch (error) {
      console.error('Error submitting reflection:', error);
      // Fallback: Save locally if API fails
      const localEntry = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'DRAFT',
      };
      const savedEntries = JSON.parse(localStorage.getItem('savedReflections') || '[]');
      savedEntries.push(localEntry);
      localStorage.setItem('savedReflections', JSON.stringify(savedEntries));
      
      alert('Saved locally. Will sync when online.');
      setTimeout(() => {
        navigate('/entries');
      }, 1500);
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
      <Box sx={{ p: 3, textAlign: 'center', mt: 10 }}>
        <Psychology sx={{ fontSize: 64, color: '#4CAF50', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Reflection Submitted!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your reflection has been analyzed by AI and saved successfully.
        </Typography>
        <Alert severity="success">
          AI Analysis Complete: Positive sentiment detected with suggestions for visual learning aids.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '390px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#FF7043', maxWidth: '390px', margin: '0 auto' }}>
        <Toolbar sx={{ minHeight: 56, px: 1.5 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 1 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '18px' }}>
            New Reflection
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleVoiceRecording}
            sx={{ color: isRecording ? '#FFD700' : 'white' }}
            size="small"
          >
            {isRecording ? <Mic /> : <MicOff />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        {/* Basic Info */}
        <Card sx={{ mb: 2, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            
            <TextField
              fullWidth
              label="Reflection Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              placeholder="e.g., Math Division - Class 4"
            />

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  label="Subject"
                >
                  {subjects.map(subject => (
                    <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Grade</InputLabel>
                <Select
                  value={formData.grade}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                  label="Grade"
                >
                  {grades.map(grade => (
                    <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Topic (Optional)"
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              placeholder="e.g., Division with Remainders"
            />
          </CardContent>
        </Card>

        {/* Mood Selection */}
        <Card sx={{ mb: 2, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              How are you feeling about this lesson?
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {moods.map(mood => (
                <Chip
                  key={mood.value}
                  label={mood.label}
                  onClick={() => setFormData(prev => ({ ...prev, mood: mood.value }))}
                  variant={formData.mood === mood.value ? 'filled' : 'outlined'}
                  sx={{
                    backgroundColor: formData.mood === mood.value ? mood.color : 'transparent',
                    color: formData.mood === mood.value ? 'white' : mood.color,
                    borderColor: mood.color,
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Content */}
        <Card sx={{ mb: 2, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Reflection
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Describe your teaching experience..."
              value={formData.content}
              onChange={(e) => handleContentChange(e.target.value)}
              required
              placeholder="What happened in class today? What worked well? What challenges did you face? How did students respond?"
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            {isRecording && (
              <Alert severity="info" sx={{ mb: 2 }}>
                🎤 Recording... Speak clearly about your teaching experience.
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <Card sx={{ mb: 2, borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Lightbulb sx={{ color: '#FFD700', mr: 1 }} />
                <Typography variant="h6">
                  AI Suggestions
                </Typography>
              </Box>
              {aiSuggestions.map((suggestion, index) => (
                <Alert key={index} severity="info" sx={{ mb: 1 }}>
                  {suggestion}
                </Alert>
              ))}
            </CardContent>
          </Card>
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

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading || !formData.title || !formData.content}
          startIcon={loading ? undefined : <Send />}
          sx={{
            py: 1.5,
            borderRadius: 3,
            backgroundColor: '#FF7043',
            '&:hover': { backgroundColor: '#E64A19' },
            fontSize: '1.1rem',
            fontWeight: 600,
          }}
        >
          {loading ? 'Analyzing & Saving...' : 'Post Reflection'}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateEntryScreen;