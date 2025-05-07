import { AppUser } from "@/model/user.model";
import { albumDetails, artistRadio, baseUrl, entityRadio, featuredRadio, fromToken, homeEndpoint, playlistDetails } from "@/utils/generic.utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";



export type ApiState = {
  readonly homedata: any | undefined;
  readonly isLoading: boolean;
  readonly error: string | null;
};

export const API_INITIAL_STATE: ApiState = {
  homedata: undefined,
  isLoading: false,
  error: null,
};


export const fetchHomePageData = createAsyncThunk(
  "api/fetchHomePageData",
  async ({ lang, genre }: { lang: string, genre: string }) => {
    try {
      const encodedUrl = encodeURIComponent(baseUrl + homeEndpoint);
      const response = await axios.get(`/api/proxy?url=${encodedUrl}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  });

export const fetchAlbumSongs = createAsyncThunk(
  "api/fetchAlbumSongs",
  async ({ albumId }: { albumId: string }) => {
    try {
      const encodedUrl = encodeURIComponent(`${baseUrl}${homeEndpoint}&${albumDetails}&cc=in&albumid=${albumId}`);
      const response = await axios.get(`/api/proxy?url=${encodedUrl}`);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  });

export const fetchPlaylistSongs = createAsyncThunk(
  "api/fetchPlaylistSongs",
  async ({ albumId }: { albumId: string }) => {
    try {
      const encodedUrl = encodeURIComponent(`${baseUrl}${homeEndpoint}&${playlistDetails}&cc=in&listid=${albumId}`);
      const response = await axios.get(`/api/proxy?url=${encodedUrl}`);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  });


export const fetchFeaturedRadio = createAsyncThunk(
  "api/fetchFeaturedRadio",
  async ({ names, stationType, language }: { names: string[], stationType: string, language?: string }) => {
    try {
      let params;

      if (stationType == 'featured') {
        let params = `name=${names[0]}&language=${language}&${featuredRadio}`;
      } else if (stationType == 'artist') {
        let params = `name=${names[0]}&query=${names[0]}&language=${language}&${artistRadio}`;
      } else if (stationType == 'entity') {
        let params = `entity_id=${names.map((e) => `"${e}"`)}&entity_type=queue&${entityRadio}`;
      }

      const encodedUrl = encodeURIComponent(`${baseUrl}${homeEndpoint}&${params}`);
      const response = await axios.get(`/api/proxy?url=${encodedUrl}`);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  });




export const getSongFromToken = createAsyncThunk(
  "api/getSongFromToken",
  async ({ token, type }: { token: string, type: string, }) => {
    try {
      let params = `token=${token}&type=${type}&n=10&p=1&${fromToken}`;
      const encodedUrl = encodeURIComponent(`${baseUrl}${homeEndpoint}&${params}`);
      const response = await axios.get(`/api/proxy?url=${encodedUrl}`);


      return response.data;
    } catch (error) {
      console.error(error);
    }
  });

export const getSongFromTokenPhase2 = createAsyncThunk(
  "api/getSongFromTokenPhase2",
  async ({ token, type, listCount }: { token: string, type: string, listCount: string }) => {
    try {
      let params = `token=${token}&type=${type}&n=${listCount}&p=1&${fromToken}`;
      const encodedUrl = encodeURIComponent(`${baseUrl}${homeEndpoint}&${params}`);
      const response = await axios.get(`/api/proxy?url=${encodedUrl}`);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  });


const apiSlice = createSlice({
  name: "api",
  initialState: API_INITIAL_STATE,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomePageData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomePageData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.homedata = action.payload;
      }
      )
      .addCase(fetchHomePageData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message != null ? action.error.message : "";
      })
      

  },
});



export const apiReducer = apiSlice.reducer;
