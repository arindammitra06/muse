import { languages } from "@/utils/generic.utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type SettingsState = {
  readonly isDarkTheme: boolean;
  readonly allowSwipeGesture: boolean;
  readonly streamingQuality: string;
  readonly downloadQuality: string;
  readonly languages: string[];
  readonly selectedLanguages: string[];
};

export const SETTING_INITIAL_STATE: SettingsState = {
  isDarkTheme: false,
  languages: languages,
  selectedLanguages: ['Hindi', 'Bengali'],
  streamingQuality: '96 kbps',
  downloadQuality: '320 kbps',
  allowSwipeGesture: false
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
    setDownloadQuality: (state, action: PayloadAction<string>) => {
      state.downloadQuality = action.payload;
    },
    setSwipeGesture: (state, action: PayloadAction<boolean>) => {
      state.allowSwipeGesture = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state) => {
      if (!state.languages || state.languages.length === 0) {
        state.languages = languages; // restore static value
      }
    });
  },
});


export const {setDarkTheme, setSwipeGesture, setSelectedLanguages,setStreamingQuality, setDownloadQuality} = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
