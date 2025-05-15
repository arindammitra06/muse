// store/slices/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  primaryColor: string;
}

const initialState: ThemeState = {
  primaryColor: '#54e382',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setPrimaryColor(state, action: PayloadAction<string>) {
      state.primaryColor = action.payload;
    },
  },
});

export const { setPrimaryColor } = themeSlice.actions;
export const themeReducer =  themeSlice.reducer;
