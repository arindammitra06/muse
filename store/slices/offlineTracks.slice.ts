
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { openDB } from 'idb';
import { RootState } from '../store';
import { Track } from './player.slice';

export const OFFLINE_DB_NAME = 'muse-music-player-db';
export const STORE_NAME = 'tracks';

export interface OfflineTrack {
  id: string;
  blob: Blob;
}

const getDb = async () => {
  return openDB(OFFLINE_DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const saveOfflineTrack = createAsyncThunk(
  'offlineTracks/saveOfflineTrack',
  async ({ song, id, url }: { song: any, id: string, url: string }) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const db = await getDb();
    await db.put(STORE_NAME, { id, blob ,song });
    return song;
  }
);

export const getTrackBlobUrl = async (id: string): Promise<string | null> => {
  const db = await getDb();
  const record = await db.get(STORE_NAME, id);
  if (record) {
    return URL.createObjectURL(record.blob);
  }
  return null;
};

export const loadOfflineTracksFromIndexedDB = createAsyncThunk<Track[]>(
  'offlineTracks/loadOfflineTracksFromIndexedDB',
  async () => {
    const db = await getDb();
    const allKeys = await db.getAllKeys(STORE_NAME);

    const downloadedTracks: Track[] = [];

    // for (const id of allKeys) {
    //   const record = await db.get(STORE_NAME, id);
    //   console.log(record);
    //   if (record) {
    //     downloadedTracks.push(record.song);
    //   }
    // }

    return downloadedTracks;
  }
);
interface OfflineTracksState {
  downloaded: Track[];
  isSavingOffline: boolean;
}

const initialState: OfflineTracksState = {
  downloaded: [],
  isSavingOffline: false
};

const offlineTracksSlice = createSlice({
  name: 'offlineTracks',
  initialState,
  reducers: {
    removeDownloadedTrack: (state, action: PayloadAction<string>) => {
      state.downloaded = state.downloaded.filter((t) => t.id !== action.payload);
    },
    setDownloadedTracks: (state, action: PayloadAction<Track[]>) => {
      state.downloaded = action.payload;
    },
    updateDownloadedOrder: (state, action: PayloadAction<Track[]>) => {
      state.downloaded = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveOfflineTrack.fulfilled, (state, action) => {
        const exists = state.downloaded.find((t) => t.id === action.payload.id);
        if (!exists) {
          state.downloaded.push(action.payload);
        }
        state.isSavingOffline = false;
      })
      .addCase(saveOfflineTrack.pending, (state) => {
        state.isSavingOffline = true;
      })
      .addCase(saveOfflineTrack.rejected, (state, action) => {
        state.isSavingOffline = false;
      })
      .addCase(loadOfflineTracksFromIndexedDB.fulfilled, (state, action) => {
        state.downloaded = action.payload;
      })
  },
});

export const selectOfflineTrackIds = (state: RootState) => state.offlineTracks.downloaded;
export const { updateDownloadedOrder, removeDownloadedTrack, setDownloadedTracks } = offlineTracksSlice.actions;
export const offlineTracksReducer = offlineTracksSlice.reducer;
