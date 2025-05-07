import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export type RepeatMode = 'none' | 'all' | 'one';

export interface Track {
  id: string;
  type: string;
  album?: string;
  year?: string;
  duration?: string;
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
  playlist: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
}

const initialState: PlayerState = {
  playlist: [],
  currentTrackIndex: 0,
  isPlaying: false,
  isShuffle: false,
  isRepeat: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playTrack: (state, action: PayloadAction<Track>) => {
      const index = state.playlist.findIndex(t => t.id === action.payload.id);
      if (index === -1) {
        state.playlist.unshift(action.payload);
        state.currentTrackIndex = 0;
      } else {
        state.currentTrackIndex = index;
      }
      state.isPlaying = true;
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
  playTrack, play, pause, nextTrack, previousTrack,setCurrentTrackIndex,
  toggleRepeat, toggleShuffle, setPlaying, reorderPlaylist
} = playerSlice.actions;


export const playerReducer = playerSlice.reducer;

