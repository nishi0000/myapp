import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// @ts-ignore
import { RootState } from 'src/features/AuthSlice';


export const Home = () => {
    const [uid,setUid] = useState("");
    const token = useSelector((state: RootState) => state.auth.userToken);

    useEffect(()=>{
      const auth = getAuth();
      onAuthStateChanged(auth, (user:any) => {
          if (user) {
            const uid = user.uid;
            console.log(user);
            setUid(uid);
          }
        });

    },[]);


    return(<>

    <p>Homeだよー</p>
    {`${uid}`}<br />
    {`${token}`}
    
    </>

    )
}