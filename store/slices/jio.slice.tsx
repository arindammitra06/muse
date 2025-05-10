import { AppUser } from "@/model/user.model";
import { albumDetails, artistRadio, baseUrl, entityRadio, featuredRadio, formatArtistTopAlbumsResponse, formatSimilarArtistsResponse, formatSongsResponse, fromToken, homeEndpoint, playlistDetails } from "@/utils/generic.utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { getCommonHeaders } from "../hooks";



export type ApiState = {
  readonly homedata: any | undefined;
  readonly artistData: any | undefined;
  readonly isLoading: boolean;
  readonly error: string | null;
};

export const API_INITIAL_STATE: ApiState = {
  homedata: undefined,
  isLoading: false,
  error: null,
  artistData: undefined
};


export const fetchHomePageData = createAsyncThunk(
  "api/fetchHomePageData",
  async (_: void, thunkAPI) => {
    try {
      const headers = getCommonHeaders(thunkAPI.getState() as any);
      const encodedUrl = encodeURIComponent(baseUrl + homeEndpoint);
      const response = await axios.get(`/api/proxy?url=${encodedUrl}`, { headers: headers});
      return response.data;
    } catch (error) {
      console.error(error);
    }
  });

export const fetchAlbumSongs = createAsyncThunk(
  "api/fetchAlbumSongs",
  async ({ albumId }: { albumId: string }, thunkAPI) => {
    try {
      const headers = getCommonHeaders(thunkAPI.getState() as any);
      console.log(headers)
      const encodedUrl = encodeURIComponent(`${baseUrl}${homeEndpoint}&${albumDetails}&cc=in&albumid=${albumId}`);
      const response = await axios.get(`/api/proxy?url=${encodedUrl}`, { headers: headers});

      return response.data;
    } catch (error) {
      console.error(error);
    }
  });

export const fetchPlaylistSongs = createAsyncThunk(
  "api/fetchPlaylistSongs",
  async ({ albumId }: { albumId: string },thunkAPI) => {
    try {
      const headers = getCommonHeaders(thunkAPI.getState() as any);
      console.log(headers)
      const encodedUrl = encodeURIComponent(`${baseUrl}${homeEndpoint}&${playlistDetails}&cc=in&listid=${albumId}`);
      const response = await axios.get(`/api/proxy?url=${encodedUrl}`, { headers: headers});

      return response.data;
    } catch (error) {
      console.error(error);
    }
  });


export const fetchFeaturedRadio = createAsyncThunk(
  "api/fetchFeaturedRadio",
  async ({ names, stationType, language }: { names: string[], stationType: string, language?: string },thunkAPI) => {
    try {
      let params;
      const headers = getCommonHeaders(thunkAPI.getState() as any);
      console.log(headers)
      
      if (stationType == 'featured') {
        let params = `name=${names[0]}&language=${language}&${featuredRadio}`;
      } else if (stationType == 'artist') {
        let params = `name=${names[0]}&query=${names[0]}&language=${language}&${artistRadio}`;
      } else if (stationType == 'entity') {
        let params = `entity_id=${names.map((e) => `"${e}"`)}&entity_type=queue&${entityRadio}`;
      }

      const encodedUrl = encodeURIComponent(`${baseUrl}${homeEndpoint}&${params}`);
      const response = await axios.get(`/api/proxy?url=${encodedUrl}`, { headers: headers});

      return response.data;
    } catch (error) {
      console.error(error);
    }
  });

