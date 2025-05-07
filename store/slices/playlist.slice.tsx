// src/features/playlist/playlistSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface PlaylistState {
  automaticPlaylist: any[];
  userPlaylist:any[];
}

const initialState: PlaylistState = {
    automaticPlaylist: [],
    userPlaylist: []
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    addToPlaylist(state, action: PayloadAction<any>) {
      const exists = state.automaticPlaylist.find(t => t.url === action.payload.url);
      if (!exists) {
        state.automaticPlaylist.push(action.payload);
      }
    },
    clearPlaylist(state) {
      state.automaticPlaylist = [];
    },
  },
});

export const { addToPlaylist, clearPlaylist } = playlistSlice.actions;
export const playlistReducer = playlistSlice.reducer;
