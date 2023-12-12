import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Button from "../comportnents/Button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import styled from "styled-components";
import eyeopen from "../images/eyeopen.png";
import eyeclose from "../images/eyeclose.png";

export const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const Navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onSubmit = (data: any) => {
    console.log(data);

    const auth = getAuth();
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        Navigate(`${process.env.PUBLIC_URL}/`);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        setErrorMessage(errorMessage);
      });
  };

  const onClickSignUp = () => {
    Navigate(`${process.env.PUBLIC_URL}/signup`);
  };

  return (
    <>
      <SMain>
        <SContainer>
          <SH2>ログイン</SH2>
        </SContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SLabel htmlFor="email">メールアドレス</SLabel>
          <SInputcontainer>
            <SInput
              placeholder="メールアドレス"
              id="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "入力が必須の項目です。",
                },
                pattern: {
                  value: /^[\w\-._]+@[\w\-._]+\.[A-Za-z]+/,
                  message: "入力形式がメールアドレスではありません。",
                },
              })}
            />
          </SInputcontainer>
          {errors.email?.message && (
            <SErrorMessage>{String(errors.email?.message)}</SErrorMessage>
          )}
          <SLabel>パスワード</SLabel>
          <SInputcontainer>
            <SInput
              placeholder="パスワード"
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              autoComplete="off"
              {...register("password", {
                required: {
                  value: true,
                  message: "入力が必須の項目です。",
                },
              })}
            />
            {isPasswordVisible ? (
              <SEyeicon
                src={`${eyeclose}`}
                onClick={() => setIsPasswordVisible(false)}
              />
            ) : (
              <SEyeicon
                src={`${eyeopen}`}
                onClick={() => setIsPasswordVisible(true)}
              />
            )}
          </SInputcontainer>
          {errors.password?.message && (
            <SErrorMessage>{String(errors.password?.message)}</SErrorMessage>
          )}
          <SContainer>
            {errorMessage && (
              <SErrorMessage>
                ログインに失敗しました。
                <br />
                {errorMessage}
              </SErrorMessage>
            )}
            <br />
            <Button type="submit">ログイン</Button>
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
  @media screen and (max-width: 428px) {
    border: none;
    box-shadow: none;
  }
`;

const SH2 = styled.h2`
  font-weight: normal;
  font-size: 20px;
`;

const SContainer = styled.div`
  text-align: center;
`;

const SInput = styled.input`
  max-width: 300px;
  width: 90%;
  border: none;
  height: 20px;
  font-size: large;
  &:focus {
    outline: none;
  }
`;

const SLabel = styled.label`
  display: block;
  margin-top: 16px;
`;

const SErrorMessage = styled.div`
  font-size: 14px;
  color: red;
`;

const SInputcontainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid gray;
  border-radius: 8px;
  padding: 8px;
`;

const SEyeicon = styled.img`
  height: 20px;
  margin-top: 2px;
  margin-right: 5px;
  &:hover {
    opacity: 0.7;
  }
`;
