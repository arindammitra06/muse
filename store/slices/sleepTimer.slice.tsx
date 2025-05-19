// store/slices/sleepTimerSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SleepTimerState {
  endTime: number | null; // timestamp when music should stop
  remaining: number | null;
  isActive: boolean;
}

const initialState: SleepTimerState = {
  endTime: null,
  remaining: null,
  isActive: false,
};

const sleepTimerSlice = createSlice({
  name: 'sleepTimer',
  initialState,
  reducers: {
    startSleepTimer: (state, action: PayloadAction<number>) => {
      const duration = action.payload; // in milliseconds
      state.endTime = Date.now() + duration;
      state.remaining = duration;
      state.isActive = true;
    },
    clearSleepTimer: (state) => {
      state.endTime = null;
      state.remaining = null;
      state.isActive = false;
    },
    updateRemaining: (state) => {
      if (state.endTime) {
        const timeLeft = state.endTime - Date.now();
        state.remaining = timeLeft > 0 ? timeLeft : 0;
        if (timeLeft <= 0) {
          state.isActive = false;
          state.endTime = null;
        }
      }
    },
  },
});

export const { startSleepTimer, clearSleepTimer, updateRemaining } = sleepTimerSlice.actions;
export const sleepTimerReducer =  sleepTimerSlice.reducer;
