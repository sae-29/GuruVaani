import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Person, School } from '@mui/icons-material';

interface ProfileSetupScreenProps {
  onComplete?: () => void;
}

const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    district: '',
    subjects: [] as string[],
    grades: [] as string[],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const subjects = [
    'Math',
    'Science',
    'English',
    'Hindi',
    'Social Studies',
    'Arts',
    'Physical Education',
    'Computer Science',
  ];

  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const schools = ['GHS ABC', 'GHS XYZ', 'GHS PQR', 'GHS DEF', 'GHS GHI'];

  const toggleSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const toggleGrade = (grade: string) => {
    setFormData((prev) => ({
      ...prev,
      grades: prev.grades.includes(grade)
        ? prev.grades.filter((g) => g !== grade)
        : [...prev.grades, grade],
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.school) {
      newErrors.school = 'School selection is required';
    }
    if (formData.subjects.length === 0) {
      newErrors.subjects = 'Select at least one subject';
    }
    if (formData.grades.length === 0) {
      newErrors.grades = 'Select at least one grade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = () => {
    if (validateForm()) {
      // Save profile data
      if (onComplete) {
        onComplete();
      }
      navigate('/');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Tell Us About Yourself
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This helps us personalize your experience
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Your Name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          error={!!errors.name}
          helperText={errors.name}
          InputProps={{
            startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />

        <FormControl fullWidth error={!!errors.school}>
          <InputLabel>School/Institution</InputLabel>
          <Select
            value={formData.school}
            onChange={(e) => setFormData((prev) => ({ ...prev, school: e.target.value }))}
            startAdornment={<School sx={{ mr: 1 }} />}
          >
            {schools.map((school) => (
              <MenuItem key={school} value={school}>
                {school}
              </MenuItem>
            ))}
          </Select>
          {errors.school && <FormHelperText>{errors.school}</FormHelperText>}
        </FormControl>

        {formData.school && (
          <TextField
            fullWidth
            label="District"
            value={formData.district || 'Auto-filled from school'}
            disabled
            sx={{ backgroundColor: 'grey.100' }}
          />
        )}

        <Box>
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            Subjects You Teach
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {subjects.map((subject) => (
              <Chip
                key={subject}
                label={subject}
                onClick={() => toggleSubject(subject)}
                color={formData.subjects.includes(subject) ? 'primary' : 'default'}
              />
            ))}
          </Box>
          {errors.subjects && (
            <FormHelperText error sx={{ mt: 1 }}>
              {errors.subjects}
            </FormHelperText>
          )}
        </Box>

        <Box>
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            Grades You Teach
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {grades.map((grade) => (
              <Chip
                key={grade}
                label={`Class ${grade}`}
                onClick={() => toggleGrade(grade)}
                color={formData.grades.includes(grade) ? 'primary' : 'default'}
              />
            ))}
          </Box>
          {errors.grades && (
            <FormHelperText error sx={{ mt: 1 }}>
              {errors.grades}
            </FormHelperText>
          )}
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={handleComplete}
          disabled={!formData.name || !formData.school}
          sx={{
            mt: 2,
            py: 1.5,
            backgroundColor: '#FF7043',
            '&:hover': { backgroundColor: '#FF5722' },
          }}
        >
          Complete Setup
        </Button>
      </Box>
    </Container>
  );
};

export default ProfileSetupScreen;
