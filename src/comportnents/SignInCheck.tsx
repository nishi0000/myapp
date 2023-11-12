import {
    getAuth,
    onAuthStateChanged,
  } from "firebase/auth";

export const SignInCheck = () => {

    const auth = getAuth();
    onAuthStateChanged(auth, (user:any) => {
        if (user) {
          const uid = user.uid;
          console.log(uid);
          return uid;
        }
      });
}

