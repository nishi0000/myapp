import { FC } from "react";
import styled from "styled-components";
import reviewicon from "../images/review.png";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import ReactStarsRating from "react-awesome-stars-rating";
import db from "../firebase";
import noimage from "../images/noimage.png";
import { Link } from "react-router-dom";

type BaredDtailType = {
  params: string;
};

export const BreadDtail: FC<BaredDtailType> = ({ params }) => {
  const [breadData, setBreadData] = useState<any>("");
  const [isBreadLoading, setBreadIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const test = async () => {
      const docRef = doc(db, "newbread", params);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setBreadData(docSnap.data());
        setBreadIsLoading(false);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!", docSnap);
        console.error(`ドキュメントが見つかりませんでした。ID: ${params}`);
      }
    };
    test();
  }, []);

  return (
    <SMaincontainer>
      {isBreadLoading ? (
        <p>ロード中</p>
      ) : (
        <SBraedContainer>
          {breadData.photoUrl ? (
            <>
              <SBraedicon
                style={{ backgroundImage: `url(${breadData.photoUrl})` }}
              ></SBraedicon>
              <SBraediconsp src={`${breadData.photoUrl}`}></SBraediconsp>
            </>
          ) : (
            <SBraednoneicon src={noimage}></SBraednoneicon>
          )}
         
          <SStoreDetail>
                    <SH2>{breadData.name}</SH2>
                    <SHomepagelink target="_blank" href={`${breadData.homepageUrl}`}>{breadData.store}</SHomepagelink>
                    <SPdetail>{breadData.detail}</SPdetail>
                    <p>価格：{breadData.price}円</p>
                    <div>
                      <ReactStarsRating
                        value={(parseInt(breadData.star, 10) / breadData.review).toFixed(
                          1
                        )}
                        isEdit={false}
                        size={18}
                      />

                      {breadData.review ? (
                        <SStar>
                          {(parseInt(breadData.star, 10) / breadData.review).toFixed(1)}
                        </SStar>
                      ) : (
                        <SStar>0</SStar>
                      )}

                      <SReview>
                        <SIcon src={`${reviewicon}`} />
                        <SReviews>{breadData.review}</SReviews>
                      </SReview>
                    </div>
                  </SStoreDetail>
        </SBraedContainer>
      )}
    </SMaincontainer>
  );
};

const SMaincontainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 8px auto;
  gap: 18px;
`;


const SH2 = styled.h2`
color: black;
text-decoration: none;
font-size: 20px;
display: block;
margin-bottom: 8px;

@media screen and (max-width: 428px) {
  font-size: 18px;
  margin-top:12px;
}
`;

const SBraedContainer = styled.div`
  display: flex;
  word-wrap: break-word;
  margin: 24px auto 12px;
  width: 95%;
  @media screen and (max-width: 428px) {
    width: 90%;
    flex-direction: column;
    padding: 8px 0;
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
    margin: 0 auto;
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
    margin: 0 auto;
  }
`;

const SPdetail = styled.p`
  font-size: 12px;
  color: gray;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const SStar = styled.span`
  font-size: 24px;
  margin: 8px;
`;

const SIcon = styled.img`
  height: 20px;
  transition: 0.1s;
  margin-left: 8px;
`;

const SReviews = styled.span`
  font-size: 20px;
  margin-left: 4px;
  color: black;
  text-decoration: none;
`;

const SReview = styled.span`
  color: black;
  text-decoration: none;

`;

const SLink = styled(Link)`
  color: black;
  text-decoration: none;
  font-size: 16px;
  display: block;
  &:hover {
    text-decoration: underline;
  }
`;

const SHomepagelink = styled.a`
  color: black;
  text-decoration: none;
  font-size: 16px;
  display: block;
  &:hover {
    text-decoration: underline;
  }
`;

export default BreadDtail;
