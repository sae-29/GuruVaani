import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Slider,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Send,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const steps = ['Select Recipients', 'Configure Notification', 'Review & Send'];

interface Teacher {
  id: string;
  name: string;
  school: string;
  block: string;
  grade: string;
  subject: string;
}

const DispatchWizard: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [recipientMethod, setRecipientMethod] = useState<'cluster' | 'filters' | 'individual' | 'broadcast'>('cluster');
  const [selectedCluster, setSelectedCluster] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);
  const [notificationChannels, setNotificationChannels] = useState({
    push: true,
    sms: true,
    ussd: false,
    inApp: true,
  });
  const [smsMessage, setSmsMessage] = useState(
    "Guru Vaani: New training 'Visualizing Fractions' ready for you! Open app or visit [short-link]. -DIET XYZ"
  );
  const [pushTitle, setPushTitle] = useState('New training matches your challenge');
  const [pushBody, setPushBody] = useState('Learn techniques for teaching fraction division');
  const [sendTime, setSendTime] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [reminderDays, setReminderDays] = useState(3);
  const [completionDeadline, setCompletionDeadline] = useState('');
  const [awardCertificate, setAwardCertificate] = useState(true);

  const clusters = [
    { id: '1', name: 'Fraction Division Concepts', teacherCount: 24 },
    { id: '2', name: 'Classroom Management', teacherCount: 18 },
    { id: '3', name: 'Student Engagement', teacherCount: 15 },
  ];

  const mockTeachers: Teacher[] = [
    { id: 'T-1', name: 'Teacher 1', school: 'GHS ABC', block: 'Block A', grade: '5', subject: 'Math' },
    { id: 'T-2', name: 'Teacher 2', school: 'GHS XYZ', block: 'Block B', grade: '4', subject: 'Math' },
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleRecipientMethodChange = (method: typeof recipientMethod) => {
    setRecipientMethod(method);
    if (method === 'cluster' && selectedCluster) {
      const cluster = clusters.find((c) => c.id === selectedCluster);
      if (cluster) {
        // Mock: Load teachers from cluster
        setSelectedTeachers(mockTeachers.slice(0, cluster.teacherCount));
      }
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Recipient Selection Method</FormLabel>
              <RadioGroup
                value={recipientMethod}
                onChange={(e) =>
                  handleRecipientMethodChange(e.target.value as typeof recipientMethod)
                }
              >
                <FormControlLabel value="cluster" control={<Radio />} label="From Cluster" />
                <FormControlLabel value="filters" control={<Radio />} label="By Filters" />
                <FormControlLabel value="individual" control={<Radio />} label="Individual Selection" />
                <FormControlLabel value="broadcast" control={<Radio />} label="Broadcast to All" />
              </RadioGroup>
            </FormControl>

            {recipientMethod === 'cluster' && (
              <Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select Cluster</InputLabel>
                  <Select
                    value={selectedCluster}
                    onChange={(e) => {
                      setSelectedCluster(e.target.value);
                      const cluster = clusters.find((c) => c.id === e.target.value);
                      if (cluster) {
                        setSelectedTeachers(mockTeachers.slice(0, cluster.teacherCount));
                      }
                    }}
                  >
                    {clusters.map((cluster) => (
                      <MenuItem key={cluster.id} value={cluster.id}>
                        {cluster.name} ({cluster.teacherCount} teachers)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {recipientMethod === 'filters' && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Subject</InputLabel>
                      <Select value="math">
                        <MenuItem value="math">Math</MenuItem>
                        <MenuItem value="science">Science</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Grade</InputLabel>
                      <Select value="4,5" multiple>
                        <MenuItem value="4">Class 4</MenuItem>
                        <MenuItem value="5">Class 5</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Button variant="outlined" onClick={() => setSelectedTeachers(mockTeachers)}>
                  Apply Filters
                </Button>
              </Box>
            )}

            {recipientMethod === 'broadcast' && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                This will send to ALL active teachers in your district (247 teachers). Use sparingly
                for critical announcements.
              </Alert>
            )}

            {selectedTeachers.length > 0 && (
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Selected Recipients: {selectedTeachers.length} teachers
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Teacher ID</TableCell>
                          <TableCell>School</TableCell>
                          <TableCell>Block</TableCell>
                          <TableCell>Grade</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedTeachers.slice(0, 5).map((teacher) => (
                          <TableRow key={teacher.id}>
                            <TableCell>{teacher.id}</TableCell>
                            <TableCell>{teacher.school}</TableCell>
                            <TableCell>{teacher.block}</TableCell>
                            <TableCell>{teacher.grade}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {selectedTeachers.length > 5 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      ...and {selectedTeachers.length - 5} more
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Channels
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notificationChannels.push}
                    onChange={(e) =>
                      setNotificationChannels((prev) => ({ ...prev, push: e.target.checked }))
                    }
                  />
                }
                label="App Push Notification (for smartphone users)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notificationChannels.sms}
                    onChange={(e) =>
                      setNotificationChannels((prev) => ({ ...prev, sms: e.target.checked }))
                    }
                  />
                }
                label="SMS (recommended for broad reach)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notificationChannels.ussd}
                    onChange={(e) =>
                      setNotificationChannels((prev) => ({ ...prev, ussd: e.target.checked }))
                    }
                  />
                }
                label="USSD Code (experimental, for feature phones)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notificationChannels.inApp}
                    onChange={(e) =>
                      setNotificationChannels((prev) => ({ ...prev, inApp: e.target.checked }))
                    }
                  />
                }
                label="In-App Alert (shows next time teacher opens app)"
              />
            </Box>

            {notificationChannels.sms && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    SMS Message (160 characters max)
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    helperText={`${smsMessage.length}/160 characters`}
                  />
                </CardContent>
              </Card>
            )}

            {notificationChannels.push && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Push Notification
                  </Typography>
                  <TextField
                    fullWidth
                    label="Title"
                    value={pushTitle}
                    onChange={(e) => setPushTitle(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Body"
                    multiline
                    rows={2}
                    value={pushBody}
                    onChange={(e) => setPushBody(e.target.value)}
                  />
                </CardContent>
              </Card>
            )}

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Scheduling
            </Typography>
            <RadioGroup
              value={sendTime}
              onChange={(e) => setSendTime(e.target.value as 'immediate' | 'scheduled')}
            >
              <FormControlLabel value="immediate" control={<Radio />} label="Send Immediately" />
              <FormControlLabel value="scheduled" control={<Radio />} label="Schedule for Later" />
            </RadioGroup>

            {sendTime === 'scheduled' && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" gutterBottom>
                Send reminder if not opened within:
              </Typography>
              <Slider
                value={reminderDays}
                onChange={(_, value) => setReminderDays(value as number)}
                min={1}
                max={7}
                marks
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!completionDeadline}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCompletionDeadline(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                      } else {
                        setCompletionDeadline('');
                      }
                    }}
                  />
                }
                label="Set completion deadline"
              />
              {completionDeadline && (
                <TextField
                  type="date"
                  value={completionDeadline}
                  onChange={(e) => setCompletionDeadline(e.target.value)}
                  sx={{ ml: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={awardCertificate}
                  onChange={(e) => setAwardCertificate(e.target.checked)}
                />
              }
              label="Award certificate upon completion"
              sx={{ mt: 2 }}
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Dispatch Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Module
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      Visualizing Fraction Operations
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Recipients
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedTeachers.length} teachers
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Notification Channels
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {notificationChannels.push && <Chip label="App Push" size="small" />}
                      {notificationChannels.sms && <Chip label="SMS" size="small" />}
                      {notificationChannels.inApp && <Chip label="In-App" size="small" />}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Send Time
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {sendTime === 'immediate' ? 'Immediately' : `${scheduledDate} ${scheduledTime}`}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Alert severity="info" sx={{ mt: 3 }}>
              Estimated cost: {notificationChannels.sms ? `${selectedTeachers.length} SMS × ₹0.20 = ₹${(selectedTeachers.length * 0.2).toFixed(2)}` : 'No SMS cost'}
            </Alert>

            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={<Checkbox required />}
                label="I've reviewed the recipient list"
              />
              <br />
              <FormControlLabel
                control={<Checkbox required />}
                label="Notification messages are appropriate and error-free"
              />
              <br />
              <FormControlLabel
                control={<Checkbox required />}
                label="Content is relevant to selected teachers"
              />
            </Box>
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
          Back to Modules
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Dispatch Training
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
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={() => {
              // Handle dispatch
              alert('Training dispatched successfully!');
              navigate('/modules');
            }}
            sx={{ bgcolor: '#FF7043', '&:hover': { bgcolor: '#FF5722' } }}
          >
            Confirm & Send
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForward />}
            disabled={selectedTeachers.length === 0 && activeStep === 0}
            sx={{ bgcolor: '#FF7043', '&:hover': { bgcolor: '#FF5722' } }}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DispatchWizard;
