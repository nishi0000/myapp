import { useState } from "react";
import styled from "styled-components";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <SButton onClick={toggleMenu}>
        {isOpen ? <p>ひらく</p> : <p>とじる</p>}
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
