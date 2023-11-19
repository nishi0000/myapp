import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import noimage from "../images/noimage.png"
import db from "../firebase";
import styled from "styled-components";

export const BreadReview = () => {
    const [breadData,setBreadData] = useState<any>();
    const [reviewData,setReviewData] = useState<any>();
    const [isBreadLoading,setBreadIsLoading] = useState<boolean>(true);
    const [isReviewLoading,setReviewIsLoading] = useState<boolean>(true);
    const params = useParams();

useEffect(()=>{
    const  test = async()=> {
        const docRef = doc(db, "newbread", `${params.breadId}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setBreadData(docSnap.data());
          setBreadIsLoading(false);
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }}
        test();
},[])


useEffect(()=>{
    const postData = collection(db, "newbread",`${params.breadId}`,"review");
    getDocs(postData).then((querySnapshot) => {
      console.log(querySnapshot.docs.map((doc) => doc.data()));
      console.log(querySnapshot.docs.map((doc) => doc.id));
      setReviewData(querySnapshot.docs.map((doc) => doc.data()));
      setReviewIsLoading(false);
    });
},[])

    return(<>
<SMain>
      {isBreadLoading ? (
        <p>ロード中</p>
      ) : (
            <SBraedContainer>
            {breadData.photoUrl ? (
                  <SUsericon
                    style={{ backgroundImage: `url(${breadData.photoUrl})` }}
                  ></SUsericon>
                ) : (
                  <SUsernoneicon
                    src={noimage}
                  ></SUsernoneicon>
                )}<SStoreDetail>
                <SH3>{breadData.name}</SH3>
                <p>{breadData.store}</p>
              <SPdetail>{breadData.detail}</SPdetail>
              <p>レビュー数:{breadData.review}</p>
              <p>お気に入り数:{breadData.bookmark}</p>
              <p>価格：{breadData.price}円</p>
              <p>平均評価：{breadData.star}</p>
              </SStoreDetail>
            </SBraedContainer>
          )}
    </SMain>
    {isReviewLoading ? (<p></p>) : (reviewData.map((data:any) => {
        return (<><p>{data.title}</p>
        <p>{data.star}</p>
        <p>{data.datail}</p>
        <p>{data.username}</p>
        
        </>
        )
    }))}


    
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