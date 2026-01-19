import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { theme } from './theme/theme';
import Layout from './components/Layout/Layout';
import { DashboardPage as Dashboard } from './pages/Dashboard';
import Teachers from './pages/Teachers/Teachers';
import { EntriesPage } from './pages/Entries';
import { ClustersPage } from './pages/Clusters';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings/Settings';
import Login from './pages/Login';
import ModuleLibrary from './pages/Modules/ModuleLibrary';
import ModuleCreator from './pages/Modules/ModuleCreator';
import DispatchWizard from './pages/Modules/DispatchWizard';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route index element={<Dashboard />} />
                <Route path="teachers" element={<Teachers />} />
                <Route path="entries" element={<EntriesPage />} />
                <Route path="clusters" element={<ClustersPage />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="modules" element={<ModuleLibrary />} />
                <Route path="modules/create" element={<ModuleCreator />} />
                <Route path="modules/dispatch" element={<DispatchWizard />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}

export default App;