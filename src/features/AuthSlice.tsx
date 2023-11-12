import { createSlice } from "@reduxjs/toolkit";


const initialState= {
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
