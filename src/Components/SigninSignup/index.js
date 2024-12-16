import React, { useState } from 'react'
import './style.css'
import InputComponent from '../Input'
import ButtonComponent from '../Button'
import { toast } from 'react-toastify'
import {auth, db, provider} from '../../Pages/firebase'
import {createUserWithEmailAndPassword } from "firebase/auth";
import {signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from "firebase/firestore";
import {signInWithPopup, GoogleAuthProvider } from "firebase/auth";


function SigninSignup() {
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [pwd,setPwd]=useState("")
  const [cnfpwd,setCnfpwd]=useState("")
  const [loading,setLoading]=useState(false)
  const [loginform,setLoginform]=useState(false)
  const navigate= useNavigate();

  function signupWithEmail(){
    setLoading(true)
    console.log("Name",name)
    console.log("Email",email)
    console.log("password",pwd)
    console.log("confirm password",cnfpwd)

    if(name!=="" &&email!=="" &&pwd!=="" &&cnfpwd!==""){
       //authenticate the user
       if(pwd==cnfpwd){
        createUserWithEmailAndPassword(auth, email, pwd)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("user--",user)
          toast.success("User created !")
          setLoading(false)
          setName("")
          setEmail("")
          setPwd("")
          setCnfpwd("")
          createDoc(user)
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage)
          setLoading(false)
        });
       }else{
        toast.error("Password and Confirm password don't matched! ")
        setLoading(false)
       }
    }
    else{
      toast.error("All fields are required")
      setLoading(false)
    }
  }

  async function createDoc(user){
    setLoading(true);
    if(!user) return;
    const userRef=doc(db,"users",user.uid)
    const userData=await getDoc(userRef);
    
    if(!userData.exists()){
      const {displayName,email,photoURL}=user
      const createdAt=new Date();
    
    try{
      await setDoc(doc(db, "users", user.uid), {
        name:user.displayName?user.displayName:name,
        email:user.email,
        photoURL:user.photoURL?user.photoURL:"",
        createdAt:new Date(),
      })
      toast.success("Account created!");
      setLoading(false)
    }catch(e){
      setLoading(false)
      toast.error(e.message)
    }
  }else{
    setLoading(false)
    toast.error("Account already Exist !")
  }
  }

  function loginWithEmail(){
    setLoading(true)
     console.log(email)
     console.log(pwd)
  
    if(email!==""&&pwd!==""){
      signInWithEmailAndPassword(auth, email, pwd)
  .then((userCredential) => {
    const user = userCredential.user;
    toast.success("User logged in Successfully!")
    console.log("user--",user)
    setLoading(false)
    navigate('/dashboardpage')
  })
  .catch((error) => {
    setLoading(false)
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage)
  });
 }else{
  setLoading(false)
  toast.error("Both Email and Password are required")
 }
}

  function googleAuth(){
    setLoading(true)
    try{
      signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("User--",user)
        createDoc(user)
        toast.success("User Authenticated!")
        setLoading(false)
        navigate('/dashboardpage')
        // IdP data available using getAdditionalUserInfo(result)
      }).catch((error) => {
        // Handle Errors here.
        setLoading(false)
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage)
      });
    }
    catch(e){
      setLoading(false)
      toast.error(e.message)
    }
   
  }
  return (
    <>
    {loginform?(<div className='signup-wrapper'>
      <h2 className='title'>Login on <span style={{color:"var(--theme)"}}>Financely</span></h2>
      <form>
       <InputComponent label={"Email Id"} 
        state={email} 
        setState={setEmail} 
        placeholder={"Johndoe@gmail.com"} />

       <InputComponent label={"Password"} 
        state={pwd} 
        type={"password"}
        setState={setPwd} 
        placeholder={"Examle@123"} />

        <ButtonComponent disabled={loading} text={loading?"Loading...":"Login using Email and Password"} onClick={loginWithEmail}/>
        <p style={{textAlign:"center"}}>Or</p>
        <ButtonComponent onClick={googleAuth} disabled={loading} text={loading?"Loading...":"Login using Google"} blue={true}/>
        <p style={{textAlign:"center",cursor:"pointer"}} onClick={()=>setLoginform(!loginform)}>Or Don't have an Account? Click Here</p>
      </form>
    </div>):(<div className='signup-wrapper'>
      <h2 className='title'>Sign Up on <span style={{color:"var(--theme)"}}>Financely</span></h2>
      <form>
        <InputComponent label={"Full Name"} 
        state={name} 
        setState={setName} 
        placeholder={"John Doe"} />

       <InputComponent label={"Email Id"} 
        state={email} 
        setState={setEmail} 
        placeholder={"Johndoe@gmail.com"} />

       <InputComponent label={"Password"} 
        state={pwd} 
        type={"password"}
        setState={setPwd} 
        placeholder={"Examle@123"} />

       <InputComponent label={"Confirm Password"} 
        state={cnfpwd} 
        type={"password"}
        setState={setCnfpwd} 
        placeholder={"Examle@123"} />

        <ButtonComponent disabled={loading} text={loading?"Loading...":"Signup using Email and Password"} onClick={signupWithEmail}/>
        <p style={{textAlign:"center"}}>Or</p>
        <ButtonComponent onClick={googleAuth} disabled={loading} text={loading?"Loading...":"Signup using Google"} blue={true}/>
        <p style={{textAlign:"center",cursor:"pointer"}} onClick={()=>setLoginform(!loginform)}>Or Have an Account already? Click Here</p>
      </form>
    </div>)}
    
    </>
  )
}

export default SigninSignup