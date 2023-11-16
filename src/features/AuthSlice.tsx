import { createSlice } from "@reduxjs/toolkit";

export interface RootState {
  auth:{
        isSignIn: boolean;
        userToken: string;
        userName: string;
        userEmail:string;
        userIcon?:string|null;
        storagePath?:string;
      }
    };

const initialState = {
  isSignIn: false,
  userToken: "",
  userEmail: "",
  userName: "",
  userIcon: "",
  storagePath:"",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action) => { 
      state.isSignIn = true;
      state.userToken = action.payload.uid;
      state.userName = action.payload.name;
      state.userEmail = action.payload.email;
      state.userIcon = action.payload.usericon;
    },
    commonSignOut: (state) => {
      state.isSignIn = false;
      state.userToken = "";
      state.userName = "";
      state.userEmail = "";
      state.userIcon = "";
    },
    iconUpload:(state,action)=>{
      state.userIcon = action.payload.usericon;
    },
    iconPathGet:(state,action)=>{
      state.storagePath = action.payload.iconpath;
    }
  },
});

export const { signIn, commonSignOut,iconUpload,iconPathGet } = authSlice.actions;
