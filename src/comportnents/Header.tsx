import styled from "styled-components";
import pclogo from "../images/logo-pc.png";
import splogo from "../images/logo-sp.png";
import signin from "../images/signin.png";
import signout from "../images/signout.png";
import usericon from "../images/usericon.png";
import { Link, useNavigate } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ModalWindow } from "./ModalWindow";
import { useDispatch, useSelector } from "react-redux";
import { signIn, commonSignOut, RootState } from "../features/AuthSlice";

export const Header = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.auth.userToken);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {// ユーザー情報を取得、グローバルステートにセット
    const auth = getAuth();
    onAuthStateChanged(auth, (user: any) => {
      if (user) {
        console.log(user);
        dispatch(
          signIn({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            usericon: user.photoURL,
          })
        );
      }
    });
  }, [dispatch]);

  const onClickSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("ログアウト成功！");
        setModalOpen(false);
        dispatch(commonSignOut());
        Navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <SHeader>
        <div>
          <Link to="/">
            <SLogopc src={`${pclogo}`} />
            <SLogosp src={`${splogo}`} />
          </Link>
          {token ? (
            <>
              <SIcon src={`${signout}`} onClick={() => setModalOpen(true)} />
              <Link to="/userprofile">
                <SIcon src={`${usericon}`} />
              </Link>
            </>
          ) : (
            <Link to="/signin">
              <SIcon src={`${signin}`} />
            </Link>
          )}
        </div>
        <HamburgerMenu />
      </SHeader>

      {modalOpen && (
        <ModalWindow
          onClickYes={onClickSignOut}
          onClickNo={() => setModalOpen(false)}
        >
          ログアウトしますか？
        </ModalWindow>
      )}
    </>
  );
};

const SHeader = styled.header`
  background-color: #330000;
  height: 70px;
  @media screen and (max-width: 375px) {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const SLogopc = styled.img`
  height: 70px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const SLogosp = styled.img`
  display: none;
  @media screen and (max-width: 768px) {
    height: 70px;
    display: inline;
  }
  @media screen and (max-width: 375px) {
    height: 50px;
    display: inline;
  }
`;

const SIcon = styled.img`
  height: 32px;
  margin-left: 16px;
  margin-bottom: 5px;
  transition: 0.1s;
  &:hover {
    transform: translate3d(1px, 1px, 0);
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
