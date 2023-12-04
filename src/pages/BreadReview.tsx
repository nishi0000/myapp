import { Link, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../firebase";
import styled from "styled-components";
import Button from "../comportnents/Button";
import BreadDtail from "../comportnents/BreadDetail";
import ReactStarsRating from "react-awesome-stars-rating";
import { RootState } from "features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "../comportnents/Pagination";
import {
  PageState,
  ReviewPageBack,
  ReviewPageFirst,
  ReviewPageLast,
  ReviewPageNext,
} from "../features/Page";

export const BreadReview = () => {
  const [reviewId, setReviewId] = useState<any>([]);
  const [reviewData, setReviewData] = useState<any>();
  const [isReviewLoading, setReviewIsLoading] = useState<boolean>(true);
  const [userName, setUserName] = useState<any>("");
  const useId = useSelector((state: RootState) => state.auth.userToken);
  const page = useSelector((state: PageState) => state.page.reviewPage);
  const admin = useSelector((state: RootState) => state.auth.admin);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(ReviewPageFirst());
    const postData = collection(db, "newbread", `${params.breadId}`, "review");
    // レビュー投稿順に表示する
    const sortedQuery = query(postData, orderBy("timestamp", `desc`)); // 'desc'は降順、'asc'は昇順

    // ページネーション用に配列をつくる
    getDocs(sortedQuery).then((querySnapshot) => {
      console.log(querySnapshot.docs.map((doc) => doc.data()));
      if (querySnapshot.docs.length != 0) {
        setReviewId(
          // 各レビューidを配列として受け取る（リンク作成用）
          Pagination(
            querySnapshot.docs.map((doc) => doc.id),
            3
          )
        );
        // 各レビューデータを配列として受け取る（データ表示用）
        setReviewData(
          Pagination(
            querySnapshot.docs.map((doc) => doc.data()),
            3
          )
        );
      } else {// もしレビューがなければ空の配列を受け取る
        setReviewData(querySnapshot.docs.map((doc) => doc.data()));
      }
      // ローディング非表示
      setReviewIsLoading(false);
    });
  }, []);

  useEffect(() => {
    //ユーザーネーム取得用関数
    const getUserNameArray = async () => {
      const usernames = await Promise.all(
        reviewData[page].map((data: any) =>
          getDoc(doc(db, "users", `${data.uid}`)).then(
            (userData: any) => userData.data().username
          )
        )
      );
      // ユーザーネームを配列として受け取る
      setUserName(usernames);
    };

    // ユーザーデータを取得する前に、reviewDataとpageが定義されているか確認
    if (reviewData && reviewData[page] && page !== undefined) {
      getUserNameArray();
    }
  }, [reviewData,page]);

  // ページネーション用関数　次へ進む
  const onClickNextPage = () => {
    if (reviewData.length - 1 > page) {
      console.log(reviewData.length);
      dispatch(ReviewPageNext());
    } else {
    }
  };

   // ページネーション用関数　前へ戻る
  const onClickBackPage = () => {
    if (page > 0 && reviewData.length + 1 > page) {
      console.log(reviewData.length);
      dispatch(ReviewPageBack());
    } else {
    }
  };

  // ページネーション用関数　最初に戻る
  const onClickFirstPage = () => {
    dispatch(ReviewPageFirst());
  };

  // ページネーション用関数　最後に進む
  const onClickLastPage = () => {
    dispatch(ReviewPageLast({ lastpage: reviewData.length - 1 }));
  };

  return (
    <>
      <BreadDtail params={`${params.breadId}`} />
      {useId && (
        <SButtoncontainer>
          <Link to="newbreadreview">
            <Button>レビューを投稿する</Button>
          </Link>
        </SButtoncontainer>
      )}

      <SMaincontainer>
        {isReviewLoading ? (
          <p></p>
        ) : reviewData.length > 0 ? (
          reviewData[page].map((data: any, index: any) => {
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
                  <Link to={`/users/${data.uid}`}>
                    <SUsername>{userName[index]}</SUsername>
                  </Link>
                  {admin ||
                    (useId === data.uid && (
                      <Link
                        to={`/${params.breadId}/${reviewId[page][index]}/editbreadreview`}
                      >
                        編集
                      </Link>
                    ))}
                </SReviewContainer>
              </>
            );
          })
        ) : (
          <p>まだレビューが投稿されていません。</p>
        )}
        <div onClick={onClickFirstPage}>最初に戻る</div>
        <div onClick={onClickBackPage}>前へ</div>
        <div onClick={onClickNextPage}>次へ</div>
        <div onClick={onClickLastPage}>最後に進む</div>
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

const SButtoncontainer = styled.div`
  text-align: center;
`;

const STitlecontainer = styled.div`
  display: flex;
  margin-bottom: 8px;
`;
