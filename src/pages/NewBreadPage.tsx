import db from "../firebase";
import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";

export const NewBreadPage = () => {

  // const onClickNewBread = () => {
  //   addDoc(collection(db, "newbread"), {
  //     name: "創業乃が美（レギュラー（2斤））",
  //     store: "高級「生」食パン専門店の乃が美（のがみ）",
  //     bookmark: 0,
  //     photoUrl: "https://firebasestorage.googleapis.com/v0/b/react-app-baaae.appspot.com/o/images%2FAdobeStock_276274510.jpeg?alt=media&token=7da03f17-9edf-4d75-b6e3-73aa4a7841b6",
  //     star: 0,
  //     review:0,
  //     price:500,
  //     detail:"「あの頃の味が恋しい」というみなさまの声にお応えして、ここに発祥時の配合「黄金比率」を復刻しました。",
  //   });
  // };


  const onClickNewBread = () => {

  addDoc(collection(db, 'newbread', "LI2JNjqWUruB76Ub0r2K","review"),{
  username: "Los Angeles",
  uid: "aaaa",
  title:"ちょうおいしかったです。",
  star:5,
  datail: "すごくおいしかったです。すごくおいしかったです。すごくおいしかったです。すごくおいしかったです。すごくおいしかったです。すごくおいしかったです。すごくおいしかったです。すごくおいしかったです。",
  timestamp:  serverTimestamp(),
})


}
  return (
    <>
      <p>NewBreadPageだよー</p>
      <button onClick={onClickNewBread}>テスト</button>
    </>
  );
};
