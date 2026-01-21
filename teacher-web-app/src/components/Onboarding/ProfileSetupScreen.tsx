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
import { Person, School, LocalLibrary, Star } from '@mui/icons-material';

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
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box sx={{
          display: 'inline-flex',
          p: 2,
          bgcolor: 'secondary.light',
          borderRadius: '24px',
          mb: 2,
          color: 'secondary.main',
          transform: 'rotate(5deg)'
        }}>
          <Person sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h2" fontWeight="800" sx={{ mb: 1 }}>
          {formData.name ? `Namaste, ${formData.name.split(' ')[0]}!` : "Welcome, Teacher!"}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          Help us tailor Guru Vaani to your unique classroom.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Your Name"
          placeholder="e.g. Smt. Lakshmi"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
          InputProps={{
            startAdornment: <Person sx={{ mr: 1, color: 'primary.main' }} />,
          }}
        />

        <FormControl fullWidth error={!!errors.school}>
          <InputLabel>Your School</InputLabel>
          <Select
            value={formData.school}
            onChange={(e) => setFormData((prev) => ({ ...prev, school: e.target.value }))}
            sx={{ borderRadius: '16px' }}
            startAdornment={<School sx={{ mr: 1, color: 'primary.main' }} />}
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
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: '12px', border: '1px dashed', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              District
            </Typography>
            <Typography variant="body2" fontWeight="700">
              {formData.district || 'Mandya District'}
            </Typography>
          </Box>
        )}

        <Box>
          <Typography variant="subtitle1" fontWeight="800" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalLibrary fontSize="small" color="primary" /> Subjects You Teach
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
            {subjects.map((subject) => {
              const selected = formData.subjects.includes(subject);
              return (
                <Chip
                  key={subject}
                  label={subject}
                  onClick={() => toggleSubject(subject)}
                  sx={{
                    borderRadius: '10px',
                    fontWeight: 600,
                    px: 1,
                    py: 2.5,
                    bgcolor: selected ? 'primary.main' : 'white',
                    color: selected ? 'white' : 'text.primary',
                    border: '1px solid',
                    borderColor: selected ? 'primary.main' : 'rgba(0,0,0,0.1)',
                    '&:hover': {
                      bgcolor: selected ? 'primary.dark' : 'rgba(0,0,0,0.05)'
                    }
                  }}
                />
              );
            })}
          </Box>
          {errors.subjects && (
            <FormHelperText error sx={{ mt: 1, fontWeight: 600 }}>
              {errors.subjects}
            </FormHelperText>
          )}
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight="800" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Star fontSize="small" color="primary" /> Grades You Teach
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
            {grades.map((grade) => {
              const selected = formData.grades.includes(grade);
              return (
                <Chip
                  key={grade}
                  label={`Class ${grade}`}
                  onClick={() => toggleGrade(grade)}
                  variant={selected ? "filled" : "outlined"}
                  sx={{
                    borderRadius: '10px',
                    fontWeight: 600,
                    borderColor: 'divider',
                    color: selected ? 'white' : 'text.secondary',
                    bgcolor: selected ? 'secondary.main' : 'transparent',
                    '&:hover': {
                      bgcolor: selected ? 'secondary.dark' : 'rgba(0,0,0,0.05)'
                    }
                  }}
                />
              );
            })}
          </Box>
          {errors.grades && (
            <FormHelperText error sx={{ mt: 1, fontWeight: 600 }}>
              {errors.grades}
            </FormHelperText>
          )}
        </Box>

        <Button
          variant="contained"
          size="large"
          disableElevation
          onClick={handleComplete}
          disabled={!formData.name || !formData.school}
          sx={{
            mt: 4,
            py: 2,
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '1.1rem',
            textTransform: 'none',
            boxShadow: '0 8px 24px rgba(255, 112, 67, 0.2)'
          }}
        >
          Finish & Enter Dashboard 🏠
        </Button>
      </Box>
    </Container>
  );
};

export default ProfileSetupScreen;
