import db from "../firebase";
import reviewicon from "../images/review.png";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import noimage from "../images/noimage.png";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { PageControl, Pagination } from "../comportnents/Pagination";
import ReactStarsRating from "react-awesome-stars-rating";
import { useDispatch, useSelector } from "react-redux";
import { PageState, pageFirst } from "../features/Page";
import { RootState } from "../features/AuthSlice";

export const Home = () => {
  const [breadData, setBreadData] = useState<any>([]);
  const [breadId, setBreadId] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const page = useSelector((state: PageState) => state.page.page);
  const admin = useSelector((state: RootState) => state.auth.admin);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  useEffect(() => {
    dispatch(pageFirst());
    // 各商品データ取得関数
    const postData = collection(db, "newbread");
    const sortedQuery = query(postData, orderBy("timestamp", `desc`));
    getDocs(sortedQuery).then((querySnapshot) => {
      // 各商品データ取得
      console.log(querySnapshot.docs.map((doc) => doc.data()));
      console.log(querySnapshot.docs.map((doc) => doc.id));
      setBreadId(
        // 各商品idを配列として受け取る（リンク作成用）
        Pagination(
          querySnapshot.docs.map((doc) => doc.id),
          5
        )
      );
      setBreadData(
        // ページネーション用関数　各商品データを配列として受け取る（データ表示用）
        Pagination(
          querySnapshot.docs.map((doc) => doc.data()),
          5
        )
      );
      console.log(
        Pagination(
          querySnapshot.docs.map((doc) => doc.data()),
          5
        )
      );
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <SMain>
        <h2>Bread Review</h2>
        <p>平均評価順/レビューが多い順</p>
        {isLoading ? (
          <p>ロード中</p>
        ) : (
          breadData[page].map((data: any, index: number) => {
            return (
              <>
                <SBraedContainer
                  onClick={() => Navigate(`/${breadId[page][index]}`)}
                  key={index}
                >
                  {data.photoUrl ? (
                    <>
                      <SBraedicon
                        style={{ backgroundImage: `url(${data.photoUrl})` }}
                      ></SBraedicon>
                      <SBraediconsp src={`${data.photoUrl}`}></SBraediconsp>
                    </>
                  ) : (
                    <SBraednoneicon src={noimage}></SBraednoneicon>
                  )}
                  <SStoreDetail>
                    <SLink to={`/${breadId[page][index]}`}>{data.name}</SLink>
                    <p>{data.store}</p>
                    <SPdetail>{data.detail}</SPdetail>
                    <p>価格：{data.price}円</p>
                    <div>
                      <ReactStarsRating
                        value={(parseInt(data.star, 10) / data.review).toFixed(
                          1
                        )}
                        isEdit={false}
                        size={18}
                      />

                      {data.review ? (
                        <SStar>
                          {(parseInt(data.star, 10) / data.review).toFixed(1)}
                        </SStar>
                      ) : (
                        <SStar>0</SStar>
                      )}

                      <SLinkReview to={`/${breadId[page][index]}`}>
                        <SIcon src={`${reviewicon}`} />
                        <SReviews>{data.review}</SReviews>
                      </SLinkReview>
                    </div>
                  </SStoreDetail>
                </SBraedContainer>
                {admin && (
                  <>
                    <SEditlink to={`/${breadId[page][index]}/editbreadpage`}>
                      編集
                    </SEditlink>
                  </>
                )}
              </>
            );
          })
        )}

        <PageControl url={`/#top`} arrayData={breadData} />
      </SMain>
    </>
  );
};

const SMain = styled.main`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 8px auto;
`;

const SBraedContainer = styled.div`
  display: flex;
  margin-top: 24px;
  word-wrap: break-word;
  &:hover {
    background-color: #fffacd;
  }
  @media screen and (max-width: 428px) {
    width: 90%;
    flex-direction: column;
    padding :8px 0;
    margin : 0 auto;
  }
`;

const SStoreDetail = styled.div`
  min-height: 216px;
  width: 60%;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media screen and (max-width: 428px) {
    width: 95%;
  }
`;

const SBraedicon = styled.div`
  max-height: 216px;
  width: 216px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  @media screen and (max-width: 428px) {
    display: none;
  }
`;

const SBraediconsp = styled.img`
  display: none;
  @media screen and (max-width: 428px) {
    display: block;
    width: 95%;
    margin:0 auto;
  }
`;

const SBraednoneicon = styled.img`
  display: block;
  max-height: 216px;
  width: 216px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  @media screen and (max-width: 428px) {
    height: 200px;
    width: 200px;
  }
`;

const SPdetail = styled.p`
  font-size: 12px;
  color: gray;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const SLink = styled(Link)`
  color: black;
  text-decoration: none;
  font-size: 20px;
  display: block;
  margin-bottom: 8px;
  &:hover {
    text-decoration: underline;
  }
`;

const SStar = styled.span`
  font-size: 24px;
  margin: 8px;
`;

const SIcon = styled.img`
  height: 20px;
  transition: 0.1s;
  margin-left: 8px;
  &:hover {
    transform: translate3d(1px, 1px, 0);
  }
`;

const SReviews = styled.span`
  font-size: 20px;
  margin-left: 4px;
  color: black;
  text-decoration: none;
`;

const SLinkReview = styled(Link)`
  color: black;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const SEditlink = styled(Link)`
  z-index: 3;
  text-align: right;
`;
