import { RootState, iconUpload, nameUpDate } from "../features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import human from "../images/human.png";
import Compressor from "compressorjs";
import styled from "styled-components";
import Button from "../comportnents/Button";

export const UserProfile = () => {
  const userIcon = useSelector((state: RootState) => state.auth.userIcon);
  const storage = getStorage();
  const dispatch = useDispatch();
  const [image, setImage] = useState<any>("");
  const [changeUserName, setChangeUserName] = useState<any>("");

  useEffect(() => {
    // ユーザー情報を取得・セットする
    const auth = getAuth();
    onAuthStateChanged(auth, (user: any) => {
      if (user) {
        console.log(user);
        setChangeUserName(user.displayName);
      }
    });
  }, []);

  const onFileInputChange = (e: any) => {// アップロードする画像を選択・リサイズする関数
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

  const handleSubmit = (e: any) => {// アイコン画像変更用関数
    // 画像をアップロードする
    if (image) {
      e.preventDefault();
      console.log(image);
      const storageRef = ref(storage, `images/${image.name}`);
      uploadBytes(storageRef, image)
        .then(() => {
          console.log("画像アップロード成功！");
          return getDownloadURL(storageRef); //画像URLゲット
        })
        .then((url) => {
          // 画像URLをユーザー情報にセットする
          console.log(url);
          const auth = getAuth();
          if (auth.currentUser) {
            updateProfile(auth.currentUser, {
              //ユーザーアカウントにセット
              photoURL: url,
            })
              .then(() => {
                console.log("ユーザーアカウントに画像URLセット完了！");
                setImage("");
                dispatch(
                  // 画像URLをグローバルステートにセット
                  iconUpload({
                    usericon: url,
                  })
                );
              })
              .catch((error) => {
                console.log(error);
                console.log("ユーザーアカウントに画像URLセット失敗");
              });
          }
        })
        .catch((error) => {
          console.log(error);
          console.log("画像アップロード失敗");
        });
    }
  };

  const onClickNameUpdate = () => {// 名前変更用関数
    const auth = getAuth();
    if (auth.currentUser) {
      updateProfile(auth.currentUser, {
        //ユーザーアカウントにセット
        displayName: changeUserName,
      }).then(()=>{
        dispatch(nameUpDate({name:changeUserName}));
      }
      )
    }

  };

  return (
    <SMain>
      <SCentercontainer>
        <SH2>ユーザープロフィール</SH2>
      </SCentercontainer>
      <form onSubmit={handleSubmit}>
        <details>
          <SSummary>
            <SItem>
              <div>
                {userIcon ? (
                  <SUsericon
                    style={{ backgroundImage: `url(${userIcon})` }}
                  ></SUsericon>
                ) : (
                  <SUsernoneicon
                    src={human}
                  ></SUsernoneicon>
                )}
              </div>

              <SImagetext className=".item__text">
                <p>アイコン画像の変更</p>
              </SImagetext>
            </SItem>
          </SSummary>
          <SCentercontainer>
            <SImageinput
              accept="image/png, image/jpeg"
              type="file"
              onChange={onFileInputChange}
            />
            {image && (
              <img
                src={window.URL.createObjectURL(image)}
                className="icon-image"
                alt="user-icon"
              />
            )}
            {image && <Button>アイコン変更</Button>}
          </SCentercontainer>
        </details>
      </form>
      <SNameinputcontainer>
        <SLabel>名前</SLabel>
        <SNameinput
          type="text"
          value={changeUserName}
          onChange={(e) => setChangeUserName(e.target.value)}
        ></SNameinput>
        <SCentercontainer>
          <Button onClick={onClickNameUpdate}>名前変更</Button>
        </SCentercontainer>
      </SNameinputcontainer>
      <br />
    </SMain>
  );
};

const SMain = styled.main`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 500px;
  margin: 8px auto;
  padding: 16px;
`;

const SCentercontainer = styled.div`
  text-align: center;
`;

const SH2 = styled.h2`
  font-weight: normal;
  font-size: 20px;
`;

const SUsericon = styled.div`
  height: 256px;
  width: 256px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center;
`;

const SUsernoneicon = styled.img`
  height: 256px;
  width: 256px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center;
`;

const SSummary = styled.summary`
  list-style: none;
  &:hover {
    opacity: 0.8;
  }
`;

const SItem = styled.div`
  max-width: 256px;
  max-height: 256px;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SImagetext = styled.div`
position: absolute;
z-index: 1;
border-radius: 50%;
width: 100%;
height: 100%;
top: 0;
left: 0;
text-align: center;
color: #fff;
background-color: rgba(0, 0, 0, 0.6);
transition: 0.3s ease-in-out;
opacity: 0;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
&:hover {
  opacity: 1;
}

`;

const SLabel = styled.label`
  margin-top: 16px;
`;

const SImageinput = styled.input`
  margin: 16px 0;
`;

const SNameinput = styled.input`
  max-width: 300px;
  width: 90%;
  border: 1px solid gray;
  border-radius: 8px;
  height: 24px;
  font-size: large;
  &:focus {
    outline: none;
  }
`;

const SNameinputcontainer = styled.div`
  max-width: 300px;
  margin: 16px auto;
`;
