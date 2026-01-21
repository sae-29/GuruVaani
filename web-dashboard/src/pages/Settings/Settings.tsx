import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    Grid,
    Switch,
    FormControlLabel,
    TextField,
    MenuItem,
    Button,
    Divider,
    CircularProgress,
    Alert,
    Snackbar,
    Card,
    CardContent,
    Stack,
} from '@mui/material';
import {
    Save,
    Psychology,
    Tune,
    PrivacyTip,
    NotificationsActive,
} from '@mui/icons-material';
import api from '../../services/api';

const Settings: React.FC = () => {
    const [configs, setConfigs] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/settings');
            if (response.data.success) {
                setConfigs(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('Failed to load system settings.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (key: string) => {
        setSaving(true);
        try {
            const response = await api.put(`/api/settings/${key}`, configs[key]);
            if (response.data.success) {
                setSuccess(true);
            }
        } catch (err) {
            console.error(`Error saving settings for ${key}:`, err);
            setError(`Failed to save ${key} settings.`);
        } finally {
            setSaving(false);
        }
    };

    const updateConfig = (group: string, field: string, value: any) => {
        setConfigs((prev: any) => ({
            ...prev,
            [group]: {
                ...prev[group],
                [field]: value
            }
        }));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                    System Configuration
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Fine-tune AI behavior, platform experience, and data privacy policies.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* AI Behavior */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Psychology color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6" fontWeight="bold">AI Behavior</Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />

                            <Stack spacing={3}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Response Tone"
                                    value={configs.ai_behavior?.tone || 'supportive'}
                                    onChange={(e) => updateConfig('ai_behavior', 'tone', e.target.value)}
                                >
                                    <MenuItem value="supportive">Empathetic & Supportive</MenuItem>
                                    <MenuItem value="analytical">Professional & Analytical</MenuItem>
                                    <MenuItem value="concise">Direct & Concise</MenuItem>
                                </TextField>

                                <TextField
                                    select
                                    fullWidth
                                    label="Analysis Depth"
                                    value={configs.ai_behavior?.depth || 'comprehensive'}
                                    onChange={(e) => updateConfig('ai_behavior', 'depth', e.target.value)}
                                >
                                    <MenuItem value="basic">Basic (Summary only)</MenuItem>
                                    <MenuItem value="standard">Standard (Themes & Tips)</MenuItem>
                                    <MenuItem value="comprehensive">Comprehensive (Deep Insights)</MenuItem>
                                </TextField>

                                <TextField
                                    select
                                    fullWidth
                                    label="Feedback Visibility"
                                    value={configs.ai_behavior?.visibility || 'immediate'}
                                    onChange={(e) => updateConfig('ai_behavior', 'visibility', e.target.value)}
                                >
                                    <MenuItem value="immediate">Immediate after submission</MenuItem>
                                    <MenuItem value="delayed">Review required by Mentor</MenuItem>
                                    <MenuItem value="on_request">Only on teacher request</MenuItem>
                                </TextField>

                                <Button
                                    variant="contained"
                                    startIcon={<Save />}
                                    onClick={() => handleSave('ai_behavior')}
                                    disabled={saving}
                                    sx={{ alignSelf: 'flex-end', borderRadius: 2 }}
                                >
                                    Save AI Config
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Platform Experience */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Tune color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6" fontWeight="bold">Platform Experience</Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />

                            <Stack spacing={3}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Reflection Frequency"
                                    value={configs.platform_experience?.reflectionFrequency || 'daily'}
                                    onChange={(e) => updateConfig('platform_experience', 'reflectionFrequency', e.target.value)}
                                >
                                    <MenuItem value="daily">Daily Reflection</MenuItem>
                                    <MenuItem value="alternate">Every Alternate Day</MenuItem>
                                    <MenuItem value="weekly">Weekly Reflection</MenuItem>
                                </TextField>

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={configs.platform_experience?.allowVoiceEntry ?? true}
                                            onChange={(e) => updateConfig('platform_experience', 'allowVoiceEntry', e.target.checked)}
                                        />
                                    }
                                    label="Allow Multilingual Voice Entry"
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={configs.platform_experience?.enableAIInsights ?? true}
                                            onChange={(e) => updateConfig('platform_experience', 'enableAIInsights', e.target.checked)}
                                        />
                                    }
                                    label="Enable Real-time AI Personalized Insights"
                                />

                                <Button
                                    variant="contained"
                                    startIcon={<Save />}
                                    onClick={() => handleSave('platform_experience')}
                                    disabled={saving}
                                    sx={{ alignSelf: 'flex-end', borderRadius: 2 }}
                                >
                                    Save Experience Config
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Privacy & Safety */}
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PrivacyTip color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6" fontWeight="bold">Privacy & Data Safety</Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Data Retention Period (Days)"
                                        value={configs.privacy?.dataRetentionDays || 365}
                                        onChange={(e) => updateConfig('privacy', 'dataRetentionDays', parseInt(e.target.value))}
                                        helperText="Reflections older than this will be auto-archived."
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={configs.privacy?.anonymizeAdminViews ?? true}
                                                onChange={(e) => updateConfig('privacy', 'anonymizeAdminViews', e.target.checked)}
                                            />
                                        }
                                        label="Anonymize Teacher Identities in Aggregate Views"
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<Save />}
                                    onClick={() => handleSave('privacy')}
                                    disabled={saving}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Save Privacy Policies
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Notifications */}
            <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
                <Alert severity="success" variant="filled">Settings saved successfully!</Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
                <Alert severity="error" variant="filled">{error}</Alert>
            </Snackbar>
        </Container>
    );
};

export default Settings;
