import { createSlice } from "@reduxjs/toolkit";

export interface PageState {
  page: {
    breadPage: number;
    reviewPage: number;
  };
}

const initialState = {
  breadPage: 0,
  reviewPage: 0,
};

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    breadPageNext: (state) => {
      state.breadPage += 1;
    },
    breadPageBack: (state) => {
      state.breadPage -= 1;
    },
    breadPageFirst: (state) => {
      state.breadPage = 0;
    },
    breadPageLast: (state, action) => {
      state.breadPage = action.payload.lastpage;
    },
    ReviewPageNext: (state) => {
      state.reviewPage += 1;
    },
    ReviewPageBack: (state) => {
      state.reviewPage -= 1;
    },
    ReviewPageFirst: (state) => {
      state.reviewPage = 0;
    },
    ReviewPageLast: (state, action) => {
      state.reviewPage = action.payload.lastpage;
    },
  },
});

export const {
  breadPageNext,
  breadPageBack,
  breadPageFirst,
  breadPageLast,
  ReviewPageNext,
  ReviewPageBack,
  ReviewPageFirst,
  ReviewPageLast,
} = pageSlice.actions;
