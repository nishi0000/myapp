import { useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import noimage from "../images/noimage.png";
import db from "../firebase";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "features/AuthSlice";

export const BreadReview = () => {
  const [breadData, setBreadData] = useState<any>();
  const [reviewData, setReviewData] = useState<any>();
  const [isBreadLoading, setBreadIsLoading] = useState<boolean>(true);
  const [isReviewLoading, setReviewIsLoading] = useState<boolean>(true);
  const [reviewTitle, setReviewTitle] = useState<string>();
  const [reviewDetail, setReviewDetail] = useState<string>();
  const [star, setStar] = useState<any>();
  const useId = useSelector((state: RootState) => state.auth.userToken);
  const useName = useSelector((state: RootState) => state.auth.userName);
  const params = useParams();

  useEffect(() => {
    const test = async () => {
      const docRef = doc(db, "newbread", `${params.breadId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setBreadData(docSnap.data());
        setBreadIsLoading(false);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    test();
  }, []);

  const onClickNewBread = () => {
    addDoc(collection(db, "newbread", `${params.breadId}`, "review"), {
      username: `${useName}`,
      uid: `${useId}`,
      title: `${reviewTitle}`,
      star: `${star}`,
      datail: `${reviewDetail}`,
      timestamp: serverTimestamp(),
    }).then(()=>{setReviewTitle("");
    setReviewDetail("");
    setStar("");
    });
  };

  useEffect(() => {
    const postData = collection(db, "newbread", `${params.breadId}`, "review");
    getDocs(postData).then((querySnapshot) => {
      console.log(querySnapshot.docs.map((doc) => doc.data()));
      console.log(querySnapshot.docs.map((doc) => doc.id));
      setReviewData(querySnapshot.docs.map((doc) => doc.data()));
      setReviewIsLoading(false);
    });
  }, []);

  return (
    <>
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
              <SUsernoneicon src={noimage}></SUsernoneicon>
            )}
            <SStoreDetail>
              <SH2>{breadData.name}</SH2>
              <p>{breadData.store}</p>
              <SPdetail>{breadData.detail}</SPdetail>
              <p>レビュー数:{breadData.review}</p>
              <p>お気に入り数:{breadData.bookmark}</p>
              <p>価格：{breadData.price}円</p>
              <p>平均評価：{breadData.star}</p>
            </SStoreDetail>
          </SBraedContainer>
        )}

        {isReviewLoading ? (
          <p></p>
        ) : (
          reviewData.map((data: any) => {
            const timestamp = new Date(data.timestamp.seconds * 1000);
            return (
              <>
                <SReviewContainer>
                  <SStar>★★★★☆</SStar>
                  <SH3>{data.title}</SH3>
                  <p>
                    {timestamp.getFullYear()}年{timestamp.getMonth() + 1}月
                    {timestamp.getDate()}日
                  </p>

                  <p>{data.datail}</p>
                  <SUsername>{data.username}</SUsername>
                </SReviewContainer>
              </>
            );
          })
        )}
      </SMain>

      <br />
      <br />
      タイトル：<input type="text" value={reviewTitle} onChange={(e)=>{setReviewTitle(e.target.value)}}></input>
      <br />
      <br />
      ☆の数：<input type="text" onChange={(e)=>{setStar(e.target.value)}}></input>
      <br />
      <br />
      感想：<textarea onChange={(e)=>{setReviewDetail(e.target.value)}}></textarea>

      <br />
      <button type="button" onClick={onClickNewBread}>テスト</button>
      <br />
      <br />
      <br />
    </>
  );
};

const SMain = styled.main`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 8px auto;
  gap: 18px;
`;

const SBraedContainer = styled.div`
  display: flex;
  margin-top: 24px;
`;

const SStoreDetail = styled.div`
  min-height: 256px;
  width: 60%;
  margin-left: 8px;
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
  color: gray;
`;

const SH2 = styled.h2`
  font-size: 18px;
`;

const SH3 = styled.h3`
  font-size: 18px;
`;

const SStar = styled.div`
  float: left;
  margin-right: 16px;
`;

const SReviewContainer = styled.div`
  background-color: gainsboro;
  padding: 24px;
`;

const SUsername = styled.div`
  text-align: right;
`;
