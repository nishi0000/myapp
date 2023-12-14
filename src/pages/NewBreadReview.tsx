import { useNavigate, useParams } from "react-router-dom";
import BreadDtail from "../comportnents/BreadDetail";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../features/AuthSlice";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import db from "../firebase";
import styled from "styled-components";
import ReactStarsRating from "react-awesome-stars-rating";
import Button from "../comportnents/Button";

export const NewBreadReview = () => {
  const [reviewTitle, setReviewTitle] = useState<string>();
  const [reviewDetail, setReviewDetail] = useState<string>();
  const [breadData,setBreadData] = useState<any>();
  const [star, setStar] = useState<number>(3);
  const useId = useSelector((state: RootState) => state.auth.userToken);
  const useName = useSelector((state: RootState) => state.auth.userName);
  const params = useParams();
  const Navigate = useNavigate();
  const onChange = (value: any) => {
    setStar(value);
  };

  useEffect(()=>{

    getDoc(doc(
      db,
      "newbread",
      `${params.breadId}`,
    ))
    .then((data:any) => {
      setBreadData(data.data());
    })
    
  },[])

  const onSubmitNewBread = (event: any) => {
    // 「投稿する」ボタンのクリック
    event.preventDefault();
    console.log(breadData);

    addDoc(collection(db, "newbread", `${params.breadId}`, "review"), {
      // レビュー新規登録
      username: `${useName}`,
      uid: `${useId}`,
      title: `${reviewTitle}`,
      star: star,
      datail: `${reviewDetail}`,
      breadid:params.breadId,
      breadtitle:`${breadData.name}`,
      timestamp: serverTimestamp(),
    }).then((data) => {
      updateDoc(doc(db, "users", `${useId}`), {
        reviews: arrayUnion({breadId:`${params.breadId}`,reviewId:data.id})
    });
      console.log(data.id);
      // レビューしているパンの情報取得
      const postData = collection(
        db,
        "newbread",
        `${params.breadId}`,
        "review"
      );
      getDocs(postData)
        .then((data) => {
          console.log(data.docs.map((doc) => doc.data()));
          return data.docs.map((doc) => doc.data());
        })
        .then((data) => {
          updateDoc(doc(db, "newbread", `${params.breadId}`), {
            // レビュー数を取得・データを更新する
            review: data.length,
            timestamp: serverTimestamp(),
          });

          const starSum = data.reduce((data:any, value:any) => {
            //星の総数を計算
            return data + parseInt(value.star, 10);
          }, 0);
          console.log(starSum);
          return starSum; // 星の総数をreturnする
        })

        .then((data) => {
          // 星の総数データを更新する

          updateDoc(doc(db, "newbread", `${params.breadId}`), {
            star: data,
            starAverage:(data/(breadData.review+1)).toFixed(1),
          })
            .then(() => {
              console.log("更新が完了しました！");
            })
            .then(() => {// レビューページに戻る
              Navigate(`${process.env.PUBLIC_URL}/${params.breadId}`);
            });
        });
    });
  };

  return (
    <>
      <BreadDtail params={`${params.breadId}`} />
      <form onSubmit={onSubmitNewBread}>
        <SContainer>
          <br />
          <br />
          レビュータイトル：
          <STitleinput
            type="text"
            value={reviewTitle}
            required
            onChange={(e) => {
              setReviewTitle(e.target.value);
            }}
          />
          <br />
          評価：
          <ReactStarsRating onChange={onChange} value={star} isHalf={false} />
          <br />
          レビュー本文：
          <SCommentsarea
            required
            onChange={(e) => {
              setReviewDetail(e.target.value);
            }}
          ></SCommentsarea>
        </SContainer>
        <SButtoncontainer>
          <Button type="submit">投稿する</Button>
        </SButtoncontainer>
      </form>
    </>
  );
};

const SContainer = styled.main`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 8px auto;
  @media screen and (max-width: 428px) {
    width: 95%;
  }
`;

const STitleinput = styled.input`
  padding: 4px;
  font-size: large;
`;

const SCommentsarea = styled.textarea`
  padding: 4px;
  height: 200px;
  font-size: large;
`;

const SButtoncontainer = styled.div`
  text-align: center;
`;
