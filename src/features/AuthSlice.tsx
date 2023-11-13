import { createSlice } from "@reduxjs/toolkit";

export interface RootState {
  auth:{
        isSignIn: boolean;
        userToken: string;
        userName: string;
      }
    };

const initialState = {
  isSignIn: false,
  userToken: "",
  userName: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action) => { 
      state.isSignIn = true;
      state.userToken = action.payload.uid;
      state.userName = action.payload.name;
    },
    commonSignOut: (state) => {
      state.isSignIn = false;
      state.userToken = "";
      state.userName = "";
    },
  },
});

export const { signIn, commonSignOut } = authSlice.actions;
