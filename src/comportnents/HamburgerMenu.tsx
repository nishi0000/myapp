import { useState } from "react";
import menu from "../images/menu.png";
import styled from "styled-components";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (<>
    <div>
      <SButton onClick={() => setIsOpen(!isOpen)}>
        <SImg src={`${menu}`} />
      </SButton>
      {isOpen ? ( 
        <SNavi>
            <SUl>
              <Sli>ホーム</Sli>
              <Sli>サービス</Sli>
              <Sli>ポートフォリオ</Sli>
              <Sli>お問い合わせ</Sli>
            </SUl>
        </SNavi>
      ) : (
        <></>
      )}
    </div>
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
margin-top:70px;
top: 0;
right: 0;
width: 250px;
z-index: 9;
overflow: hidden;
height: -webkit-fill-available;
@media screen and (max-width: 428px) {
  margin-top:50px;
  }
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
