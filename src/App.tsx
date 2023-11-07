import "./App.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import db from "./firebase";

function App() {
  const postData = collection(db, "posts");
  getDocs(postData).then((querySnapshot) => {
    console.log(querySnapshot.docs.map((doc) => doc.data()));
    console.log(querySnapshot.docs.map((doc) => doc.id));
  });

  const onClickSubmit = () => {
    addDoc(collection(db, "posts","post"), {
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

  return (
    <>
      <h1>Hello,World!</h1>
      <button onClick={onClickSubmit}>送信</button>
      <button onClick={onClickDelete}>削除</button>
      <button onClick={onClickUpdate}>更新</button>
    </>
  );
}

export default App;
