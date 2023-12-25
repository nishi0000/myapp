import styled from "styled-components";
import db from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import Button from "../comportnents/Button";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Compressor from "compressorjs";
import { useNavigate } from "react-router-dom";
import { RootState } from "../features/AuthSlice";
import { useSelector } from "react-redux";

export const NewBreadPage = () => {
  const [name, setName] = useState<string>("");
  const [store, setStore] = useState<string>("");
  const [homepageUrl, setHomepageUrl] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [price, setPrice] = useState<any>(0);
  const admin = useSelector((state: RootState) => state.auth.admin);
  const Navigate = useNavigate();
  const [image, setImage] = useState<any>("");
  const storage = getStorage();

  useEffect(()=>{admin||Navigate(`/${process.env.REACT_APP_PUBLIC_URL}`);},[])



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
          addDoc(collection(db, "newbread"), {
            // レビュー新規登録
            name,
            store,
            homepageUrl,
            bookmark: 0,
            photoUrl: data,
            star: 0,
            review: 0,
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
          Navigate(`/${process.env.REACT_APP_PUBLIC_URL}`);
        });
    } else {
      addDoc(collection(db, "newbread"), {
        // レビュー新規登録
        name,
        store,
        homepageUrl,
        bookmark: 0,
        photoUrl,
        star: 0,
        review: 0,
        price,
        detail,
        timestamp: serverTimestamp(),
      }).then(() => {
        Navigate(`/${process.env.REACT_APP_PUBLIC_URL}`);
      });
    }
  };

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
        </SButtoncontainer>
      </form>
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
  height: 100px;
  font-size: large;
`;

const SButtoncontainer = styled.div`
  text-align: center;
`;
