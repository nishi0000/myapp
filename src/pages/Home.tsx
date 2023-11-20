import db from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import noimage from "../images/noimage.png"
import styled from "styled-components";
import { Link } from "react-router-dom";

export const Home = () => {
    const [breadData, setBreadData] = useState<any>([]);
    const [breadId,setBreadId] =useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    

    useEffect(()=>{
        const postData = collection(db, "newbread");
        getDocs(postData).then((querySnapshot) => {
          console.log(querySnapshot.docs.map((doc) => doc.data()));
          console.log(querySnapshot.docs.map((doc) => doc.id));
          setBreadId(querySnapshot.docs.map((doc) => doc.id));
          setBreadData(querySnapshot.docs.map((doc) => doc.data()));
          setIsLoading(false);
        });
    },[])


    return(<>
    <SMain>
      <h2>Bread Review</h2>
      <p>ランキング/口コミが多い順</p>
      {isLoading ? (
        <p>ロード中</p>
      ) : (
        breadData.map((data:any, index:number) => {
          return (
            <SBraedContainer key={index}>
            {data.photoUrl ? (
                  <SUsericon
                    style={{ backgroundImage: `url(${data.photoUrl})` }}
                  ></SUsericon>
                ) : (
                  <SUsernoneicon
                    src={noimage}
                  ></SUsernoneicon>
                )}<SStoreDetail>
                  <Link
                to={`/${breadId[index]}`}
              >{data.name}</Link>
                <SH3>{data.name}</SH3>
                <p>{data.store}</p>
              <SPdetail>{data.detail}</SPdetail>
              <p>レビュー数:{data.review}</p>
              <p>お気に入り数:{data.bookmark}</p>
              <p>価格：{data.price}円</p>
              <p>平均評価：{data.star}</p>
              </SStoreDetail>
            </SBraedContainer>
          );
        })
      )}
    </SMain>
    </>
    )
}


const SMain = styled.main`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 8px auto;
`;

const SBraedContainer = styled.div`
  display: flex;
  margin-top:24px;
  // background-color:gray;
`;

const SStoreDetail = styled.div`
min-height: 256px;
width:60%;
margin-left:8px;
`;

const SUsericon = styled.div`
  max-height: 256px;
  width: 256px;
  background-repeat: no-repeat;
  background-position: center;
`;


const SUsernoneicon = styled.img`
  height: 256px;
  width: 256px;
  background-repeat: no-repeat;
  background-position: center;
`;

const SPdetail = styled.p`
font-size: 12px;
color:gray;
`;

const SH3 = styled.h3`
font-size: 18px;
`;