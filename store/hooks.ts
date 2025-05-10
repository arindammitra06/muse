import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const getCommonHeaders = (state: RootState) => {
    const lang = state.settings.selectedLanguages;
    //const genre = state.language.selectedGenre;
  
    return {
      'Language_Params': lang!==null && lang!==undefined && lang.length>0 ? `L=${lang.join(',').toLowerCase()}` : `L=hindi,bengali`,
    };
};