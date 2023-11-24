import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAOuhwfBYlbrhKqsjJjBE7KxqhLSLRaHpU",
    authDomain: "react-app-baaae.firebaseapp.com",
    projectId: "react-app-baaae",
    storageBucket: "react-app-baaae.appspot.com",
    messagingSenderId: "891080484147",
    appId: "1:891080484147:web:63e758b2ae12f2ef328a46"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export default db;