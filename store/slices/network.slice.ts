// features/network/networkSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NetworkState {
  isOnline: boolean;
}

const initialState: NetworkState = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setOnlineStatus(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
    },
  },
});

export const { setOnlineStatus } = networkSlice.actions;
export const networkReducer =  networkSlice.reducer;
