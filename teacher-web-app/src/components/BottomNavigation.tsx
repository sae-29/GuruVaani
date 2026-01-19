import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation as MuiBottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { 
  Home, 
  EditNote, 
  School, 
  People, 
  BarChart,
  Settings 
} from '@mui/icons-material';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getValueFromPath = (path: string) => {
    switch (path) {
      case '/': return 0;
      case '/entries': return 1;
      case '/training': return 2;
      case '/community': return 3;
      case '/progress': return 4;
      case '/settings': return 5;
      default: return 0;
    }
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    const paths = ['/', '/entries', '/training', '/community', '/progress', '/settings'];
    navigate(paths[newValue]);
  };

  const currentValue = getValueFromPath(location.pathname);

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px -1px 4px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px 16px 0 0', // Rounded top corners (Android-style)
        maxWidth: '390px', // Match mobile frame
        margin: '0 auto',
        '@media (max-width: 390px)': {
          maxWidth: '100%',
        },
      }} 
      elevation={0}
    >
      <MuiBottomNavigation
        value={currentValue}
        onChange={handleChange}
        showLabels
        sx={{
          minHeight: 72, // Increased for better touch targets
          height: 72,
          backgroundColor: '#FFFFFF',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 0,
            maxWidth: 'none',
            padding: '8px 4px 8px',
            color: 'rgba(0, 0, 0, 0.5)',
            transition: 'all 0.15s ease-out',
            minHeight: 44, // Minimum touch target (44x44px)
            '&.Mui-selected': {
              color: '#FF7043',
              '& .MuiSvgIcon-root': {
                transform: 'scale(1.1)',
              },
            },
            '&:active': {
              transform: 'scale(0.95)', // Tap animation
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '10px',
            fontWeight: 400,
            marginTop: '4px',
            lineHeight: 1.2,
            transition: 'font-weight 0.15s ease-out',
            '&.Mui-selected': {
              fontSize: '10px',
              fontWeight: 600,
            },
          },
          '& .MuiSvgIcon-root': {
            fontSize: 22, // Slightly smaller for mobile
            transition: 'transform 0.15s ease-out, color 0.15s ease-out',
          },
        }}
      >
        <BottomNavigationAction 
          label="Home" 
          icon={<Home />} 
        />
        <BottomNavigationAction 
          label="My Entries" 
          icon={<EditNote />} 
        />
        <BottomNavigationAction 
          label="Learn" 
          icon={<School />} 
        />
        <BottomNavigationAction 
          label="Community" 
          icon={<People />} 
        />
        <BottomNavigationAction 
          label="Progress" 
          icon={<BarChart />} 
        />
        <BottomNavigationAction 
          label="Settings" 
          icon={<Settings />} 
        />
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation;