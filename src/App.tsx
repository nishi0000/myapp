import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import db from "./firebase";
import { Router } from "./routes/Router";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import { SignInCheck } from "./comportnents/SignInCheck";

function App() {

  const [userId,setUserId] = useState<string>("");

  const postData = collection(db, "posts");
  getDocs(postData).then((querySnapshot) => {
    console.log(querySnapshot.docs.map((doc) => doc.data()));
    console.log(querySnapshot.docs.map((doc) => doc.id));
  });

  const onClickSubmit = () => {
    addDoc(collection(db, "posts", "post"), {
      name: "nishiii",
      id: "aaaaa",
      massage: "やっふー",
    });
  };

  const onClickDelete = () => {
    deleteDoc(doc(db, "posts", "jOqKHKg2mGTnc1u4lp6W"));
  };

  const onClickUpdate = () => {
    updateDoc(doc(db, "posts", "cqRIFmVusHdSnboyFiFl"), {
      name: "nishiii",
      id: "aaaaa",
      massage: "やっぴー",
    });
  };

  const auth = getAuth();

  const onClickSignUp = () => {
    createUserWithEmailAndPassword(auth, "email@gmail.com", "password")
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const onClickSignIn = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, "email@gmail.com", "password")
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUserId(`${user}`);
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const onClickSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log("ログアウト成功！");
      setUserId("");
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
  }

  SignInCheck();


  return (
    <>
      <h1>Hello,World!</h1>
      <button onClick={onClickSubmit}>送信</button>
      <button onClick={onClickDelete}>削除</button>
      <button onClick={onClickUpdate}>更新</button>
      <button onClick={onClickSignUp}>登録</button>
      <button onClick={onClickSignIn}>ログイン</button>
      <button onClick={onClickSignOut}>ログアウト</button><br />
      {userId ? (<p>ログインしています。</p>):(<p>ログインしていません。</p>)}
      <Router />
    </>
  );
}

export default App;
