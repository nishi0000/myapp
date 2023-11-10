import { FC } from "react";
import styled from "styled-components";

type ButtonProps = {
    children: string;
    onClick: () => void;
};

export const Button: FC<ButtonProps> = ({ children, onClick }) => {
    return (
        <SButton onClick={onClick}>{children}</SButton>
    );
};

const SButton = styled.button`
    background-color: #330000;
    color: white;
    padding: 8px 24px;
    border-radius: 8px;
    border: none;
    transition: 0.1s;
    margin: 8px 8px;
    &:hover {
        opacity: 0.8;
        transform: translate3d(1px, 5px, 0);
    }
`;

export default Button;