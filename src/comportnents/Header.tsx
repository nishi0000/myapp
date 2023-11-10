import styled from "styled-components";
import pclogo from "../images/logo-pc.png";
import splogo from "../images/logo-sp.png";
import { Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";

export const Header = () => {
  
  return (<>
    <SHeader>
      <Link to="/">
        <SLogopc src={`${pclogo}`} />
        <SLogosp src={`${splogo}`} />
      </Link>
      <HamburgerMenu />
    </SHeader>

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


