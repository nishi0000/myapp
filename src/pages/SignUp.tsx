import { createUserWithEmailAndPassword, getAuth,updateProfile } from "firebase/auth";
import { useState } from "react";
import Button from "../comportnents/Button";
import { Link } from "react-router-dom";

export const SignUp = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [userName,setUserName] = useState<string>("");

    const auth = getAuth();

    const onClickSignUp = () => {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          updateProfile(user, {
            displayName: userName,
        });
    })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
        });
    }

    return(
    <>
      <p>SignUpだよー</p>
      <label>名前</label>
      <br />
      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
      <br />
      <label>メールアドレス</label>
      <br />
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <label>パスワード</label>
      <br />
      <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <Button onClick={onClickSignUp}>登録</Button>
      <br />
      <Link to="/signin">アカウントをお持ちの方はこちら</Link>
    </>

    )
}