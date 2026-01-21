import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { theme } from './theme/theme';

// Components
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import CreateEntryScreen from './components/CreateEntryScreen';
import EntriesScreen from './components/EntriesScreen';
import TrainingScreen from './components/TrainingScreen';
import CommunityScreen from './components/CommunityScreen';
import SettingsScreen from './components/SettingsScreen';
import ProgressScreen from './components/ProgressScreen';
import BottomNavigation from './components/BottomNavigation';

// Onboarding Components (simplified - no language selection)
import WelcomeScreen from './components/Onboarding/WelcomeScreen';
import OfflineModeScreen from './components/Onboarding/OfflineModeScreen';
import PermissionsScreen from './components/Onboarding/PermissionsScreen';
import ProfileSetupScreen from './components/Onboarding/ProfileSetupScreen';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token and user
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const hasLaunched = localStorage.getItem('hasLaunched');

    if (token && storedUser) {
      // Verify token is still valid
      fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            setCurrentUser(result.data);
            setIsAuthenticated(true);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        })
        .catch(() => {
          // Network error, use cached user
          try {
            setCurrentUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } catch {
            // Invalid cached user
          }
        })
        .finally(() => {
          setIsFirstLaunch(hasLaunched === null);
          setIsLoading(false);
        });
    } else {
      setIsFirstLaunch(hasLaunched === null);
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasLaunched', 'true');
    setIsFirstLaunch(false);
  };

  if (isLoading) {
    return null;
  }

  // First launch onboarding (simplified - no language selection)
  if (isFirstLaunch) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/onboarding/welcome" element={<WelcomeScreen />} />
            <Route path="/onboarding/offline" element={<OfflineModeScreen />} />
            <Route path="/onboarding/permissions" element={<PermissionsScreen />} />
            <Route
              path="/onboarding/profile"
              element={<ProfileSetupScreen onComplete={handleOnboardingComplete} />}
            />
            <Route path="*" element={<Navigate to="/onboarding/welcome" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginScreen onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Mobile Device Frame */}
        <Box
          sx={{
            maxWidth: '390px',
            width: '100%',
            height: '100vh',
            maxHeight: '844px',
            margin: '0 auto',
            backgroundColor: '#000',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 0 20px rgba(0,0,0,0.3)',
            '@media (max-width: 390px)': {
              maxWidth: '100%',
              maxHeight: '100vh',
            },
          }}
        >
          {/* Safe Area Container */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#FAFAFA',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            {/* Content Area - Scrollable */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: '72px',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
              }}
            >
              <Routes>
                <Route path="/" element={<HomeScreen user={currentUser} />} />
                <Route path="/create-entry" element={<CreateEntryScreen />} />
                <Route path="/entries" element={<EntriesScreen />} />
                <Route path="/training" element={<TrainingScreen />} />
                <Route path="/community" element={<CommunityScreen />} />
                <Route path="/progress" element={<ProgressScreen />} />
                <Route path="/settings" element={<SettingsScreen user={currentUser} onLogout={handleLogout} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
            {/* Fixed Bottom Navigation */}
            <BottomNavigation />
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;