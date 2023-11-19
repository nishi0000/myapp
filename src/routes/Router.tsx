import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { SignIn } from "../pages/SignIn";
import { SignUp } from "../pages/SignUp";
import { NewBreadPage } from "../pages/NewBreadPage";
import { EditBreadReview } from "../pages/EditBreadReview";
import { BreadReview } from "../pages/BreadReview";
import { NotFound } from "../pages/NotFound";
import { UserProfile } from "../pages/UserProfile";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/newbreadpage" element={<NewBreadPage />} />
      <Route path="/editbreadreview" element={<EditBreadReview />} />      
      <Route path=":breadId" element={<BreadReview />} />
      <Route path="/userprofile" element={<UserProfile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
