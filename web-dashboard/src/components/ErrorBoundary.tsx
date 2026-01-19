import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: '#f5f5f5',
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 5,
              textAlign: 'center',
              maxWidth: 500,
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" color="error" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We encountered an unexpected error. Please try reloading the page.
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                component="pre"
                sx={{
                  mt: 2,
                  mb: 2,
                  p: 2,
                  bgcolor: '#f8f8f8',
                  borderRadius: 1,
                  overflow: 'auto',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                }}
              >
                {this.state.error.toString()}
              </Box>
            )}
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleReload}
              sx={{ mt: 2 }}
            >
              Reload Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
