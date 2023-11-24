import { FC } from "react";
import styled from "styled-components";
import { useEffect,useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import db from "../firebase";
import noimage from "../images/noimage.png"

type BaredDtailType = {
    params: string;
};

export const BreadDtail: FC<BaredDtailType> = ({ params }) => {

    const [breadData,setBreadData] = useState<any>("");
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
            console.log("No such document!",docSnap);
            console.error(`ドキュメントが見つかりませんでした。ID: ${params}`)
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
              <SUsericon
                style={{ backgroundImage: `url(${breadData.photoUrl})` }}
              ></SUsericon>
            ) : (
              <SUsernoneicon src={noimage}></SUsernoneicon>
            )}
            <SStoreDetail>
              <SH2>{breadData.name}</SH2>
              <p>{breadData.store}</p>
              <SPdetail>{breadData.detail}</SPdetail>
              <p>レビュー数:{breadData.review}</p>
              <p>お気に入り数:{breadData.bookmark}</p>
              <p>価格：{breadData.price}円</p>
              {breadData.review ? (<p>平均評価：{(parseInt(breadData.star, 10)/breadData.review).toFixed(1)}</p>):(<p>平均評価：0</p>)}
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

const SBraedContainer = styled.div`
  display: flex;
  margin-top: 24px;
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

const SH2 = styled.h2`
  font-size: 18px;
`;


export default BreadDtail;