import { configureStore } from '@reduxjs/toolkit';

// Reducer placeholder
const rootReducer = (state = {}) => state;

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
