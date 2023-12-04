import db from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import noimage from "../images/noimage.png";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Pagination } from "../comportnents/Pagination";
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

  

  useEffect(() => {
    dispatch(breadPageFirst())
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
              <SBraedContainer key={index}>
                {data.photoUrl ? (
                  <SUsericon
                    style={{ backgroundImage: `url(${data.photoUrl})` }}
                  ></SUsericon>
                ) : (
                  <SUsernoneicon src={noimage}></SUsernoneicon>
                )}
                <SStoreDetail>
                  <Link to={`/${breadId[page][index]}`}>{data.name}</Link>
                  <SH3>{data.name}</SH3>
                  <p>{data.store}</p>
                  <SPdetail>{data.detail}</SPdetail>
                  <p>レビュー数:{data.review}</p>
                  <p>お気に入り数:{data.bookmark}</p>
                  <p>価格：{data.price}円</p>
                  {data.review ? (
                    <p>
                      平均評価：
                      {(parseInt(data.star, 10) / data.review).toFixed(1)}
                    </p>
                  ) : (
                    <p>平均評価：0</p>
                  )}
                  {admin && (
                    <Link to={`/${breadId[page][index]}/editbreadpage`}>
                      編集
                    </Link>
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

const SH3 = styled.h3`
  font-size: 18px;
`;
