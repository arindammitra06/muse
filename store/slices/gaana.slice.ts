import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch Gaana homepage data
export const fetchGaanaHomepage = createAsyncThunk(
  'gaana/fetchHomepage',
  async () => {
    const url =
      'https://api.gaana.com/index.php?type=feature&subtype=homepage&module=webapi&method=getFeatureContent';

    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await axios.get(`/api/proxy?url=${encodedUrl}`);

      if (response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid homepage response format');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch homepage data');
    }
  }
);


// Async thunk to fetch Gaana data
export const fetchGaanaData = createAsyncThunk(
  'gaana/fetchData',
  async ({ type, id }: { type: 'song' | 'album' | 'playlist'; id: string }) => {
    const url = `https://api.gaana.com/index.php?type=${type}&subtype=${type}detail&module=webapi&method=get${capitalize(
      type
    )}Info&${type}id=${id}`;

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0', // Some endpoints require this
        },
      });

      if (response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      throw new Error(`Error fetching ${type} with id ${id}: ${error.message}`);
    }
  }
);

// Helper function to capitalize the type string
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Redux slice
interface GaanaState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: GaanaState = {
  data: null,
  loading: false,
  error: null,
};

const gaanaSlice = createSlice({
  name: 'gaana',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGaanaHomepage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGaanaHomepage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchGaanaHomepage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Unknown error';
      }).addCase(fetchGaanaData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGaanaData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchGaanaData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});


export const gaanaReducer = gaanaSlice.reducer;
