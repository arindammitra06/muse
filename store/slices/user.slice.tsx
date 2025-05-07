import { AppUser } from "@/model/user.model";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
      
    },
  extraReducers: (builder) => {
      // builder
      //   .addCase(fetchAllUsers.pending, (state) => {
      //     state.isLoading = true;
      //     state.error = null;
      //   })
      //   .addCase(fetchAllUsers.fulfilled, (state, action) => {
      //     state.isLoading = false;
      //     state.allUsers = action.payload.data;
      //   })
      //   .addCase(fetchAllUsers.rejected, (state, action) => {
      //     state.isLoading = false;
      //     state.error = action.error.message != null ? action.error.message : "";
      //   })
        
      },
});



export const userReducer = userSlice.reducer;
