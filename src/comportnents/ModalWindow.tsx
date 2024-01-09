import { FC } from "react";
import { Button } from "./Button";
import styled from "styled-components";

type ModalProps = {
    children: String;
    onClickYes:() => void;
    onClickNo:() => void;
  }

export const ModalWindow: FC<ModalProps>  = ({children,onClickYes,onClickNo}) => {

    return (
        <SModaloverlay>
        <SModalcontainer>
          <p>{children}</p>
          <Button type="button" onClick={onClickYes}>はい</Button><Button type="button" onClick={onClickNo}>いいえ</Button>
        </SModalcontainer>
      </SModaloverlay>

    );

}

const SModaloverlay = styled.div`
/*　画面全体を覆う設定　*/
position: fixed;
z-index: 3;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);

/*　画面の中央に要素を表示させる設定　*/
display: flex;
align-items: center;
justify-content: center;
`;

const SModalcontainer = styled.div`
z-index: 5;
width: 50%;
border-radius: 8px;
max-width: 300px;
padding: 1em;
background: #fff;
color: black;
text-align: center;
@media screen and (max-width: 428px) {
  font-size:14px;
  }
`;
