import { createSlice, PayloadAction } from "@reduxjs/toolkit";



export type SearchParamsState = {
    readonly queryString: string ;
    searchedStrings: string[];
    readonly isLoading: boolean;
    readonly error: string | null;
};

export const SEARCH_PARAMS_INITIAL_STATE: SearchParamsState = {
    queryString: '',
    isLoading: false,
    error: null,
    searchedStrings: [],
};


const searchParamsSlice = createSlice({
    name: "search-params",
    initialState: SEARCH_PARAMS_INITIAL_STATE,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.queryString = action.payload
        },
        clearSearchQuery: (state) => {
            state.queryString = ''
        },
        addSearchedString: (state, action: PayloadAction<string>) => {
            const str = action.payload;
            if (!state.searchedStrings.includes(str)) {
                state.searchedStrings.push(str);
            }
        },
        removeSearchedString: (state, action: PayloadAction<string>) => {
            const str = action.payload;
            state.searchedStrings = state.searchedStrings.filter(s => s !== str);
        },
    },
    extraReducers: (builder) => {
    },
});


export const {setSearchQuery, clearSearchQuery, addSearchedString, removeSearchedString } = searchParamsSlice.actions;
export const searchParamsReducer = searchParamsSlice.reducer;
