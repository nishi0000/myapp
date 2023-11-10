import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Button from "../comportnents/Button";
import { useState } from "react";
import { Link } from "react-router-dom";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onClickSignIn = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <>
      <p>Signinだよー</p>
      <label>メールアドレス</label>
      <br />
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <label>パスワード</label>
      <br />
      <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <Button onClick={onClickSignIn}>登録</Button>
      <br />
      <p>アカウントをお持ちではありませんか？</p><Link to="/signup">会員登録</Link>
    </>
  );
};
