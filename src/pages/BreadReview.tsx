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

export const BreadReview = () => {
  const [reviewData, setReviewData] = useState<any>();
  const [isReviewLoading, setReviewIsLoading] = useState<boolean>(true);
  const params = useParams();
  

  useEffect(() => {

    const postData = collection(db, "newbread", `${params.breadId}`, "review");
    const sortedQuery = query(postData, orderBy('timestamp',`desc`)); // 'desc'は降順、'asc'は昇順
    
    getDocs(sortedQuery).then((querySnapshot) => {
      console.log(querySnapshot.docs.map((doc) => doc.data()));
      console.log(querySnapshot.docs.map((doc) => doc.id));
      setReviewData(querySnapshot.docs.map((doc) => doc.data()));
      setReviewIsLoading(false);
    });

  }, []);

  return (
    <>
      <BreadDtail params={`${params.breadId}`} />
      <SButtoncontainer>
        <Link to="newbreadreview">
          <Button>レビューを投稿する</Button>
        </Link>
      </SButtoncontainer>
      <SMaincontainer>
        {isReviewLoading ? (
          <p></p>
        ) : (
          reviewData.map((data: any) => {
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

    </>
  );
};

const SMaincontainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 8px auto;
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
