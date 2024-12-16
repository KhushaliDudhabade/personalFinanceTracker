import React, { useEffect } from 'react'
import './style.css'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Pages/firebase';
import { useNavigate } from 'react-router-dom';
import {signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import userImage from './user.jpg';

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate=useNavigate();
  useEffect(()=>{
    if(user){
      navigate('/dashboardpage')
    }
  },[user,loading,navigate])

  const logoutFnc = () => {
    try {
      signOut(auth)
        .then(() => {
          navigate('/'); // Navigate after sign-out is successful
          toast.success("Logged out successfully");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  };
  
  return (
    <div className='navbar'>
      <p className='logo'>Financely.</p>
      {user &&(<div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
        <img src={user.photoURL?user.photoURL:userImage} alt="User" height="32" width="32" style={{borderRadius:"50%"}}></img>
        <p onClick={logoutFnc} className='logout'>Logout</p></div>)}
    </div>
  )
}

export default Header