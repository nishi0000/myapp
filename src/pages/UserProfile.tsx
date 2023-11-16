import { RootState, iconUpload } from "../features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import Compressor from "compressorjs";

export const UserProfile = () => {
  const token = useSelector((state: RootState) => state.auth.userToken);
  const name = useSelector((state: RootState) => state.auth.userName);
  const userIcon = useSelector((state: RootState) => state.auth.userIcon);
  const storage = getStorage();
  const dispatch = useDispatch();
  const [image, setImage] = useState<any>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const onFileInputChange = (e: any) => {
    //
    // アップロードする画像を表示する
    if (e.target.files.length > 0) {
      // ファイルが選択されていればセット
      const file = e.target.files[0];
      console.log(e.target.files[0]);
      new Compressor(file, {
        quality: 0.6,
        maxHeight: 400,
        maxWidth: 400,
        convertSize: 1000000,
        success(result) {
          setImage(result);
          console.log(result);
        },
      });
    } else {
      setImage(""); // ファイルが選択されていなければ空にする
    }
  };

  const handleSubmit = (e: any) => {
    // 画像をアップロードする
    if (image) {
      e.preventDefault();
      console.log(image);
      const storageRef = ref(storage, `images/${image.name}`);
      uploadBytes(storageRef, image)
        .then(() => {
          console.log(storageRef);
          return getDownloadURL(storageRef)})
        .then((url) => {
          console.log(url);
          setImageUrl(url);
          return url;
            })
        .then((url) => {
          const auth = getAuth();
          if (auth.currentUser) {
            updateProfile(auth.currentUser, {
              photoURL: imageUrl,
            })
              .then(() => {
                console.log("あっぷでーと成功！");
                setImage("");
                dispatch(
                  iconUpload({
                    usericon: imageUrl,
                  })
                );
              })
              .catch((error) => {
                console.log(error);
              });
          }


        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onClickSubmit = () => {
    // アップロードした画像をアイコンとして登録する
    const auth = getAuth();
    if (auth.currentUser) {
      updateProfile(auth.currentUser, {
        photoURL: imageUrl,
      })
        .then(() => {
          console.log("あっぷでーと成功！");
          setImage("");
          dispatch(
            iconUpload({
              usericon: imageUrl,
            })
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <p>userprofileだよー</p>
      <p>{token}</p>
      <p>名前：{name}</p>
      <p>{userIcon}</p>
      <img src={`${userIcon}`}></img>
      <label>アイコン画像</label>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={onFileInputChange}
        />
        <button className="button">アップロード</button>
        {image && <img src={window.URL.createObjectURL(image)} />}
      </form>
      <button onClick={onClickSubmit}>送信</button>
    </>
  );
};
