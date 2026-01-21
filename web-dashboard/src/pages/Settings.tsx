import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    Tabs,
    Tab,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Slider,
    Button,
    Alert,
    Divider,
    Grid,
    CircularProgress,
    Stack,
    Chip
} from '@mui/material';
import {
    Settings as SettingsIcon,
    Psychology,
    Security,
    Save,
    Tune
} from '@mui/icons-material';
import api from '../services/api';

interface PlatformSettings {
    reflectionFrequency: 'daily' | 'weekly' | 'monthly';
    enablePrompts: boolean;
    enableFeedback: boolean;
    maintenanceMode: boolean;
}

interface AISettings {
    summarizationDepth: 'brief' | 'detailed';
    tone: 'supportive' | 'neutral' | 'reflective';
    visibility: 'admin_only' | 'shared_with_teacher';
    model: string;
}

interface PrivacySettings {
    retentionDays: number;
    analyticsConsent: boolean;
    dataSharingEvents: boolean;
}

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [platform, setPlatform] = useState<PlatformSettings>({
        reflectionFrequency: 'weekly',
        enablePrompts: true,
        enableFeedback: true,
        maintenanceMode: false,
    });

    const [ai, setAI] = useState<AISettings>({
        summarizationDepth: 'detailed',
        tone: 'supportive',
        visibility: 'admin_only',
        model: 'grok-beta',
    });

    const [privacy, setPrivacy] = useState<PrivacySettings>({
        retentionDays: 365,
        analyticsConsent: true,
        dataSharingEvents: false,
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/settings');
            if (response.data.success) {
                const { platform, ai, privacy } = response.data.data;
                if (platform) setPlatform(platform);
                if (ai) setAI(ai);
                if (privacy) setPrivacy(privacy);
            }
        } catch (error) {
            console.error('Failed to load settings', error);
            setMessage({ type: 'error', text: 'Failed to load configuration.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const response = await api.put('/settings', { platform, ai, privacy });
            if (response.data.success) {
                setMessage({ type: 'success', text: 'Settings saved successfully!' });
            }
        } catch (error) {
            console.error('Failed to save settings', error);
            setMessage({ type: 'error', text: 'Failed to save changes.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 3 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Platform Configuration
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage teacher experience, AI behaviors, and data policies.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>

                {message && (
                    <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
                        {message.text}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <Tabs
                                orientation="vertical"
                                value={activeTab}
                                onChange={(_, v) => setActiveTab(v)}
                                sx={{ borderRight: 1, borderColor: 'divider', minHeight: 400 }}
                            >
                                <Tab icon={<Tune />} iconPosition="start" label="Experience" sx={{ alignItems: 'start', minHeight: 64 }} />
                                <Tab icon={<Psychology />} iconPosition="start" label="AI Behavior" sx={{ alignItems: 'start', minHeight: 64 }} />
                                <Tab icon={<Security />} iconPosition="start" label="Privacy & Data" sx={{ alignItems: 'start', minHeight: 64 }} />
                            </Tabs>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={9}>
                        <Paper sx={{ p: 4, borderRadius: 2, minHeight: 400 }}>
                            {/* Tab 0: Platform Experience */}
                            <Box role="tabpanel" hidden={activeTab !== 0}>
                                <Typography variant="h6" gutterBottom color="primary">Platform Experience</Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Stack spacing={4}>
                                    <Box>
                                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">Reflection Cycle</Typography>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Frequency</InputLabel>
                                                    <Select
                                                        value={platform.reflectionFrequency}
                                                        label="Frequency"
                                                        onChange={(e) => setPlatform({ ...platform, reflectionFrequency: e.target.value as any })}
                                                    >
                                                        <MenuItem value="daily">Daily Check-in</MenuItem>
                                                        <MenuItem value="weekly">Weekly Reflection</MenuItem>
                                                        <MenuItem value="monthly">Monthly Review</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Determines how often teachers receive "Time to Reflect" nudges.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">Features</Typography>
                                        <FormControlLabel
                                            control={<Switch checked={platform.enablePrompts} onChange={(e) => setPlatform({ ...platform, enablePrompts: e.target.checked })} />}
                                            label="Enable Guided Prompts"
                                        />
                                        <FormControlLabel
                                            control={<Switch checked={platform.enableFeedback} onChange={(e) => setPlatform({ ...platform, enableFeedback: e.target.checked })} />}
                                            label="Enable Peer Feedback"
                                        />
                                    </Box>

                                    <Box sx={{ bgcolor: 'error.main', color: 'white', p: 2, borderRadius: 1, opacity: 0.9 }}>
                                        <Typography variant="subtitle2" fontWeight="bold">Danger Zone</Typography>
                                        <FormControlLabel
                                            control={<Switch checked={platform.maintenanceMode} onChange={(e) => setPlatform({ ...platform, maintenanceMode: e.target.checked })} color="default" />}
                                            label="Maintenance Mode (Disable Teacher Access)"
                                        />
                                    </Box>
                                </Stack>
                            </Box>

                            {/* Tab 1: AI Behavior */}
                            <Box role="tabpanel" hidden={activeTab !== 1}>
                                <Typography variant="h6" gutterBottom color="primary">AI Persona & Integration</Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Stack spacing={4}>
                                    <Box>
                                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">Response Tone</Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                            {['supportive', 'neutral', 'reflective'].map(tone => (
                                                <Chip
                                                    key={tone}
                                                    label={tone}
                                                    onClick={() => setAI({ ...ai, tone: tone as any })}
                                                    color={ai.tone === tone ? 'primary' : 'default'}
                                                    variant={ai.tone === tone ? 'filled' : 'outlined'}
                                                    sx={{ textTransform: 'capitalize' }}
                                                />
                                            ))}
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Controls the personality of the AI when analyzing reflections.
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">Summarization Depth</Typography>
                                        <FormControl fullWidth size="small" sx={{ maxWidth: 300 }}>
                                            <Select
                                                value={ai.summarizationDepth}
                                                onChange={(e) => setAI({ ...ai, summarizationDepth: e.target.value as any })}
                                            >
                                                <MenuItem value="brief">Brief (Bullet points)</MenuItem>
                                                <MenuItem value="detailed">Detailed (Paragraphs)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">Visibility</Typography>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={ai.visibility === 'shared_with_teacher'}
                                                    onChange={(e) => setAI({ ...ai, visibility: e.target.checked ? 'shared_with_teacher' : 'admin_only' })}
                                                />
                                            }
                                            label="Share AI Insights directly with Teachers"
                                        />
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            If disabled, AI analysis is only visible to Admins.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            {/* Tab 2: Privacy */}
                            <Box role="tabpanel" hidden={activeTab !== 2}>
                                <Typography variant="h6" gutterBottom color="primary">Data Privacy & Retention</Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Stack spacing={4}>
                                    <Box>
                                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">Data Retention Policy</Typography>
                                        <Typography gutterBottom>
                                            Keep reflections for: <strong>{privacy.retentionDays} days</strong>
                                        </Typography>
                                        <Slider
                                            value={privacy.retentionDays}
                                            onChange={(_, v) => setPrivacy({ ...privacy, retentionDays: v as number })}
                                            min={30}
                                            max={730}
                                            step={30}
                                            valueLabelDisplay="auto"
                                        />
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">Consent & Sharing</Typography>
                                        <FormControlLabel
                                            control={<Switch checked={privacy.analyticsConsent} onChange={(e) => setPrivacy({ ...privacy, analyticsConsent: e.target.checked })} />}
                                            label="Collect anonymous usage analytics"
                                        />
                                        <FormControlLabel
                                            control={<Switch checked={privacy.dataSharingEvents} onChange={(e) => setPrivacy({ ...privacy, dataSharingEvents: e.target.checked })} />}
                                            label="Allow data use for impact events (with consent)"
                                        />
                                    </Box>
                                </Stack>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default SettingsPage;
