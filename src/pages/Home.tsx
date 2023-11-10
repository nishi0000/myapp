import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';


export const Home = () => {
    const [test,setTest] = useState("");
    
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(()=>{
        if (user) {
            setTest("ログイン中");
          } else {
            setTest("ログアウト中")
          }
    },[])





    return(<>

    <p>Homeだよー</p>
    <p>{`${test}`}</p>

    
    </>

    )
}