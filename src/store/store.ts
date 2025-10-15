import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import studentsReducer from './studentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
