import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  subjects: string[];
  grades: string[];
  topics: string[];
  thumbnailUrl?: string;
  videoUrl?: string;
  materials: string[];
  avgRating: number;
  totalRatings: number;
  completionRate: number;
  isBookmarked: boolean;
  progress?: number; // 0-100
  completedAt?: string;
  rating?: number;
}

interface TrainingRecommendation {
  moduleId: string;
  relevanceScore: number;
  reasoning: string;
  basedOn: 'reflection' | 'cluster' | 'profile';
}

interface TrainingState {
  modules: TrainingModule[];
  recommendations: TrainingRecommendation[];
  bookmarkedModules: string[];
  completedModules: string[];
  currentModule: TrainingModule | null;
  loading: boolean;
  error: string | null;
  filters: {
    subject?: string;
    grade?: string;
    difficulty?: string;
    duration?: {min: number; max: number};
  };
}

const initialState: TrainingState = {
  modules: [],
  recommendations: [],
  bookmarkedModules: [],
  completedModules: [],
  currentModule: null,
  loading: false,
  error: null,
  filters: {},
};

const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setModules: (state, action: PayloadAction<TrainingModule[]>) => {
      state.modules = action.payload;
    },
    setRecommendations: (
      state,
      action: PayloadAction<TrainingRecommendation[]>,
    ) => {
      state.recommendations = action.payload;
    },
    setCurrentModule: (state, action: PayloadAction<TrainingModule | null>) => {
      state.currentModule = action.payload;
    },
    toggleBookmark: (state, action: PayloadAction<string>) => {
      const moduleId = action.payload;
      const index = state.bookmarkedModules.indexOf(moduleId);
      if (index === -1) {
        state.bookmarkedModules.push(moduleId);
      } else {
        state.bookmarkedModules.splice(index, 1);
      }

      // Update module bookmark status
      const module = state.modules.find(m => m.id === moduleId);
      if (module) {
        module.isBookmarked = !module.isBookmarked;
      }
    },
    updateProgress: (
      state,
      action: PayloadAction<{moduleId: string; progress: number}>,
    ) => {
      const {moduleId, progress} = action.payload;
      const module = state.modules.find(m => m.id === moduleId);
      if (module) {
        module.progress = progress;
        if (progress === 100 && !state.completedModules.includes(moduleId)) {
          state.completedModules.push(moduleId);
          module.completedAt = new Date().toISOString();
        }
      }
    },
    rateModule: (
      state,
      action: PayloadAction<{moduleId: string; rating: number}>,
    ) => {
      const {moduleId, rating} = action.payload;
      const module = state.modules.find(m => m.id === moduleId);
      if (module) {
        module.rating = rating;
      }
    },
    setFilters: (state, action: PayloadAction<typeof initialState.filters>) => {
      state.filters = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setModules,
  setRecommendations,
  setCurrentModule,
  toggleBookmark,
  updateProgress,
  rateModule,
  setFilters,
  clearError,
} = trainingSlice.actions;

export default trainingSlice.reducer;
