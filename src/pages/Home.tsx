import db from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import noimage from "../images/noimage.png";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { splitArray } from "../comportnents/SplitArray";
import { useDispatch, useSelector } from "react-redux";
import { PageState, breadPageBack, breadPageFirst, breadPageLast, breadPageNext } from "../features/Page";

export const Home = () => {
  const [breadData, setBreadData] = useState<any>([]);
  const [breadId, setBreadId] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const page = useSelector((state:PageState) => state.page.breadPage);
  const dispatch = useDispatch();

  useEffect(() => {
    const postData = collection(db, "newbread");
    const sortedQuery = query(postData, orderBy("timestamp", `desc`));
    getDocs(sortedQuery).then((querySnapshot) => {
      console.log(querySnapshot.docs.map((doc) => doc.data()));
      console.log(querySnapshot.docs.map((doc) => doc.id));
      setBreadId(splitArray(querySnapshot.docs.map((doc) => doc.id),3));
      setBreadData(splitArray(querySnapshot.docs.map((doc) => doc.data()),3));

      console.log(splitArray(querySnapshot.docs.map((doc) => doc.data()),3));
      setIsLoading(false);
    });
  }, []);

  const onClickNextPage = () => {
    if(breadData.length-1 > page){
      console.log(breadData.length);
    dispatch(breadPageNext());
  }else{
  }
  }

  const onClickBackPage = () => {
    if( page > 0 && breadData.length+1 > page){
      console.log(breadData.length);
    dispatch(breadPageBack());
  }else{
  }
  }

  const onClickFirstPage = () => {
    dispatch(breadPageFirst());
  }

  const onClickLastPage = () => {
    dispatch(breadPageLast({lastpage:breadData.length-1}));
  }


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
  word-wrap:break-word;
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
