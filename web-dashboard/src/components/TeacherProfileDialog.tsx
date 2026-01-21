import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Grid,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemText,
    Chip,
    CircularProgress,
    Paper,
    LinearProgress,
} from '@mui/material';
import {
    Event,
    School as SchoolIcon,
    AssignmentInd,
    TrendingUp,
    EmojiEvents,
    Psychology,
} from '@mui/icons-material';
import api from '../services/api';
import { format } from 'date-fns';

interface TeacherProfileDialogProps {
    id: string | null;
    open: boolean;
    onClose: () => void;
}

const TeacherProfileDialog: React.FC<TeacherProfileDialogProps> = ({ id, open, onClose }) => {
    const [teacher, setTeacher] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && id) {
            fetchTeacherDetails();
        } else {
            setTeacher(null);
        }
    }, [open, id]);

    const fetchTeacherDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/users/${id}`);
            if (response.data.success) {
                setTeacher(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching teacher details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 10 }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography color="text.secondary">Loading teacher profile...</Typography>
                </Box>
            ) : teacher ? (
                <>
                    <DialogTitle sx={{ p: 0 }}>
                        <Box sx={{
                            p: 3,
                            display: 'flex',
                            alignItems: 'center',
                            background: 'linear-gradient(135deg, #FF7043 0%, #FFAB91 100%)',
                            color: 'white'
                        }}>
                            <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'rgba(255,255,255,0.2)', fontSize: '2rem', border: '3px solid white' }}>
                                {teacher.firstName[0]}{teacher.lastName[0]}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight="bold">
                                    {teacher.firstName} {teacher.lastName}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {teacher.email} • {teacher.id.substring(0, 8)}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Chip
                                        label={teacher.role}
                                        size="small"
                                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold', mr: 1 }}
                                    />
                                    <Chip
                                        label={teacher.status}
                                        size="small"
                                        sx={{
                                            bgcolor: teacher.status === 'ACTIVE' ? 'rgba(76, 175, 80, 0.4)' : 'rgba(244, 67, 54, 0.4)',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3, mt: 2 }}>
                        <Grid container spacing={3}>
                            {/* Bio & School Info */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <SchoolIcon sx={{ fontSize: 18, mr: 1 }} /> School Details
                                </Typography>
                                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                                    <Typography variant="body1" fontWeight="bold">
                                        {teacher.school?.name || 'No school assigned'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {teacher.school?.district}, {teacher.school?.block}
                                    </Typography>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Subjects</Typography>
                                        <Typography variant="body2" fontWeight="medium">{teacher.subjects || 'N/A'}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Grades</Typography>
                                        <Typography variant="body2" fontWeight="medium">{teacher.grades || 'N/A'}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Engagement Metrics */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TrendingUp sx={{ fontSize: 18, mr: 1 }} /> Engagement Profile
                                </Typography>
                                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary">Total Reflections</Typography>
                                            <Typography variant="body2" fontWeight="bold">{teacher.totalReflections}</Typography>
                                        </Box>
                                        <LinearProgress variant="determinate" value={Math.min((teacher.totalReflections / 50) * 100, 100)} color="primary" sx={{ height: 6, borderRadius: 3 }} />
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography variant="body2" color="text.secondary">Current Streak</Typography>
                                        <Typography variant="body2" fontWeight="bold" color="error.main">{teacher.streakDays} Days 🔥</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">NEP Training Hours</Typography>
                                        <Typography variant="body2" fontWeight="bold" color="secondary.main">{teacher.nepHours} Hrs</Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Recent Reflections */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Event sx={{ fontSize: 18, mr: 1 }} /> Recent Reflections
                                </Typography>
                                <List sx={{ p: 0 }}>
                                    {teacher.reflections && teacher.reflections.length > 0 ? (
                                        teacher.reflections.map((ref: any, index: number) => (
                                            <ListItem
                                                key={ref.id}
                                                sx={{
                                                    px: 2,
                                                    mb: 1,
                                                    borderRadius: 2,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    '&:last-child': { mb: 0 }
                                                }}
                                            >
                                                <ListItemText
                                                    primary={ref.title || 'Untitled Reflection'}
                                                    secondary={format(new Date(ref.createdAt), 'MMM dd, yyyy • HH:mm')}
                                                    primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold' }}
                                                />
                                                <Chip
                                                    label={ref.sentiment > 0.5 ? 'Positive' : ref.sentiment < -0.5 ? 'Negative' : 'Neutral'}
                                                    size="small"
                                                    color={ref.sentiment > 0.5 ? 'success' : ref.sentiment < -0.5 ? 'error' : 'default'}
                                                    variant="outlined"
                                                />
                                            </ListItem>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
                                            No reflections recorded yet.
                                        </Typography>
                                    )}
                                </List>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, px: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>Close</Button>
                        <Button variant="contained" color="secondary" sx={{ borderRadius: 2 }} startIcon={<Psychology />}>
                            AI Deep Insights
                        </Button>
                    </DialogActions>
                </>
            ) : null}
        </Dialog>
    );
};

export default TeacherProfileDialog;
