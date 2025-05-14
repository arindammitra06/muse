// player.slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RepeatMode = 'none' | 'all' | 'one';

export interface Track {
  id: string;
  type: string;
  album?: string;
  year?: string;
  duration?: number;
  language?: string;
  genre?: string;
  '320kbps'?: string;
  has_lyrics?: string;
  lyrics_snippet?: string;
  release_date?: string;
  album_id?: string;
  subtitle?: string;
  title?: string;
  artist?: string;
  album_artist?: [];
  image?: string;
  perma_url?: string;
  url?: string;
}

interface PlayerState {
  isLoading: boolean;
  playlist: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  volume: number;
  isMuted: boolean;
  seekPosition: number; // New state to store seek position
}

const initialState: PlayerState = {
  playlist: [],
  currentTrackIndex: 0,
  isPlaying: false,
  isShuffle: false,
  isRepeat: false,
  volume: 1,
  isMuted: false,
  isLoading: false,
  seekPosition: 0, // Default seek position is 0
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
    toggleMute(state) {
      state.isMuted = !state.isMuted;
    },
    playTrack: (state, action: PayloadAction<Track>) => {
      state.isLoading = true;
      const index = state.playlist.findIndex(t => t.id === action.payload.id);
      if (index === -1) {
        state.playlist.unshift(action.payload);
        state.currentTrackIndex = 0;
      } else {
        state.currentTrackIndex = index;
      }
      state.isPlaying = true;
      state.isLoading = false;
      state.seekPosition = 0; // Reset seek position when a new track starts
    },
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    nextTrack: (state) => {
      if (state.isShuffle) {
        state.currentTrackIndex = Math.floor(Math.random() * state.playlist.length);
      } else {
        state.currentTrackIndex = (state.currentTrackIndex + 1) % state.playlist.length;
      }
      state.seekPosition = 0; // Reset seek when moving to next track
    },
    previousTrack: (state) => {
      state.currentTrackIndex = (state.currentTrackIndex - 1 + state.playlist.length) % state.playlist.length;
      state.seekPosition = 0; // Reset seek when moving to previous track
    },
    setSeekPosition: (state, action: PayloadAction<number>) => {
      state.seekPosition = action.payload;
    },
    toggleRepeat: (state) => {
      state.isRepeat = !state.isRepeat;
    },
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentTrackIndex(state, action: PayloadAction<number>) {
      state.currentTrackIndex = action.payload;
    },
    addMultiTracksAfterCurrent: (state, action: PayloadAction<Track[]>) => {
      const insertIndex = state.currentTrackIndex + 1;
      const newTracks = action.payload;
    
      // Remove existing instances of the tracks to avoid duplicates
      const newTrackIds = new Set(newTracks.map(track => track.id));
      state.playlist = state.playlist.filter(track => !newTrackIds.has(track.id));
    
      // Insert tracks after the current one
      state.playlist.splice(insertIndex, 0, ...newTracks);
    },
    addTrackAfterCurrent: (state, action: PayloadAction<Track>) => {
      const insertIndex = state.currentTrackIndex + 1;
      const trackId = action.payload.id;

      const existingIndex = state.playlist.findIndex(track => track.id === trackId);
      if (existingIndex !== -1) {
        state.playlist.splice(existingIndex, 1);
        state.playlist.splice(insertIndex, 0, action.payload);
      } else {
        state.playlist.splice(insertIndex, 0, action.payload);
      }
    },
    removeTrackFromPlaylist: (state, action: PayloadAction<string>) => {
      const trackIdToRemove = action.payload;
      const index = state.playlist.findIndex(track => track.id === trackIdToRemove);

      if (index !== -1) {
        state.playlist.splice(index, 1);
        if (index < state.currentTrackIndex) {
          state.currentTrackIndex -= 1;
        } else if (index === state.currentTrackIndex) {
          state.currentTrackIndex = 0;
          state.isPlaying = false;
        }
      }
    },
    reorderPlaylist: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;
      const updated = [...state.playlist];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);

      if (from === state.currentTrackIndex) {
        state.currentTrackIndex = to;
      } else if (from < state.currentTrackIndex && to >= state.currentTrackIndex) {
        state.currentTrackIndex -= 1;
      } else if (from > state.currentTrackIndex && to <= state.currentTrackIndex) {
        state.currentTrackIndex += 1;
      }

      state.playlist = updated;
    },
    setPlaylistAndPlay: (state, action: PayloadAction<Track[]>) => {
      const newTracks = action.payload;
      let tracksWithUrl = [];
      
      const uniqueNewTracks = newTracks.filter(
        (track) => !state.playlist.some((t) => t.id === track.id)
      );

      state.playlist = [...uniqueNewTracks, ...state.playlist.filter(t => !uniqueNewTracks.find(nt => nt.id === t.id))];
      state.currentTrackIndex = 0;
      state.isPlaying = true;
      state.isLoading = false;
    },
  }
});

export const {
  playTrack, play, setVolume, addTrackAfterCurrent, removeTrackFromPlaylist,
  toggleMute, pause, nextTrack, previousTrack, setCurrentTrackIndex,addMultiTracksAfterCurrent,
  toggleRepeat, toggleShuffle, setPlaying, reorderPlaylist, setPlaylistAndPlay, setSeekPosition
} = playerSlice.actions;

export const playerReducer = playerSlice.reducer;
