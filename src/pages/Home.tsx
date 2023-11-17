import db from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

type BreadDataType = {
    bookmark:number;
    detail: string;
    name:string; 
    photoUrl:string; 
    price:number;
    review:number;
    star:number; 
    store:string; 
};

export const Home = () => {
    const [breadData, setBreadData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        const postData = collection(db, "newbread");
        getDocs(postData).then((querySnapshot) => {
          console.log(querySnapshot.docs.map((doc) => doc.data()));
          console.log(querySnapshot.docs.map((doc) => doc.id));
          setBreadData(querySnapshot.docs.map((doc) => doc.data()));
          setIsLoading(false);
        });
    },[])





    return(<>
    <main>
      <h2>Bread Review</h2>
      {isLoading ? (
        <p>ロード中</p>
      ) : (
        breadData.map((data:any, index:number) => {
          return (
            <div key={index}>
                <h3>商品名：{data.name}</h3>
                <p>{data.store}</p>
              <p>{data.detail}</p>
              <p>レビュー数:{data.review}</p>
              <p>お気に入り数:{data.bookmark}</p>
              <p>価格：{data.price}円</p>
              <p>平均評価：{data.star}</p>
              <img src={`${data.photoUrl}`}></img>
            </div>
          );
        })
      )}
    </main>
    </>

    )
}