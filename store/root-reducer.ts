import { combineReducers } from '@reduxjs/toolkit';
import { userReducer } from './slices/user.slice';
import { apiReducer } from './slices/jio.slice';
import { themeReducer } from './slices/theme.slice';
import { playlistReducer } from './slices/playlist.slice';
import { playerReducer } from './slices/player.slice';
import { searchReducer } from './slices/search.slice';
import { settingsReducer } from './slices/settings.slice';
import { gaanaReducer } from './slices/gaana.slice';
import { searchParamsReducer } from './slices/search-params.slice';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { pageTitleReducer } from './slices/pageTitleSlice';

const settingsPersistConfig = {
  key: 'settings',
  storage,
  whitelist: ['isDarkTheme', 'allowSwipeGesture', 'selectedLanguages', 'streamingQuality', 'downloadQuality'], // skip static `languages`
};
const persistedSettingsReducer = persistReducer(settingsPersistConfig, settingsReducer);

const appReducer = combineReducers({
  // Add your reducers here
  user: userReducer,
  api: apiReducer,
  gaana:gaanaReducer,
  theme:themeReducer,
  player: playerReducer,
  playlist: playlistReducer,
  search: searchReducer,
  settings: persistedSettingsReducer,
  searchParams:searchParamsReducer,
  pageTitle:pageTitleReducer
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'global/reset') {
    state = undefined; // resets entire Redux store
  }
  return appReducer(state, action);
};


export default rootReducer;