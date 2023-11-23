import { Link, useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../firebase";
import styled from "styled-components";
import Button from "../comportnents/Button";
import BreadDtail from "../comportnents/BreadDetail";
import ReactStarsRating from 'react-awesome-stars-rating';
import { RootState } from "features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { splitArray } from "../comportnents/SplitArray";
import { PageState, ReviewPageBack, ReviewPageFirst, ReviewPageLast, ReviewPageNext } from "../features/Page";

export const BreadReview = () => {
  const [reviewData, setReviewData] = useState<any>();
  const [isReviewLoading, setReviewIsLoading] = useState<boolean>(true);
  const useId = useSelector((state: RootState) => state.auth.userToken);
  const page = useSelector((state:PageState) => state.page.reviewPage);
  const dispatch = useDispatch();
  const params = useParams();
  
  useEffect(() => {

    const postData = collection(db, "newbread", `${params.breadId}`, "review");
    const sortedQuery = query(postData, orderBy('timestamp',`desc`)); // 'desc'は降順、'asc'は昇順
    
    getDocs(sortedQuery).then((querySnapshot) => {
      console.log(querySnapshot.docs.map((doc) => doc.data()));
      // setReviewData(querySnapshot.docs.map((doc) => doc.data()));
      setReviewData(splitArray(querySnapshot.docs.map((doc) => doc.data()),3));
      setReviewIsLoading(false);
    });

  }, []);

  const onClickNextPage = () => {
    if(reviewData.length-1 > page){
      console.log(reviewData.length);
    dispatch(ReviewPageNext());
  }else{
  }
  }

  const onClickBackPage = () => {
    if( page > 0 && reviewData.length+1 > page){
      console.log(reviewData.length);
    dispatch(ReviewPageBack());
  }else{
  }
  }

  const onClickFirstPage = () => {
    dispatch(ReviewPageFirst());
  }

  const onClickLastPage = () => {
    dispatch(ReviewPageLast({lastpage:reviewData.length-1}));
  }




  return (
    <>
      <BreadDtail params={`${params.breadId}`} />
      {useId && (<SButtoncontainer>

<Link to="newbreadreview">
  <Button>レビューを投稿する</Button>
</Link>
</SButtoncontainer>) }
      <SMaincontainer>
        {isReviewLoading ? (
          <p></p>
        ) : (
          reviewData[page].map((data: any) => {
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
                  <Link to={`/users/${data.uid}`}><SUsername>{data.username}</SUsername></Link>
                </SReviewContainer>
              </>
            );
          })
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
