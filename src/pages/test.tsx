import db from "../firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState,useEffect } from "react";


export const Test = () => {
    const [lording,setLording] = useState(true);
    const [data,setData] = useState<any>();
    const [data2,setData2] = useState<any>();

    const test = async() => {
        let testdata = await getDocs(collection(db, "newbread")).then((data) => {
            // 各商品データ取得
            console.log("１番");
            return (data.docs.map((doc) => doc.data().name));
          })
        let testdata2 = await getDocs(collection(db, "newbread")).then((data) => {
            // 各商品データ取得
            console.log("2番");
            return (data.docs.map((doc) => doc.id));
          })

          setData(testdata);
          setData2(testdata2);
      }




    useEffect(()=>{
        test();
        setLording(false);
      },[])



  return (
    <>
    {lording ? (<p>ローディング中</p>):(<p>ロード完了！{data}{data2}</p>)}

    </>
  );
};


// わかりやすいawait講義
// https://aslead.nri.co.jp/column/react-beginner-article.html