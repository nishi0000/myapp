import { createSlice } from "@reduxjs/toolkit";

export interface PageState {
  page: {
    page:number;
  };
}

const initialState = {
  page:0,
};

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    pageNext: (state) => {
      state.page += 1;
    },
    pageBack: (state) => {
      state.page -= 1;
    },
    pageFirst: (state) => {
      state.page = 0;
    },
    pageLast: (state, action) => {
      state.page = action.payload.lastpage;
    },
  },
});

export const {
  pageNext,
  pageBack,
  pageFirst,
  pageLast,
} = pageSlice.actions;
