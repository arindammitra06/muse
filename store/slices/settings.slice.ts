import { languages } from "@/utils/generic.utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type SettingsState = {
  readonly isDarkTheme: boolean;
  readonly streamingQuality: string;
  readonly languages: string[];
  readonly selectedLanguages: string[];
};

export const SETTING_INITIAL_STATE: SettingsState = {
  isDarkTheme: false,
  languages: languages,
  selectedLanguages: ['Hindi', 'Bengali'],
  streamingQuality: '320 kbps'
};



const settingsSlice = createSlice({
  name: "settings",
  initialState: SETTING_INITIAL_STATE,
  reducers: {
    setDarkTheme: (state, action: PayloadAction<boolean>) => {
      const isDarkTheme = action.payload;
      state.isDarkTheme = isDarkTheme;
    },
    setSelectedLanguages: (state, action: PayloadAction<string[]>) => {
      state.selectedLanguages = action.payload;
    },
    setStreamingQuality: (state, action: PayloadAction<string>) => {
      state.streamingQuality = action.payload;
    },
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(fetchSearchResults.pending, (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchSearchResults.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     state.searchResult = action.payload;
    //   })
    //   .addCase(fetchSearchResults.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.error.message != null ? action.error.message : "";
    //   })
  },
});


export const {setDarkTheme, setSelectedLanguages,setStreamingQuality} = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
