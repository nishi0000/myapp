import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { SignIn } from "../pages/SignIn";
import { SignUp } from "../pages/SignUp";
import { NewBreadPage } from "../pages/NewBreadPage";
import { EditBreadPage } from "../pages/EditBreadPage";
import { BreadReview } from "../pages/BreadReview";
import { NotFound } from "../pages/NotFound";
import { UserProfile } from "../pages/UserProfile";
import { NewBreadReview } from "../pages/NewBreadReview";
import { UserReviewList } from "../pages/UserReviewList";
import { EditBreadReview } from "../pages/EditBreadReview";

export const Router = () => {
  return (
    <Routes>
      <Route path={`${process.env.REACT_APP_PUBLIC_URL}/`} element={<Home />} />
      <Route path={`${process.env.REACT_APP_PUBLIC_URL}/`} element={<Home />} />
      <Route path={`${process.env.REACT_APP_PUBLIC_URL}/signin`} element={<SignIn />} />
      <Route path={`${process.env.REACT_APP_PUBLIC_URL}/signup`} element={<SignUp />} />
      <Route path={`${process.env.REACT_APP_PUBLIC_URL}/newbreadpage`} element={<NewBreadPage />} />
      <Route path={`${process.env.REACT_APP_PUBLIC_URL}/:breadId/editbreadpage`} element={<EditBreadPage />} />
      <Route path={`${process.env.REACT_APP_PUBLIC_URL}/:breadId/newbreadreview`} element={<NewBreadReview />} />
      <Route path={`${process.env.REACT_APP_PUBLIC_URL}/:breadId/:reviewId/editbreadreview`} element={<EditBreadReview />} />
      <Route path={`${process.env.REACT_APP_PUBLIC_URL}/:breadId`} element={<BreadReview />} />
      <Route path={`${process.env.REACT_APP_PUBLIC_URL}/users/:userId`} element={<UserReviewList />} />
      <Route path={`${process.env.REACT_APP_PUBLIC_URL}/userprofile`} element={<UserProfile />} />
      <Route path={`${process.env.REACT_APP_PUBLIC_URL}/*`} element={<NotFound />} />
    </Routes>
  );
};
