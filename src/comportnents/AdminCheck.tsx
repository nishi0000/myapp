import { useNavigate } from "react-router-dom";
import { RootState } from "../features/AuthSlice";
import { useSelector } from "react-redux";


export const AdminCheck = () => {
    const admin = useSelector((state: RootState) => state.auth.admin);
    const Navigate = useNavigate();

    if(!admin) {
        Navigate("/");
    }

}