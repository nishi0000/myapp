import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import ReactStarsRating from 'react-awesome-stars-rating';
import db from "../firebase";
import styled from "styled-components";

export const UserReviewList = () => {
  const params = useParams();
  const [reviewDataArry, setReviewDataArry] = useState<any>();
  const [isReviewLoading,setIsReviewLoading] = useState<boolean>(true);


  useEffect(() => {
    getDoc(doc(db, "users", `${params.userId}`))// ここでユーザーデータをとってくる
      .then((userData) => {
        const user = userData.data();
        if (user && user.reviews) {// ユーザーのレビューがある場合
          const promises = user.reviews.map((review:any) => {
            const { breadId, reviewId } = review;
            return getDoc(doc(db, "newbread", `${breadId}`, "review", `${reviewId}`))
              .then((reviewData) => {
                return reviewData.data();
              });
          });
          return Promise.all(promises); 
        }
        return []; // レビューがない場合は空の配列を返す
      })
      .then((reviews) => {
        console.log(reviews);
        setReviewDataArry(reviews);
        setIsReviewLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);


  return (
    <>      <SMaincontainer>
    {isReviewLoading ? (
      <p></p>
    ) : (
      reviewDataArry.map((data: any) => {
        const timestamp = new Date(data.timestamp.seconds * 1000);

        
        return (
          <>
            <SReviewContainer>
              <STitlecontainer>
            <ReactStarsRating value={data.star} isEdit={false} size={20}/>
              <SH3>{data.title}</SH3>
              </STitlecontainer>
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
  </SMaincontainer>

      <p>ユーザーレビューだよー</p>
    </>
  );
};



const SMaincontainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 8px auto;
  margin-top:16px;
  gap: 18px;
`;

const SH3 = styled.h3`
  font-size: 18px;
  display:block;
  margin-left:8px;
`;

const SReviewContainer = styled.div`
  background-color: #f0cfa0;
  padding: 24px;
`;

const SUsername = styled.div`
  text-align: right;
`;

const SButtoncontainer = styled.div`
  text-align: center;
`;

const STitlecontainer= styled.div`
display:flex;
margin-bottom:8px;
`;
