import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Reflection {
  id: string;
  title: string;
  content: string;
  subject: string;
  grade: string;
  topic?: string;
  mood: 'HAPPY' | 'NEUTRAL' | 'FRUSTRATED' | 'CONFUSED' | 'EXCITED';
  tags: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  sentiment?: number;
  aiSuggestions?: string[];
  status: 'DRAFT' | 'SUBMITTED' | 'AI_ANALYZED' | 'CLUSTERED';
}

interface ReflectionsState {
  reflections: Reflection[];
  currentReflection: Reflection | null;
  loading: boolean;
  error: string | null;
  filters: {
    subject?: string;
    grade?: string;
    mood?: string;
    dateRange?: {start: string; end: string};
  };
  syncStatus: 'synced' | 'syncing' | 'offline';
  pendingSync: string[]; // IDs of reflections pending sync
}

const initialState: ReflectionsState = {
  reflections: [],
  currentReflection: null,
  loading: false,
  error: null,
  filters: {},
  syncStatus: 'synced',
  pendingSync: [],
};

const reflectionsSlice = createSlice({
  name: 'reflections',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setReflections: (state, action: PayloadAction<Reflection[]>) => {
      state.reflections = action.payload;
    },
    addReflection: (state, action: PayloadAction<Reflection>) => {
      state.reflections.unshift(action.payload);
      state.pendingSync.push(action.payload.id);
      state.syncStatus = 'syncing';
    },
    updateReflection: (state, action: PayloadAction<Reflection>) => {
      const index = state.reflections.findIndex(
        r => r.id === action.payload.id,
      );
      if (index !== -1) {
        state.reflections[index] = action.payload;
        if (!state.pendingSync.includes(action.payload.id)) {
          state.pendingSync.push(action.payload.id);
          state.syncStatus = 'syncing';
        }
      }
    },
    deleteReflection: (state, action: PayloadAction<string>) => {
      state.reflections = state.reflections.filter(
        r => r.id !== action.payload,
      );
      state.pendingSync = state.pendingSync.filter(id => id !== action.payload);
    },
    setCurrentReflection: (state, action: PayloadAction<Reflection | null>) => {
      state.currentReflection = action.payload;
    },
    setFilters: (state, action: PayloadAction<typeof initialState.filters>) => {
      state.filters = action.payload;
    },
    setSyncStatus: (
      state,
      action: PayloadAction<'synced' | 'syncing' | 'offline'>,
    ) => {
      state.syncStatus = action.payload;
    },
    markSynced: (state, action: PayloadAction<string[]>) => {
      state.pendingSync = state.pendingSync.filter(
        id => !action.payload.includes(id),
      );
      if (state.pendingSync.length === 0) {
        state.syncStatus = 'synced';
      }
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setReflections,
  addReflection,
  updateReflection,
  deleteReflection,
  setCurrentReflection,
  setFilters,
  setSyncStatus,
  markSynced,
  clearError,
} = reflectionsSlice.actions;

export default reflectionsSlice.reducer;
