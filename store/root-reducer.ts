import { combineReducers } from '@reduxjs/toolkit';
import { userReducer } from './slices/user.slice';
import { apiReducer } from './slices/jio.slice';
import { themeReducer } from './slices/theme.slice';
import { playlistReducer } from './slices/playlist.slice';
import { playerReducer } from './slices/player.slice';
import { searchReducer } from './slices/search.slice';
import { settingsReducer } from './slices/settings.slice';

const rootReducer = combineReducers({
  // Add your reducers here
  user: userReducer,
  api: apiReducer,
  theme:themeReducer,
  player: playerReducer,
  playlist: playlistReducer,
  search: searchReducer,
  settings: settingsReducer
});

export default rootReducer;