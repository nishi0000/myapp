import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import ReactStarsRating from "react-awesome-stars-rating";
import db from "../firebase";
import styled from "styled-components";

export const UserReviewList = () => {
  const params = useParams();
  const [userData,setUserData] = useState<any>();
  const [reviewDataArry, setReviewDataArry] = useState<any>();
  const [isReviewLoading, setIsReviewLoading] = useState<boolean>(true);

  useEffect(() => {
    getDoc(doc(db, "users", `${params.userId}`)) // ユーザーデータ取得
      .then((userData) => {
        const user = userData.data();
        setUserData(userData.data())
        if (user && user.reviews) {
          // ユーザーのレビューがある場合
          const promises = user.reviews.map((review: any) => {
            const { breadId, reviewId } = review;
            return getDoc(
              doc(db, "newbread", `${breadId}`, "review", `${reviewId}`)
            ).then((reviewData) => {
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
    <>
      <SMaincontainer>
        {userData && (<SUsercontainer><SUsericon
                    style={{ backgroundImage: `url(${userData.usericon})` }}
                  ></SUsericon><SUserdetail><p>ユーザーネーム：{userData.username}</p><p>レビュー数：{userData.reviews.length}</p></SUserdetail></SUsercontainer>)}
        {isReviewLoading ? (
          <p></p>
        ) : (
          reviewDataArry.map((data: any) => {
            const timestamp = new Date(data.timestamp.seconds * 1000);

            return (
              <>
                <SReviewContainer>
                  <STitlecontainer>
                    <ReactStarsRating
                      value={data.star}
                      isEdit={false}
                      size={20}
                    />
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
    </>
  );
};

const SMaincontainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 8px auto;
  margin-top: 16px;
  gap: 18px;
`;

const SUsericon = styled.div`
height:200px;
width:200px;
border-radius:50%;
background-repeat: no-repeat;
background-position: center;
`;

const SUsercontainer = styled.div`
max-width: 600px;
display:flex;
align-items: center;
margin:0 auto;
`;

const SUserdetail = styled.div`
margin-left:32px;
`;

const SH3 = styled.h3`
  font-size: 18px;
  display: block;
  margin-left: 8px;
`;

const SReviewContainer = styled.div`
  background-color: #f0cfa0;
  padding: 24px;
`;

const SUsername = styled.div`
  text-align: right;
`;


const STitlecontainer = styled.div`
  display: flex;
  margin-bottom: 8px;
`;