export const fetchArtistSongs = createAsyncThunk(
  "api/fetchArtistSongs",
  async ({ artistToken, category = 'latest', sortOrder = 'desc' }: { artistToken: any, category: string, sortOrder?: string },thunkAPI) => {
    try {
      const headers = getCommonHeaders(thunkAPI.getState() as any);
      console.log(headers)
      
      const finalData: any = {};
      let params = `${fromToken}&type=artist&p=&n_song=50&n_album=50&sub_type=&category=${category}&sort_order=${sortOrder}&includeMetaTags=0&token=${artistToken}`;

      const encodedUrl = encodeURIComponent(`${baseUrl}${homeEndpoint}&${params}`);
      const response = await axios.get(`/api/proxy?url=${encodedUrl}`, { headers: headers});
     
      console.log(response)
      if (response.status === 200) {
        const getMain = response.data;
        const topSongsResponseList = getMain['topSongs'] ?? [];
        const latestReleaseResponseList = getMain['latest_release'] ?? [];
        const topAlbumsResponseList = getMain['topAlbums'] ?? [];
        const singlesResponseList = getMain['singles'] ?? [];
        const dedicatedResponseList = getMain['dedicated_artist_playlist'] ?? [];
        const featuredResponseList = getMain['featured_artist_playlist'] ?? [];
        const similarArtistsResponseList = getMain['similarArtists'] ?? [];

        const topSongsSearchedList = await formatSongsResponse(topSongsResponseList, 'song');
        if (topSongsSearchedList.length > 0) {
          finalData[getMain.modules?.topSongs?.title?.toString() ?? 'Top Songs'] = topSongsSearchedList;
        }

        const latestReleaseSearchedList = await formatArtistTopAlbumsResponse(latestReleaseResponseList);
        if (latestReleaseSearchedList.length > 0) {
          finalData[getMain.modules?.latest_release?.title?.toString() ?? 'Latest Releases'] = latestReleaseSearchedList;
        }

        const topAlbumsSearchedList = await formatArtistTopAlbumsResponse(topAlbumsResponseList);
        if (topAlbumsSearchedList.length > 0) {
          finalData[getMain.modules?.topAlbums?.title?.toString() ?? 'Top Albums'] = topAlbumsSearchedList;
        }

        const singlesSearchedList = await formatArtistTopAlbumsResponse(singlesResponseList);
        if (singlesSearchedList.length > 0) {
          finalData[getMain.modules?.singles?.title?.toString() ?? 'Singles'] = singlesSearchedList;
        }

        const dedicatedSearchedList = await formatArtistTopAlbumsResponse(dedicatedResponseList);
        if (dedicatedSearchedList.length > 0) {
          finalData[getMain.modules?.dedicated_artist_playlist?.title?.toString() ?? 'Dedicated Playlists'] = dedicatedSearchedList;
        }

        const featuredSearchedList = await formatArtistTopAlbumsResponse(featuredResponseList);
        if (featuredSearchedList.length > 0) {
          finalData[getMain.modules?.featured_artist_playlist?.title?.toString() ?? 'Featured Playlists'] = featuredSearchedList;
        }

        const similarArtistsSearchedList = await formatSimilarArtistsResponse(similarArtistsResponseList);
        if (similarArtistsSearchedList.length > 0) {
          finalData[getMain.modules?.similarArtists?.title?.toString() ?? 'Similar Artists'] = similarArtistsSearchedList;
        }
      }
      return finalData;

    } catch (error) {
      console.error(error);
    }
  });


export const getSongFromToken = createAsyncThunk(
  "api/getSongFromToken",
  async ({ token, type }: { token: string, type: string, }, thunkAPI) => {
    try {
      const headers = getCommonHeaders(thunkAPI.getState() as any);
      console.log(headers)
      
      let params = `token=${token}&type=${type}&n=10&p=1&${fromToken}`;
      const encodedUrl = encodeURIComponent(`${baseUrl}${homeEndpoint}&${params}`);
      const response = await axios.get(`/api/proxy?url=${encodedUrl}`, { headers: headers});


      return response.data;
    } catch (error) {
      console.error(error);
    }
  });

export const getSongFromTokenPhase2 = createAsyncThunk(
  "api/getSongFromTokenPhase2",
  async ({ token, type, listCount }: { token: string, type: string, listCount: string }, thunkAPI) => {
    try {
      const headers = getCommonHeaders(thunkAPI.getState() as any);
      console.log(headers)
      
      let params = `token=${token}&type=${type}&n=${listCount}&p=1&${fromToken}`;
      const encodedUrl = encodeURIComponent(`${baseUrl}${homeEndpoint}&${params}`);
      const response = await axios.get(`/api/proxy?url=${encodedUrl}`, { headers: headers});

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
      .addCase(fetchArtistSongs.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchArtistSongs.fulfilled, (state, action) => {
        state.artistData = action.payload;
      })
      .addCase(fetchArtistSongs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message != null ? action.error.message : "";
      })

  },
});



export const apiReducer = apiSlice.reducer;
