import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import human from "../images/human.png"
import ReactStarsRating from "react-awesome-stars-rating";
import db from "../firebase";
import styled from "styled-components";

export const UserReviewList = () => {
  const params = useParams();
  const [userData, setUserData] = useState<any>();
  const [reviewDataArray, setReviewDataArray] = useState<any>();
  const [isReviewLoading, setIsReviewLoading] = useState<boolean>(true);

  useEffect(() => {
    getDoc(doc(db, "users", `${params.userId}`)) // ユーザーデータ取得
      .then((userData) => {
        const user = userData.data();
        setUserData(userData.data());
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
        setReviewDataArray(reviews);
        setIsReviewLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <SMaincontainer>
        {userData && (
          <SUsercontainer>
            {userData.usericon ? (
              <SUsericon
                style={{ backgroundImage: `url(${userData.usericon})` }}
              ></SUsericon>
            ) : (<SUsernoneicon src={human}></SUsernoneicon>
            )}

            <SUserdetail>
              <p>ユーザーネーム：{userData.username}</p>
              
              <p>レビュー数：{(reviewDataArray && reviewDataArray.filter((data:any) => data !== undefined).length)}</p>
            </SUserdetail>
          </SUsercontainer>
        )}
        {isReviewLoading ? (
          <p></p>
        ) : (
          reviewDataArray.map((data: any) => {
            if(data){
            const timestamp = new Date(data.timestamp.seconds * 1000);
            return (
              <>
                <SReviewContainer>
                <Link to={`/${data.breadid}`}><h3>{data.breadtitle}</h3></Link>
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
                </SReviewContainer>
              </>
            );}
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
width: 95%;
`;

const SUsericon = styled.div`
  height: 200px;
  width: 200px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center;

`;

const SUsernoneicon = styled.img`
  height: 200px;
  width: 200px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center;
`;

const SUsercontainer = styled.div`
  max-width: 600px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  @media screen and (max-width: 428px) {
    flex-direction: column;
  }
`;

const SUserdetail = styled.div`
  margin-left: 32px;
  @media screen and (max-width: 428px) {
    margin-top: 12px;
  }
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


const STitlecontainer = styled.div`
  display: flex;
  margin-bottom: 8px;
`;
