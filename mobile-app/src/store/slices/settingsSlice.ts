import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  trainingReminders: boolean;
  communityUpdates: boolean;
  weeklyReports: boolean;
}

interface PrivacySettings {
  profileVisibility: 'PUBLIC' | 'TEACHERS_ONLY' | 'PRIVATE';
  shareReflections: boolean;
  shareProgress: boolean;
  allowAnalytics: boolean;
}

interface AppSettings {
  language: string;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  offlineMode: boolean;
  autoSync: boolean;
  dataUsage: 'low' | 'medium' | 'high';
}

interface SettingsState {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  app: AppSettings;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  notifications: {
    pushNotifications: true,
    emailNotifications: true,
    trainingReminders: true,
    communityUpdates: false,
    weeklyReports: true,
  },
  privacy: {
    profileVisibility: 'TEACHERS_ONLY',
    shareReflections: false,
    shareProgress: true,
    allowAnalytics: true,
  },
  app: {
    language: 'en',
    theme: 'system',
    fontSize: 'medium',
    offlineMode: true,
    autoSync: true,
    dataUsage: 'medium',
  },
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateNotificationSettings: (
      state,
      action: PayloadAction<Partial<NotificationSettings>>,
    ) => {
      state.notifications = {...state.notifications, ...action.payload};
    },
    updatePrivacySettings: (
      state,
      action: PayloadAction<Partial<PrivacySettings>>,
    ) => {
      state.privacy = {...state.privacy, ...action.payload};
    },
    updateAppSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.app = {...state.app, ...action.payload};
    },
    resetToDefaults: state => {
      state.notifications = initialState.notifications;
      state.privacy = initialState.privacy;
      state.app = initialState.app;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  updateNotificationSettings,
  updatePrivacySettings,
  updateAppSettings,
  resetToDefaults,
  clearError,
} = settingsSlice.actions;

export default settingsSlice.reducer;
