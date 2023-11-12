import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

export const Home = () => {
    const [uid,setUid] = useState("");

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
    {`${uid}`}
    
    </>

    )
}