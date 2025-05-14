import { AppUser } from "@/model/user.model";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";

  export type UserState = {
    readonly currentUser: AppUser | null;
    readonly isLoading: boolean;
    readonly error: string | null;
  };

  export const USER_INITIAL_STATE : UserState = {
    currentUser: null,
    isLoading: false,
    error: null,
  };
    

  // export const fetchAllUsers = createAsyncThunk(
  //   "user/fetchAllUsers", 
  //   async ({ campusId }: { campusId: number }) => {
  //     try {
  //       const response = await axios.get(
  //         baseUrl+`user/fetchAllUsers/${campusId}`
  //       );
  //       return response.data;
  //     } catch (error) {
  //       console.error(error);
  //     }
  // });

const userSlice = createSlice({
  name: "user",
  initialState: USER_INITIAL_STATE,
  reducers: {
    setCurrentUser(state, action: PayloadAction<AppUser|null>) {
      state.currentUser = action.payload;
    },
    logoutSlice(state) {
      state.currentUser = null;
    },
    },
});


export const { setCurrentUser, logoutSlice } = userSlice.actions;
export const userReducer = userSlice.reducer;
