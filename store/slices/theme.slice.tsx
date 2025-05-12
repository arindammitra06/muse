
import { jioTheme, } from "@/theme";
import { baseUrl } from "@/utils/generic.utils";
import { MantineThemeOverride } from "@mantine/core";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export type ThemeState = {
  readonly theme: any;
  readonly temptheme: any | null;
  readonly themeLoading: boolean;
};

export const THEME_INITIAL_STATE: ThemeState = {
  theme: jioTheme,
  themeLoading: false,
  temptheme: null
};

export const getAllThemes = createAsyncThunk(
  "theme/getAllThemes",
  async ({ campusId, userId }: { campusId: number, userId: number }) => {
    try {
      const response = await axios.get(
        baseUrl + `master/getAllThemes/${campusId}/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  });


export const saveATheme = createAsyncThunk(
  "theme/saveATheme",
  async ({ form , userId, campusId}: { form: any , userId: number, campusId: number}) => {
    try {

      const response = await axios({
        method: 'post',
        url: baseUrl + `master/saveATheme`,
        data: { form: form , campusId: campusId, userId:userId}
      });;
      return response.data;
    } catch (error) {
      console.error(error);
    }
  });


export const setCurrentTheme = createAsyncThunk(
  "theme/setCurrentTheme",
  async ({ theme }: { theme: MantineThemeOverride }) => {
    return theme;
  });

export const setTemporaryCurrentTheme = createAsyncThunk(
  "theme/setTemporaryCurrentTheme",
  async ({ theme }: { theme: MantineThemeOverride }) => {
    return theme;
  });

export const revertToOriginalTheme = createAsyncThunk(
  "theme/revertToOriginalTheme",
  async ({ doRevert }: { doRevert: boolean }) => {
    return doRevert;
  });

  export const updateUserTheme = createAsyncThunk(
    "theme/updateUserTheme", 
    async ({themeName,isUserTheme, id, campusId}: { themeName:string, isUserTheme:boolean, id:number, campusId:number}) => {
      try {
        const response = await axios({
          method: 'post',
          url:  baseUrl+`user/updateUserTheme`,
          data: {
            'themeName': themeName,
            'isUserTheme': isUserTheme ? 1:0,
            'id':id,
            'campusId': campusId
          },
      });;
        return response.data;
      } catch (error) {
        console.error(error);
      }
  });



const themeSlice = createSlice({
  name: "theme",
  initialState: THEME_INITIAL_STATE,
  reducers: {
    getCurrentTheme(state: any, action: any,) {
      const currentTheme = state.theme;

      return currentTheme;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setCurrentTheme.pending, (state) => {
        state.themeLoading = true;
      })
      .addCase(setCurrentTheme.fulfilled, (state, action) => {
        state.themeLoading = false;
        state.theme = action.payload;
      })
      .addCase(setCurrentTheme.rejected, (state, action) => {
        state.themeLoading = false;
        state.theme = jioTheme;
      })
      .addCase(setTemporaryCurrentTheme.pending, (state) => {
        state.themeLoading = true;
      })
      .addCase(setTemporaryCurrentTheme.fulfilled, (state, action) => {
        state.themeLoading = false;
        const deepCopyOldTheme: any = Object.assign({}, state.theme);
        state.temptheme = deepCopyOldTheme;
        state.theme = action.payload;
      })
      .addCase(setTemporaryCurrentTheme.rejected, (state, action) => {
        state.themeLoading = false;
        state.theme = jioTheme;
      })
      .addCase(revertToOriginalTheme.pending, (state) => {
        state.themeLoading = true;
      })
      .addCase(revertToOriginalTheme.fulfilled, (state, action) => {
        state.themeLoading = false;
        state.theme = state.temptheme as MantineThemeOverride;
      })
      .addCase(revertToOriginalTheme.rejected, (state, action) => {
        state.themeLoading = false;
        state.theme = jioTheme;
      })
  },
});


export const { getCurrentTheme } = themeSlice.actions;

export const themeReducer = themeSlice.reducer;
