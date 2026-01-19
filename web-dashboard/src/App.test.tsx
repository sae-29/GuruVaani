import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Dashboard from './pages/Dashboard';
import { theme } from './theme/theme';

// Mock store
const store = configureStore({
  reducer: {
    // Add reducers if needed for the dashboard test
    auth: (state = { user: null }) => state,
  },
});

describe('Dashboard Page', () => {
  it('renders dashboard title', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Dashboard />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Check for "Top Challenges" which we know exists in the rendered output
    expect(screen.getByText(/Top Challenges/i)).toBeInTheDocument();
  });
});
