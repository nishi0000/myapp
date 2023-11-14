import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Button from "../comportnents/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const Navigate = useNavigate();

  const onClickSignIn = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setEmail("");
        setPassword("");
        Navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        console.log(errorCode);
      });
  };

  const onClickSignUp = () => {
    Navigate("/signup")
  }

  return (
    <>
      <SMain>
        <SContainer>
          <SH2>ログイン</SH2>
        </SContainer>
        <form>
          <SLabel>メールアドレス</SLabel>
          <SInput
            placeholder="メールアドレス"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <SLabel>パスワード</SLabel>
          <SInput
            placeholder="パスワード"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <SContainer>
          <p>パスワードをお忘れですか？</p>
            <Button onClick={onClickSignIn}>ログイン</Button>
            <br />
            <Button onClick={onClickSignUp}>新規登録</Button>
          </SContainer>
        </form>
      </SMain>
    </>
  );
};


const SMain = styled.main`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 300px;
  margin: 64px auto;
  padding: 16px;
  border: 1px solid gray;
  border-radius: 16px;
  box-shadow: 6px 6px 10px 0px rgba(0, 0, 0, 0.24);
`;

const SH2 = styled.h2`
  font-weight: normal;
  font-size: 20px;
  margin: 0;
`;

const SContainer = styled.div`
  text-align: center;
`;

const SInput = styled.input`
  max-width: 300px;
  width: 90%;
  margin-top:8px;
  border: 1px solid gray;
  border-radius: 8px;
  padding:6px;
  height:20px;
  font-size: large;
`;

const SLabel = styled.label`
display: block;
margin-top:16px;
`;

