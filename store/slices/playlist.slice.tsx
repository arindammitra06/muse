// src/features/playlist/playlistSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Track } from './player.slice';

export interface Playlist {
  id: string;
  name: string;
  image:string|null;
  tracks: Track[];
}

interface PlaylistState {
   userPlaylist:Playlist[];
}

const initialState: PlaylistState = {
  userPlaylist: [
    {
      id: 'favorites',
      name: 'Favorites',
      image: null,
      tracks: [],
    },
    {
      id: 'downloads',
      name: 'Downlaods',
      image: null,
      tracks: [],
    },
  ],
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    createPlaylist(state, action: PayloadAction<{ id: string; name: string ;image:string|null}>) {
      state.userPlaylist.push({ id: action.payload.id, name: action.payload.name, tracks: [], image: action.payload.image });
    },
    deletePlaylist(state, action: PayloadAction<string>) {
      state.userPlaylist = state.userPlaylist.filter((p) => p.id !== action.payload);
    },
    addSongToPlaylist(state, action: PayloadAction<{ playlistId: string; song: Track }>) {
      
      const playlist = state.userPlaylist.find((p) => p.id === action.payload.playlistId);
      
      if (playlist && !playlist.tracks.find((s) => s.id === action.payload.song.id)) {
        playlist.tracks.push(action.payload.song);
      }
    },
    removeSongFromPlaylist(state, action: PayloadAction<{ playlistId: string; songId: string }>) {
      const playlist = state.userPlaylist.find((p) => p.id === action.payload.playlistId);
      if (playlist) {
        playlist.tracks = playlist.tracks.filter((s) => s.id !== action.payload.songId);
      }
    },
    clearPlaylist(state, action: PayloadAction<string>) {
      const playlist = state.userPlaylist.find((p) => p.id === action.payload);
      if (playlist) {
        playlist.tracks = [];
      }
    },
    toggleFavorite(state, action: PayloadAction<Track>) {
      const favorites = state.userPlaylist.find((p) => p.id === 'favorites');
      if (!favorites) return;

      const exists = favorites.tracks.find((s) => s.id === action.payload.id);
      if (exists) {
        favorites.tracks = favorites.tracks.filter((s) => s.id !== action.payload.id);
      } else {
        favorites.tracks.push(action.payload);
      }
    },
  },
});

export const { createPlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  clearPlaylist,toggleFavorite } = playlistSlice.actions;
export const playlistReducer = playlistSlice.reducer;
