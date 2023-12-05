import db from "../firebase";
import reviewicon from "../images/review.png";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import noimage from "../images/noimage.png";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Pagination } from "../comportnents/Pagination";
import ReactStarsRating from "react-awesome-stars-rating";
import { useDispatch, useSelector } from "react-redux";
import {
  PageState,
  breadPageBack,
  breadPageFirst,
  breadPageLast,
  breadPageNext,
} from "../features/Page";
import { RootState } from "../features/AuthSlice";

export const Home = () => {
  const [breadData, setBreadData] = useState<any>([]);
  const [breadId, setBreadId] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const page = useSelector((state: PageState) => state.page.breadPage);
  const admin = useSelector((state: RootState) => state.auth.admin);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  useEffect(() => {
    dispatch(breadPageFirst());
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
          3
        )
      );
      setBreadData(
        // ページネーション用関数　各商品データを配列として受け取る（データ表示用）
        Pagination(
          querySnapshot.docs.map((doc) => doc.data()),
          3
        )
      );
      console.log(
        Pagination(
          querySnapshot.docs.map((doc) => doc.data()),
          3
        )
      );
      setIsLoading(false);
    });
  }, []);

  const onClickNextPage = () => {
    // ページネーション用関数　次へ進む
    if (breadData.length - 1 > page) {
      console.log(breadData.length);
      dispatch(breadPageNext());
    } else {
    }
  };

  const onClickBackPage = () => {
    // ページネーション用関数　前へ戻る
    if (page > 0 && breadData.length + 1 > page) {
      console.log(breadData.length);
      dispatch(breadPageBack());
    } else {
    }
  };

  const onClickFirstPage = () => {
    // ページネーション用関数　最初に戻る
    dispatch(breadPageFirst());
  };

  const onClickLastPage = () => {
    // ページネーション用関数　最後に進む
    dispatch(breadPageLast({ lastpage: breadData.length - 1 }));
  };

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
              <SBraedContainer
                onClick={() => Navigate(`/${breadId[page][index]}`)}
                key={index}
              >
                {data.photoUrl ? (
                  <SUsericon
                    style={{ backgroundImage: `url(${data.photoUrl})` }}
                  ></SUsericon>
                ) : (
                  <SUsernoneicon src={noimage}></SUsernoneicon>
                )}
                <SStoreDetail>
                  <SLink to={`/${breadId[page][index]}`}>{data.name}</SLink>
                  <p>{data.store}</p>
                  <SPdetail>{data.detail}</SPdetail>
                  <p>価格：{data.price}円</p>
                  <div>
                    <ReactStarsRating
                      value={(parseInt(data.star, 10) / data.review).toFixed(1)}
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
                  {admin && (
                    <>
                      <br />
                      <Link to={`/${breadId[page][index]}/editbreadpage`}>
                        編集
                      </Link>
                    </>
                  )}
                </SStoreDetail>
              </SBraedContainer>
            );
          })
        )}
        <div onClick={onClickFirstPage}>最初に戻る</div>
        <div onClick={onClickBackPage}>前へ</div>
        <div onClick={onClickNextPage}>次へ</div>
        <div onClick={onClickLastPage}>最後に進む</div>
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
`;

const SStoreDetail = styled.div`
  min-height: 216px;
  width: 60%;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SUsericon = styled.div`
  max-height: 216px;
  width: 216px;
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
