import { Link, useNavigate, useParams } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import human from "../images/human.png";
import ReactStarsRating from "react-awesome-stars-rating";
import db from "../firebase";
import styled from "styled-components";
import { PageControl, Pagination } from "../comportnents/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { PageState, pageFirst } from "../features/Page";

export const UserReviewList = () => {
  const params = useParams();
  const [userData, setUserData] = useState<any>();
  const [reviewData, setReviewData] = useState<any>([]);
  const [reviewDataArray, setReviewDataArray] = useState<any>([]);
  const [isReviewLoading, setIsReviewLoading] = useState<boolean>(true);
  const page = useSelector((state: PageState) => state.page.page);
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    
    dispatch(pageFirst());
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
        setReviewData(reviews);
        setReviewDataArray(Pagination(reviews, 5)); // ページネーション用に配列を作成
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
            ) : (
              <SUsernoneicon src={human}></SUsernoneicon>
            )}

            <SUserdetail>
              <p>ユーザーネーム：{userData.username}</p>

              <p>
                レビュー数：
                {reviewData &&
                 reviewData.filter((data: any) => data !== undefined)
                    .length}
              </p>
            </SUserdetail>
          </SUsercontainer>
        )}
        {isReviewLoading ? (
          <p></p>
        ) : (
          reviewDataArray[page].map((data: any) => {
            if (data) {
              const timestamp = new Date(data.timestamp.seconds * 1000);
              return (
                <>
                  <SReviewContainer
                    onClick={() =>
                      Navigate(`${process.env.PUBLIC_URL}/${data.breadid}`)
                    }
                  >
                    <SLinkbread
                      to={`${process.env.PUBLIC_URL}/${data.breadid}`}
                    >
                      {data.breadtitle}
                    </SLinkbread>
                    <STitlecontainer>
                      <ReactStarsRating
                        value={data.star}
                        isEdit={false}
                        size={18}
                      />
                      <SH3>{data.title}</SH3>
                    </STitlecontainer>
                    <STimestamp>
                      レビュー日時：{timestamp.getFullYear()}年
                      {timestamp.getMonth() + 1}月{timestamp.getDate()}日
                    </STimestamp>

                    <SDetail>{data.datail}</SDetail>
                  </SReviewContainer>
                </>
              );
            }
          })
        )}
      </SMaincontainer>

      {reviewDataArray.length > 0 && (
        <PageControl
          url={`${process.env.PUBLIC_URL}/users/${params.userId}/#top`}
          arrayData={reviewDataArray}
        />
      )}
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
  font-size: 16px;
  display: block;
  margin-left: 8px;
  font-weight: bolder;
`;

const SReviewContainer = styled.div`
  background-color: #f0cfa0;
  padding: 24px;
  &:hover {
    transform: translate3d(2px, 2px, 0);
  }
`;

const STitlecontainer = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const STimestamp = styled.div`
  color: #444444;
  font-size: 14px;
`;

const SDetail = styled.div`
  margin: 12px auto;
`;

const SLinkbread = styled(Link)`
  color: black;
  display: block;
  text-decoration: none;
  margin-bottom: 8px;
  &:hover {
    text-decoration: underline;
  }
`;
