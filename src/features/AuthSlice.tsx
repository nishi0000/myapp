import { createSlice } from "@reduxjs/toolkit";

export type RootState = {
  auth:{
        isSignIn: boolean;
        userToken: string;
        userName: string;
        userEmail:string;
        userIcon?:string|null;
        storagePath?:string;
        admin:boolean;
      }
    };

const initialState = {
  isSignIn: false,
  userToken: "",
  userEmail: "",
  userName: "",
  userIcon: "",
  storagePath:"",
  admin:false,
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
      state.admin = false;
    },
    iconUpload:(state,action)=>{
      state.userIcon = action.payload.usericon;
    },
    nameUpDate:(state,action)=>{
      state.userName = action.payload.name;
    },
    adminChack:(state,action)=>{
      state.admin = action.payload.admin;
    },

  },
});

export const { signIn, commonSignOut,iconUpload,nameUpDate,adminChack } = authSlice.actions;
