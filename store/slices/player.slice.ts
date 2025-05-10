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
  artist?: string
  album_artist?: [],
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
  volume: number; // Volume level (0 to 1)
  isMuted: boolean; // Mute state
}

const initialState: PlayerState = {
  playlist: [],
  currentTrackIndex: 0,
  isPlaying: false,
  isShuffle: false,
  isRepeat: false,
  volume: 1,
  isMuted: false,
  isLoading: false
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
    },
    previousTrack: (state) => {
      state.currentTrackIndex = (state.currentTrackIndex - 1 + state.playlist.length) % state.playlist.length;
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
    reorderPlaylist: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;
      const updated = [...state.playlist];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
    
      // Adjust currentTrackIndex accordingly
      if (from === state.currentTrackIndex) {
        state.currentTrackIndex = to;
      } else if (from < state.currentTrackIndex && to >= state.currentTrackIndex) {
        state.currentTrackIndex -= 1;
      } else if (from > state.currentTrackIndex && to <= state.currentTrackIndex) {
        state.currentTrackIndex += 1;
      }
    
      state.playlist = updated;
    },
  }
});

export const {
  playTrack, play, setVolume,
  toggleMute, pause, nextTrack, previousTrack,setCurrentTrackIndex,
  toggleRepeat, toggleShuffle, setPlaying, reorderPlaylist
} = playerSlice.actions;


export const playerReducer = playerSlice.reducer;

