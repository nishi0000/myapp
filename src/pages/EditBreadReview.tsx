import { useNavigate, useParams } from "react-router-dom";
import BreadDtail from "../comportnents/BreadDetail";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../features/AuthSlice";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import db from "../firebase";
import styled from "styled-components";
import ReactStarsRating from "react-awesome-stars-rating";
import Button from "../comportnents/Button";
import { ModalWindow } from "../comportnents/ModalWindow";

export const EditBreadReview = () => {
    const [modalOpen,setModalOpen] = useState<boolean>(false);
  const [reviewTitle, setReviewTitle] = useState<string>();
  const [reviewDetail, setReviewDetail] = useState<string>();
  const [breadData,setBreadData] = useState<any>();
  const [star, setStar] = useState<number>(3);
  const useId = useSelector((state: RootState) => state.auth.userToken);
  const useName = useSelector((state: RootState) => state.auth.userName);
  const admin = useSelector((state: RootState) => state.auth.admin);
  const params = useParams();
  const Navigate = useNavigate();
  const onChange = (value: any) => {
    setStar(value);
  };

  useEffect(()=>{
    getDoc(doc(
      db,
      "newbread",
      `${params.breadId}`,
    ))
    .then((data:any) => {
      setBreadData(data.data());
    })

    getDoc(doc(
        db,
        "newbread",
        `${params.breadId}`,
        "review",
        `${params.reviewId}`,
      ))
      .then((data:any) => {
        console.log(data.data());
        setReviewTitle(data.data().title);
        setStar(data.data().star);
        setReviewDetail(data.data().datail);
      })

    
  },[])

  const onSubmitNewBread = (event: any) => {
    // 「投稿する」ボタンのクリック
    event.preventDefault();
    console.log(breadData);

    updateDoc(doc(db, "newbread", `${params.breadId}`, "review",`${params.reviewId}`), {
      // レビュー新規登録
      username: `${useName}`,
      uid: `${useId}`,
      title: `${reviewTitle}`,
      star: star,
      datail: `${reviewDetail}`,
      breadid:params.breadId,
      breadtitle:`${breadData.name}`,
    }).then(() => {
      // レビューしているパンの情報取得
      const postData = collection(
        db,
        "newbread",
        `${params.breadId}`,
        "review"
      );
      getDocs(postData)
        .then((data) => {
          console.log(data.docs.map((doc) => doc.data()));
          return data.docs.map((doc) => doc.data());
        })
        .then((data) => {
          updateDoc(doc(db, "newbread", `${params.breadId}`), {
            // レビュー数を取得・データを更新する
            review: data.length,
          });

          const starSum = data.reduce((data:any, value:any) => {
            //星の総数を計算
            return data + parseInt(value.star, 10);
          }, 0);
          console.log(starSum);
          return starSum; // 星の総数をreturnする
        })

        .then((data) => {
          // 星の総数データを更新する
          updateDoc(doc(db, "newbread", `${params.breadId}`), {
            star: data,
            starAverage:(data/(breadData.review)).toFixed(1),
          })
            .then(() => {
              console.log("更新が完了しました！");
            })
            .then(() => {// レビューページに戻る
              Navigate(`/${process.env.REACT_APP_PUBLIC_URL}/${params.breadId}`);
            });
        });
    });
  };

  const onClickDelete = () => {
    deleteDoc(
        doc(db, "newbread", `${params.breadId}`,"review",`${params.reviewId}`)
      ).then(()=>{
        const postData = collection(
            db,
            "newbread",
            `${params.breadId}`,
            "review"
          );
          getDocs(postData)
            .then((data) => {
              console.log(data.docs.map((doc) => doc.data()));
              return data.docs.map((doc) => doc.data());
            })
            .then((data) => {
              updateDoc(doc(db, "newbread", `${params.breadId}`), {
                // レビュー数を取得・データを更新する
                review: data.length,
              });
    
              const starSum = data.reduce((data:any, value:any) => {
                //星の総数を計算
                return data + parseInt(value.star, 10);
              }, 0);
              console.log(starSum);
              return starSum; // 星の総数をreturnする
            })
    
            .then((data) => {
              // 星の総数データを更新する
              updateDoc(doc(db, "newbread", `${params.breadId}`), {
                star: data,
              })
                .then(() => {
                  console.log("更新が完了しました！");
                })
                .then(() => {// レビューページに戻る
                  Navigate(`/${process.env.REACT_APP_PUBLIC_URL}/${params.breadId}`);
                });
            });
      }).then(()=>{
        Navigate(`/${process.env.REACT_APP_PUBLIC_URL}/${params.breadId}`);
      })
  }



  return (
    <>
      <BreadDtail params={`${params.breadId}`} />
      <form onSubmit={onSubmitNewBread}>
        <SContainer>
          <br />
          <br />
          レビュータイトル：
          <STitleinput
            type="text"
            value={reviewTitle}
            required
            onChange={(e) => {
              setReviewTitle(e.target.value);
            }}
          />
          <br />
          評価：
          <ReactStarsRating onChange={onChange} value={star} isHalf={false} />
          <br />
          レビュー本文：
          <SCommentsarea
            required
            value={reviewDetail}
            onChange={(e) => {
              setReviewDetail(e.target.value);
            }}
          ></SCommentsarea>
        </SContainer>
        <SButtoncontainer>
          <Button type="submit">更新する</Button>
          <Button type="button" onClick={()=>setModalOpen(true)}>削除する</Button>
        </SButtoncontainer>
      </form>
      {modalOpen && (
        <ModalWindow
          onClickYes={onClickDelete}
          onClickNo={() => setModalOpen(false)}
        >
          削除しますか？
        </ModalWindow>
      )}
    </>
  );
};

const SContainer = styled.main`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 8px auto;
  @media screen and (max-width: 428px) {
    width: 95%;
  }
`;

const STitleinput = styled.input`
  padding: 4px;
  font-size: large;
`;

const SCommentsarea = styled.textarea`
  padding: 4px;
  height: 200px;
  font-size: large;
`;

const SButtoncontainer = styled.div`
  text-align: center;
`;
