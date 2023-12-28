import { useState } from "react";
import menu from "../images/menu.png";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, commonSignOut } from "../features/AuthSlice";
import { ModalWindow } from "./ModalWindow";
import { getAuth, signOut } from "firebase/auth";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const auth = getAuth();
  const uid = useSelector((state: RootState) => state.auth.userToken);
  const admin = useSelector((state: RootState) => state.auth.admin);

  const onClickSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("ログアウト成功！");
        setModalOpen(false);
        dispatch(commonSignOut());
        Navigate(`/${process.env.REACT_APP_PUBLIC_URL}`);
        setIsOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div>
        <SButton onClick={() => setIsOpen(!isOpen)}>
          <SImg src={`${menu}`} />
        </SButton>
        {isOpen ? (
          <SNavi>
            <SUl>
              <SLink
                to={`/${process.env.REACT_APP_PUBLIC_URL}`}
                onClick={() => setIsOpen(false)}
              >
                <Sli>ホーム</Sli>
              </SLink>
              {uid && (
                <>
                  <SLink
                    to={`/${process.env.REACT_APP_PUBLIC_URL}/userprofile`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Sli>プロフィール</Sli>
                  </SLink>
                  <SOnbutton onClick={() => setModalOpen(true)}>
                    <Sli>ログアウト</Sli>
                  </SOnbutton>
                </>
              )}

              {!uid && (
                <>
                  <SLink
                    to={`/${process.env.REACT_APP_PUBLIC_URL}/signin`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Sli>ログイン</Sli>
                  </SLink>
                  <SLink
                    to={`/${process.env.REACT_APP_PUBLIC_URL}/signup`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Sli>新規登録</Sli>
                  </SLink>
                </>
              )}
              {admin && (
                <SLink
                  to={`/${process.env.REACT_APP_PUBLIC_URL}/newbreadpage`}
                  onClick={() => setIsOpen(false)}
                >
                  <Sli>商品登録</Sli>
                </SLink>
              )}
            </SUl>
          </SNavi>
        ) : (
          <></>
        )}
      </div>

      {modalOpen && (
        <ModalWindow
          onClickYes={onClickSignOut}
          onClickNo={() => {
            setModalOpen(false);
            setIsOpen(false);
          }}
        >
          ログアウトしますか？
        </ModalWindow>
      )}
    </>
  );
};

export default HamburgerMenu;

const SButton = styled.button`
background: none;
border: none;
cursor: pointer;
outline: none;
  }
`;

const SNavi = styled.nav`
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  -ms-overflow-style: none;
  padding: 1rem;
  position: absolute;
  margin-top: 70px;
  top: 0;
  right: 0;
  width: 150px;
  z-index: 3;
  overflow: hidden;
  height: -webkit-fill-available;
  @media screen and (max-width: 428px) {
    margin-top: 50px;
  }
`;

const SUl = styled.ul`
list-style: none;
padding: 0;
  }
`;

const Sli = styled.li`
color: #333;
margin: 1rem 0;
font-size: 18px;
text-align: left;
  }
`;

const SImg = styled.img`
  display: none;
  @media screen and (max-width: 428px) {
    height: 30px;
    display: inline;
    margin-right: 8px;
    z-index: 12;
  }
`;

const SOverlay = styled.div`
  /*　画面全体を覆う設定　*/
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const SLink = styled(Link)`
  color: black;
  text-decoration: none;
  font-size: 20px;
  display: block;
  margin-bottom: 8px;
  @media screen and (max-width: 428px) {
    font-size: 18px;
    margin-top: 12px;
  }
`;

const SOnbutton = styled.div`
  cursor: pointer;
`;
