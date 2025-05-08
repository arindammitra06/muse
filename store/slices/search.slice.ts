import { AppUser } from "@/model/user.model";
import { baseUrl, formatAlbumResponse, formatSongsResponse, getResults, homeEndpoint, topSearches } from "@/utils/generic.utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";


type SearchItem = Record<string, any>;
type SearchResult = { title: string; items: SearchItem[] };

export type SearchState = {
  readonly searchString: string | null;
  searchedStrings: string[];
  topSearches: any[];
  searchResult: SearchResult[] | undefined;
  readonly isLoading: boolean;
  readonly error: string | null;
};

export const SEARCH_INITIAL_STATE: SearchState = {
  searchString: null,
  isLoading: false,
  error: null,
  searchedStrings: [],
  searchResult: [],
  topSearches: [],
};


export async function fetchSongSearchResults({
  searchQuery,
  count = 20,
  page = 1,
}: {
  searchQuery: string;
  count?: number;
  page?: number;
}): Promise<any> {
  
  const params = `p=${page}&q=${encodeURIComponent(searchQuery)}&n=${count}&${getResults}`;
  try {
    const encodedUrl = encodeURIComponent(`${baseUrl}${homeEndpoint}&${params}`);
    const response = await axios.get(`/api/proxy?url=${encodedUrl}`);
      

    if (response.status === 200 && response!==null && response!==undefined) {
      if(response.data!==null && response.data!==undefined){
        const responseList = response.data.results as any[];

        let finalSongs = await formatSongsResponse(responseList, 'song');
  
        if (finalSongs.length > count) {
          finalSongs = finalSongs.slice(0, count);
        }
  
        return {
          songs: finalSongs,
          error: '',
        };
      }else{
        return {
          songs: [],
          error: 'No data returned',
        };
      }
      
    } else {
      return {
        songs: [],
        error: 'No data returned',
      };
    }
  } catch (e: any) {
    console.error('Error in fetchSongSearchResults:', e);
    return {
      songs: [],
      error: e.message ?? String(e),
    };
  }
}


export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async ({ searchQuery }: { searchQuery: string }) => {
    try {

      let params;
      params = `__call=autocomplete.get&cc=in&includeMetaTags=1&query=${encodeURIComponent(searchQuery)}`;


      const encodedUrl = encodeURIComponent(`${baseUrl}${homeEndpoint}&${params}`);
      const response = await axios.get(`/api/proxy?url=${encodedUrl}`);
      console.log(response)
  
      if(response.status===200){
        const result: Record<string, SearchItem[]> = {};
        const position: Record<number, string> = {};
        
        
        let searchedSongList: SearchItem[] = [];
        let searchedAlbumList: SearchItem[] = [];
        let searchedPlaylistList: SearchItem[] = [];
        let searchedArtistList: SearchItem[] = [];
        let searchedTopQueryList: SearchItem[] = [];
        if (response.data!==null && response.data!==undefined) {
          const albumResponseList = response.data.albums?.data ?? [];
          position[response.data.albums?.position] = 'Albums';

          const playlistResponseList = response.data.playlists?.data ?? [];
          position[response.data.playlists?.position] = 'Playlists';

          const artistResponseList = response.data.artists?.data ?? [];
          position[response.data.artists?.position] = 'Artists';

          const topQuery = response.data.topquery?.data ?? [];

          searchedAlbumList = await formatAlbumResponse(albumResponseList, 'album');
          if (searchedAlbumList.length) result['Albums'] = searchedAlbumList;

          searchedPlaylistList = await formatAlbumResponse(playlistResponseList, 'playlist');
          if (searchedPlaylistList.length) result['Playlists'] = searchedPlaylistList;

          searchedArtistList = await formatAlbumResponse(artistResponseList, 'artist');
          if (searchedArtistList.length) result['Artists'] = searchedArtistList;

          const songResponse = await fetchSongSearchResults({ searchQuery, count: 5 });
          searchedSongList = songResponse.songs ?? [];
          if (searchedSongList.length) result['Songs'] = searchedSongList;

          if (
            topQuery.length &&
            (topQuery[0].type !== 'playlist' ||
              topQuery[0].type === 'artist' ||
              topQuery[0].type === 'album')
          ) {
            position[response.data.topquery?.position] = 'Top Result';
            position[response.data.songs?.position] = 'Songs';

            switch (topQuery[0].type) {
              case 'artist':
                searchedTopQueryList = await formatAlbumResponse(topQuery, 'artist');
                break;
              case 'album':
                searchedTopQueryList = await formatAlbumResponse(topQuery, 'album');
                break;
              case 'playlist':
                searchedTopQueryList = await formatAlbumResponse(topQuery, 'playlist');
                break;
            }

            if (searchedTopQueryList.length) {
              result['Top Result'] = searchedTopQueryList;
            }
          } else {
            if (topQuery.length && topQuery[0].type === 'song') {
              position[response.data.topquery?.position] = 'Songs';
            } else {
              position[response.data.songs?.position] = 'Songs';
            }
          }
        }

        const sortedKeys = Object.entries(position).sort(([a], [b]) => Number(a) - Number(b));
        const finalList: SearchResult[] = [];

        for (const [, title] of sortedKeys) {
          if (result[title]) {
            finalList.push({ title, items: result[title] });
          }
        }

        return finalList;
      }else{
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  });

  export const getTopSearches = createAsyncThunk(
    "search/getTopSearches",
    async () => {
      try {
  
        let params = topSearches;
        const encodedUrl = encodeURIComponent(`${baseUrl}${homeEndpoint}&${params}`);
        const response = await axios.get(`/api/proxy?url=${encodedUrl}`);
        return response.data;
        
      } catch (error) {
        console.error(error);
      }
    });
  

const searchSlice = createSlice({
  name: "search",
  initialState: SEARCH_INITIAL_STATE,
  reducers: {
    addSearchedString: (state, action: PayloadAction<string>) => {
      const str = action.payload;
      if (!state.searchedStrings.includes(str)) {
        state.searchedStrings.push(str);
      }
    },
    removeSearchedString: (state, action: PayloadAction<string>) => {
      const str = action.payload;
      state.searchedStrings = state.searchedStrings.filter(s => s !== str);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResult = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message != null ? action.error.message : "";
      })
      .addCase(getTopSearches.pending, (state) => {
        state.error = null;
      })
      .addCase(getTopSearches.fulfilled, (state, action) => {
        state.topSearches = action.payload;
      })
      .addCase(getTopSearches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message != null ? action.error.message : "";
      })
  },
});


export const { addSearchedString ,removeSearchedString} = searchSlice.actions;
export const searchReducer = searchSlice.reducer;
