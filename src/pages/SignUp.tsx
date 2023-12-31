import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { FC, useState } from "react";
import Button from "../comportnents/Button";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import eyeopen from "../images/eyeopen.png";
import eyeclose from "../images/eyeclose.png";
import { doc, setDoc } from "firebase/firestore";
import db from "../firebase";

type SignUpFormData = {
  username: string;
  email: string;
  password: string;
}

export const SignUp: FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();
  const Navigate = useNavigate();

  const auth = getAuth();

  const onSubmit:SubmitHandler<SignUpFormData> = (data) => {
    console.log(data);
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        updateProfile(user, {
          displayName: data.username,
        })
        setDoc(doc(db, "users", `${user.uid}`), {
          userid:`${user.uid}`,
          username:data.username,
          reviews:[],
          admin:false,
        })

      Navigate(`/${process.env.REACT_APP_PUBLIC_URL}`);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
      });
  }

  
  return (
    <>
      <SMain>
        <SContainer>
          <SH2>新規登録</SH2>
        </SContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
        <SLabel htmlFor="username">名前</SLabel>
        <SInputcontainer>
          <SInput
            placeholder="ユーザーネーム"
            type="text"
            id="username"
            {...register("username", {
              required: {
                value: true,
                message: "入力が必須の項目です。",
              },
            })}
          />
        </SInputcontainer>
        {errors.username?.message && (
            <SErrorMessage>{String(errors.username?.message)}</SErrorMessage>
          )}
        <SLabel htmlFor="email">メールアドレス</SLabel>
        <SInputcontainer>
          <SInput
            placeholder="メールアドレス"
            type="text"
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
        <SLabel htmlFor="password">パスワード</SLabel>
        <SInputcontainer>
          <SInput
            placeholder="パスワード"
            id="password"
            autoComplete="off"
            type={isPasswordVisible ? "text" : "password"}
            {...register("password", {
              required: {
                value: true,
                message: "入力が必須の項目です。",
              },
              minLength: {
                value: 6,
                message: '6文字以上入力してください。'
              }
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
        <br />
        <SContainer>
        {errorMessage && (
              <SErrorMessage>
                ログインに失敗しました。
                <br />
                {errorMessage}
              </SErrorMessage>
            )}
          <Button type="submit">
            登録
          </Button>
          <br />
          <br />
          <Link to={`/${process.env.REACT_APP_PUBLIC_URL}/signin`}>アカウントをお持ちの方はこちら</Link>
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

const SInputcontainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid gray;
  border-radius: 8px;
  padding: 8px;
`;

const SLabel = styled.label`
  display: block;
  margin-top: 16px;
`;

const SEyeicon = styled.img`
  height: 20px;
  margin-top: 2px;
  margin-right: 5px;
  &:hover {
    opacity: 0.7;
  }
`;

const SErrorMessage = styled.div`
  font-size: 14px;
  color: red;
`;