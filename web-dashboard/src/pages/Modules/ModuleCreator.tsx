import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  Radio,
  RadioGroup,
  FormLabel,
  Slider,
} from '@mui/material';
import { ArrowBack, ArrowForward, Save, Publish, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const steps = ['Basic Information', 'Add Content', 'Interactive Elements', 'Preview & Publish'];

interface QuizQuestion {
  question: string;
  options: string[];
  correctOption: number;
}

const ModuleCreator: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1
    title: '',
    shortDescription: '',
    fullDescription: '',
    duration: 10,
    subject: '',
    grades: [] as string[],
    topics: [] as string[],
    language: 'hi',
    additionalLanguages: [] as string[],
    // Step 2
    format: 'video',
    videoFile: null as File | null,
    videoLink: '',
    audioFile: null as File | null,
    transcript: '',
    textContent: '',
    // Step 3
    includeQuiz: false,
    quizQuestions: [] as QuizQuestion[],
    includeReflection: false,
    reflectionPrompt: '',
    includeActivity: false,
    activityDescription: '',
    // Step 4
    status: 'draft',
    featured: false,
    prerequisites: [] as string[],
    difficulty: 'beginner',
    nepTags: [] as string[],
    copyright: '',
  });

  const subjects = ['Math', 'Science', 'English', 'Hindi', 'Social Studies', 'Arts', 'PE'];
  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const nepTags = [
    'Foundational Literacy',
    'Competency-Based',
    '21st Century Skills',
    'Holistic Development',
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleGradeToggle = (grade: string) => {
    setFormData((prev) => ({
      ...prev,
      grades: prev.grades.includes(grade)
        ? prev.grades.filter((g) => g !== grade)
        : [...prev.grades, grade],
    }));
  };

  const handleTopicAdd = (topic: string) => {
    if (topic && !formData.topics.includes(topic)) {
      setFormData((prev) => ({
        ...prev,
        topics: [...prev.topics, topic],
      }));
    }
  };

  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      quizQuestions: [
        ...prev.quizQuestions,
        { question: '', options: ['', '', '', ''], correctOption: 0 },
      ],
    }));
  };

  const handleQuizChange = (index: number, field: string, value: unknown) => {
    const updatedQuestions = [...formData.quizQuestions];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updatedQuestions[index] as any)[field] = value;
    setFormData((prev) => ({ ...prev, quizQuestions: updatedQuestions }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Module Title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              helperText="Keep it clear and descriptive (max 100 chars)"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Short Description"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))
              }
              multiline
              rows={3}
              helperText="One-line summary for teacher dashboard (max 200 chars)"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Full Description"
              value={formData.fullDescription}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullDescription: e.target.value }))
              }
              multiline
              rows={5}
              helperText="Learning objectives, what teachers will gain..."
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography>Duration Estimate: {formData.duration} minutes</Typography>
              <Slider
                value={formData.duration}
                onChange={(_, value) =>
                  setFormData((prev) => ({ ...prev, duration: value as number }))
                }
                min={3}
                max={30}
                marks
                step={1}
              />
            </Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Subject</InputLabel>
              <Select
                value={formData.subject}
                onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Grade Levels
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {grades.map((grade) => (
                  <Chip
                    key={grade}
                    label={`Class ${grade}`}
                    onClick={() => handleGradeToggle(grade)}
                    color={formData.grades.includes(grade) ? 'primary' : 'default'}
                  />
                ))}
              </Box>
            </Box>
            <TextField
              fullWidth
              label="Topic Tags"
              placeholder="Add topics (e.g., Place Value, Number Sense)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleTopicAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.topics.map((topic) => (
                <Chip
                  key={topic}
                  label={topic}
                  onDelete={() =>
                    setFormData((prev) => ({
                      ...prev,
                      topics: prev.topics.filter((t) => t !== topic),
                    }))
                  }
                />
              ))}
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Content Format</FormLabel>
              <RadioGroup
                value={formData.format}
                onChange={(e) => setFormData((prev) => ({ ...prev, format: e.target.value }))}
              >
                <FormControlLabel value="video" control={<Radio />} label="📹 Video Module" />
                <FormControlLabel value="audio" control={<Radio />} label="🎧 Audio Module" />
                <FormControlLabel value="text" control={<Radio />} label="📄 Text/Slides" />
                <FormControlLabel
                  value="external"
                  control={<Radio />}
                  label="🔗 External Link"
                />
              </RadioGroup>
            </FormControl>

            {formData.format === 'video' && (
              <>
                <Button variant="outlined" component="label" sx={{ mb: 2, mr: 2 }}>
                  Upload Video File
                  <input
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setFormData((prev) => ({ ...prev, videoFile: file }));
                    }}
                  />
                </Button>
                <TextField
                  fullWidth
                  label="Or Paste Video Link (YouTube, DIKSHA)"
                  value={formData.videoLink}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, videoLink: e.target.value }))
                  }
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Auto-compress for low-data networks"
                />
              </>
            )}

            {formData.format === 'audio' && (
              <>
                <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                  Upload Audio File (MP3)
                  <input
                    type="file"
                    hidden
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setFormData((prev) => ({ ...prev, audioFile: file }));
                    }}
                  />
                </Button>
                <TextField
                  fullWidth
                  label="Upload Transcript (TXT)"
                  type="file"
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </>
            )}

            {formData.format === 'text' && (
              <TextField
                fullWidth
                label="Text Content"
                value={formData.textContent}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, textContent: e.target.value }))
                }
                multiline
                rows={10}
                sx={{ mb: 2 }}
              />
            )}

            {formData.format === 'external' && (
              <TextField
                fullWidth
                label="External URL (DIKSHA, NCERT, etc.)"
                value={formData.videoLink}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, videoLink: e.target.value }))
                }
                sx={{ mb: 2 }}
              />
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.includeQuiz}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, includeQuiz: e.target.checked }))
                  }
                />
              }
              label="Include Knowledge Check (Quiz)"
              sx={{ mb: 2 }}
            />
            {formData.includeQuiz && (
              <Card sx={{ mb: 2, p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Quiz Questions
                </Typography>
                {formData.quizQuestions.map((q, qIndex) => (
                  <Box key={qIndex} sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                      Question {qIndex + 1}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter question text"
                      value={q.question}
                      onChange={(e) => handleQuizChange(qIndex, 'question', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Grid container spacing={2}>
                      {q.options.map((opt, optIndex) => (
                        <Grid item xs={6} key={optIndex}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder={`Option ${optIndex + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...q.options];
                              newOptions[optIndex] = e.target.value;
                              handleQuizChange(qIndex, 'options', newOptions);
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption">Correct Option (0-3):</Typography>
                      <TextField
                        type="number"
                        size="small"
                        value={q.correctOption}
                        onChange={(e) =>
                          handleQuizChange(qIndex, 'correctOption', parseInt(e.target.value))
                        }
                        sx={{ ml: 1, width: 80 }}
                        inputProps={{ min: 0, max: 3 }}
                      />
                    </Box>
                  </Box>
                ))}
                <Button startIcon={<Add />} onClick={handleAddQuestion} size="small">
                  Add Question
                </Button>
              </Card>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.includeReflection}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, includeReflection: e.target.checked }))
                  }
                />
              }
              label="Add Reflection Activity"
              sx={{ mb: 2 }}
            />
            {formData.includeReflection && (
              <TextField
                fullWidth
                label="Reflection Prompt"
                value={formData.reflectionPrompt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, reflectionPrompt: e.target.value }))
                }
                placeholder="How will you apply this in your next class?"
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.includeActivity}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, includeActivity: e.target.checked }))
                  }
                />
              }
              label="Include 'Try This' Activity"
              sx={{ mb: 2 }}
            />
            {formData.includeActivity && (
              <TextField
                fullWidth
                label="Activity Description"
                value={formData.activityDescription}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, activityDescription: e.target.value }))
                }
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
            )}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ p: 2, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography variant="h6" gutterBottom>
                    Mobile Preview
                  </Typography>
                  
                  {/* Phone Mockup */}
                  <Box sx={{ 
                    width: 320, 
                    height: 640, 
                    bgcolor: 'black', 
                    borderRadius: 4, 
                    p: 1.5,
                    boxShadow: 3,
                    position: 'relative'
                  }}>
                    {/* Screen */}
                    <Box sx={{ 
                      width: '100%', 
                      height: '100%', 
                      bgcolor: 'white', 
                      borderRadius: 3,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      {/* Status Bar Mock */}
                      <Box sx={{ height: 24, bgcolor: '#e0e0e0', display: 'flex', justifyContent: 'flex-end', px: 1, alignItems: 'center' }}>
                         <Box sx={{ width: 16, height: 10, bgcolor: '#9e9e9e', borderRadius: 0.5 }} />
                      </Box>
                      
                      {/* App Header */}
                      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                         <Typography variant="subtitle1" fontWeight="bold">Guru Vaani</Typography>
                      </Box>

                      {/* Content Area */}
                      <Box sx={{ p: 2, overflowY: 'auto', flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {formData.title || 'Module Title'}
                        </Typography>
                        
                        <Chip 
                          label={formData.format.toUpperCase()} 
                          size="small" 
                          color="secondary" 
                          sx={{ mb: 2, fontSize: '0.7rem' }} 
                        />

                        <Box sx={{ 
                          width: '100%', 
                          height: 180, 
                          bgcolor: '#eee', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: 2,
                          mb: 2
                        }}>
                          <Typography variant="caption" color="text.secondary">
                            {formData.format === 'video' ? 'Video Player' : 'Document Preview'}
                          </Typography>
                        </Box>

                        <Typography variant="body2" paragraph>
                          {formData.fullDescription || 'Module description will appear here...'}
                        </Typography>

                        {formData.activityDescription && (
                          <Box sx={{ bgcolor: '#fff3e0', p: 1.5, borderRadius: 1, mb: 2, borderLeft: '4px solid #ff9800' }}>
                            <Typography variant="subtitle2" color="warning.dark">Activity</Typography>
                            <Typography variant="caption" display="block">
                              {formData.activityDescription}
                            </Typography>
                          </Box>
                        )}
                        
                        <Button variant="contained" fullWidth sx={{ borderRadius: 20 }}>
                          Start Module
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Publication Settings
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, status: e.target.value }))
                      }
                    >
                      <MenuItem value="draft">Save as Draft</MenuItem>
                      <MenuItem value="published">Publish to Library</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                        }
                      />
                    }
                    label="Feature on teacher homepage"
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Difficulty Level</InputLabel>
                    <Select
                      value={formData.difficulty}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, difficulty: e.target.value }))
                      }
                    >
                      <MenuItem value="beginner">Beginner</MenuItem>
                      <MenuItem value="intermediate">Intermediate</MenuItem>
                      <MenuItem value="advanced">Advanced</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      NEP 2020 Alignment Tags
                    </Typography>
                    {nepTags.map((tag) => (
                      <FormControlLabel
                        key={tag}
                        control={
                          <Checkbox
                            checked={formData.nepTags.includes(tag)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  nepTags: [...prev.nepTags, tag],
                                }));
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  nepTags: prev.nepTags.filter((t) => t !== tag),
                                }));
                              }
                            }}
                          />
                        }
                        label={tag}
                      />
                    ))}
                  </Box>
                  <TextField
                    fullWidth
                    label="Copyright/Attribution"
                    value={formData.copyright}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, copyright: e.target.value }))
                    }
                    placeholder="Source/Creator acknowledgment"
                    sx={{ mb: 2 }}
                  />
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/modules')} sx={{ mr: 2 }}>
          Back to Library
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Create New Module
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent()}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <>
              <Button
                variant="outlined"
                startIcon={<Save />}
                onClick={() => navigate('/modules')}
                sx={{ mr: 2 }}
              >
                Save as Draft
              </Button>
              <Button
                variant="contained"
                startIcon={<Publish />}
                onClick={() => {
                  // Handle publish
                  navigate('/modules');
                }}
                sx={{ bgcolor: '#FF7043', '&:hover': { bgcolor: '#FF5722' } }}
              >
                Publish Module
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForward />}
              sx={{ bgcolor: '#FF7043', '&:hover': { bgcolor: '#FF5722' } }}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ModuleCreator;
