import styled from "styled-components";
import db from "../firebase";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState,useEffect } from "react";
import Button from "../comportnents/Button";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Compressor from "compressorjs";
import { useNavigate, useParams } from "react-router-dom";
import { ModalWindow } from "../comportnents/ModalWindow";

export const EditBreadPage = () => {
  const [modalOpen,setModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [store, setStore] = useState<string>("");
  const [homepageUrl, setHomepageUrl] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [price, setPrice] = useState<any>(0);
  const [bookmark, setBookmark] = useState<any>(0);
  const [star, setStar] = useState<any>(0);
  const [review, setReview] = useState<any>(0);
  const [image, setImage] = useState<any>("");
  const Navigate = useNavigate();
  const params = useParams();
  const storage = getStorage();


  useEffect(()=>{

    getDoc(doc(
      db,
      "newbread",
      `${params.breadId}`,
    ))
    .then((data:any) => {
      console.log(data.data());
      setName(data.data().name);
      setStore(data.data().store);
      setPrice(data.data().price);
      setHomepageUrl(data.data().homepageUrl);
      setDetail(data.data().detail);
      setPhotoUrl(data.data().photoUrl);
      setBookmark(data.data().bookmark);
      setStar(data.data().star);
      setReview(data.data().review);
    })
    
  },[])


  const onFileInputChange = (e: any) => {
    // アップロードする画像を選択・リサイズする関数
    // アップロードする画像を表示する
    if (e.target.files.length > 0) {
      // ファイルが選択されていればセット
      const file = e.target.files[0];
      console.log(e.target.files[0]);
      new Compressor(file, {
        // 画像のリサイズ
        quality: 0.6,
        maxHeight: 400,
        maxWidth: 400,
        convertSize: 1000000,
        success(result) {
          setImage(result); // 変換した画像をセット
          console.log(result);
        },
      });
    } else {
      setImage(""); // ファイルが選択されていなければ空にする
    }
  };


  const onSubmitNewBread = (event: any) => {
    // 「投稿する」ボタンのクリック
    event.preventDefault();
    if (image) {
      console.log(image);
      const storageRef = ref(storage, `images/${image.name}`);
      uploadBytes(storageRef, image)
        .then(() => {
          console.log("画像アップロード成功！");
          return getDownloadURL(storageRef); //画像URLゲット
        })
        .then((data) => {
            updateDoc(doc(db, "newbread", `${params.breadId}`), {
                // レビュー新規登録
                name,
                store,
                homepageUrl,
                bookmark,
                photoUrl: data,
                star,
                review:review,
                price,
                detail,
                timestamp: serverTimestamp(),
              });
        })
        .catch((error) => {
          console.log(error);
          console.log("画像アップロード失敗");
        })
        .then(() => {
          Navigate("/");
        });
    } else {
        updateDoc(doc(db, "newbread", `${params.breadId}`), {
        // レビュー新規登録
        name,
        store,
        homepageUrl,
        bookmark,
        photoUrl,
        star,
        review:review,
        price,
        detail,
        timestamp: serverTimestamp(),
      }).then(() => {
        Navigate("/");
      });
    }
  };

  const onClickDelete = () => {
      deleteDoc(
        doc(db, "newbread", `${params.breadId}`)
      ).then(()=>{
        Navigate("/");
      })

  }

  return (
    <>
      <form onSubmit={onSubmitNewBread}>
        <SContainer>
          <h2>新規ページ追加</h2>
          <br />
          商品タイトル：
          <STitleinput
            type="text"
            value={name}
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          お店の名前：
          <STitleinput
            type="text"
            value={store}
            required
            onChange={(e) => {
              setStore(e.target.value);
            }}
          />
          ホームページURL：
          <STitleinput
            type="text"
            value={homepageUrl}
            onChange={(e) => {
              setHomepageUrl(e.target.value);
            }}
          />
          価格：
          <STitleinput
            type="text"
            pattern="^[1-9][0-9]*$"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          />
          説明文：
          <SCommentsarea
            required
            value={detail}
            onChange={(e) => {
              setDetail(e.target.value);
            }}
          ></SCommentsarea>
          <br />
          <input
            accept="image/png, image/jpeg"
            type="file"
            onChange={onFileInputChange}
          />
          <br />
          {image && (
            <img src={window.URL.createObjectURL(image)} alt="user-icon" />
          )}
        </SContainer>
        <br />
        <SButtoncontainer>
          <Button type="submit">投稿する</Button>
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
`;

const STitleinput = styled.input`
  padding: 4px;
  font-size: large;
`;

const SCommentsarea = styled.textarea`
  padding: 4px;
  height: 100px;
  font-size: large;
`;

const SButtoncontainer = styled.div`
  text-align: center;
`;


