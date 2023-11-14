import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import Button from "../comportnents/Button";
import { Link } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [image, setImage] = useState<any>("");

  const auth = getAuth();

  const onClickSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        updateProfile(user, {
          displayName: userName,
        });
    
            const storageRef = ref(storage, `images/${image.name}`);
            uploadBytes(storageRef, image).then(() => {
              getDownloadURL(storageRef).then((url) => {
                updateProfile(user, {
                  photoURL : url,
                });
              })
            });

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  const storage = getStorage();

  const handleChange = (e: any) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    console.log(image);
    try {
      const storageRef = ref(storage, `images/${image.name}`);
      uploadBytes(storageRef, image).then(() => {
        getDownloadURL(storageRef).then((url) => {
          console.log(url);
        });
      });
    } catch (err) {
      console.log(err);
    }


  }

  return (
    <>
      <h2>SignIn</h2>
      <label>名前</label>
      <br />
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <br />
      <label>メールアドレス</label>
      <br />
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <label>パスワード</label>
      <br />
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <label>アイコン画像</label>
      <br />
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleChange} />
        <button className="button">アップロード</button>
      </form>
      <br />
      <Button onClick={onClickSignUp}>登録</Button>
      <br />
      <Link to="/signin">アカウントをお持ちの方はこちら</Link>
    </>
  );
};
