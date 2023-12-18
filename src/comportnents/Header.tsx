import styled from "styled-components";
import pclogo from "../images/logo-pc.png";
import splogo from "../images/logo-sp.png";
import signin from "../images/signin.png";
import signout from "../images/signout.png";
import usericon from "../images/usericon.png";
import breadadd from "../images/breadadd.png";
import home from "../images/home.png";
import { Link, useNavigate } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ModalWindow } from "./ModalWindow";
import { useDispatch, useSelector } from "react-redux";
import {
  signIn,
  commonSignOut,
  RootState,
  adminChack,
} from "../features/AuthSlice";
import { doc, getDoc } from "firebase/firestore";
import db from "../firebase";

export const Header = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [naviText, setNaviText] = useState<string>("");
  const token = useSelector((state: RootState) => state.auth.userToken);
  const admin = useSelector((state: RootState) => state.auth.admin);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // ユーザー情報を取得、グローバルステートにセット
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
        getDoc(doc(db, "users", `${user.uid}`)).then((data: any) => {
          console.log(data.data());
          dispatch(
            adminChack({
              admin: data.data().admin,
            })
          );
        });
      }
    });
  }, [dispatch]);

  const onClickSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("ログアウト成功！");
        setModalOpen(false);
        dispatch(commonSignOut());
        Navigate(`${process.env.REACT_APP_PUBLIC_URL}/`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <SHeader>
        <div>
          <Link to={`${process.env.REACT_APP_PUBLIC_URL}/`}>
            <SLogopc src={`${pclogo}`} />
            <SLogosp src={`${splogo}`} />
          </Link>
          {token ? (
            <>
              <SIcon
                src={`${signout}`}
                onClick={() => setModalOpen(true)}
                onMouseEnter={() => {
                  setNaviText("ログアウト");
                }}
                onMouseLeave={() => {
                  setNaviText("");
                }}
              />
              <Link
                to={`${process.env.REACT_APP_PUBLIC_URL}/userprofile`}
                onMouseEnter={() => {
                  setNaviText("プロフィール");
                }}
                onMouseLeave={() => {
                  setNaviText("");
                }}
              >
                <SIcon src={`${usericon}`} />
              </Link>
            </>
          ) : (
            <Link
              to={`${process.env.REACT_APP_PUBLIC_URL}/signin`}
              onMouseEnter={() => {
                setNaviText("ログイン");
              }}
              onMouseLeave={() => {
                setNaviText("");
              }}
            >
              <SIcon src={`${signin}`} />
            </Link>
          )}
          <Link
            to={`${process.env.REACT_APP_PUBLIC_URL}/`}
            onMouseEnter={() => {
              setNaviText("ホーム");
            }}
            onMouseLeave={() => {
              setNaviText("");
            }}
          >
            <SIcon src={`${home}`} />
          </Link>
          {admin && (
            <Link
              to={`${process.env.REACT_APP_PUBLIC_URL}/newbreadpage`}
              onMouseEnter={() => {
                setNaviText("商品追加");
              }}
              onMouseLeave={() => {
                setNaviText("");
              }}
            >
              <SIcon src={`${breadadd}`} />
            </Link>
          )}
        </div>
        <div>
          <SNavitext>{naviText}</SNavitext>
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
  display: flex;
  align-items: end;
  @media screen and (max-width: 428px) {
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
  @media screen and (max-width: 428px) {
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
    height: 24px;
  }
  @media screen and (max-width: 428px) {
    display: none;
  }
`;

const SNavitext = styled.div`
  color: white;
  margin-left: 20px;
  margin-bottom: 8px;
`;
