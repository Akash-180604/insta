import React, { useState,} from 'react'
import { FaRegEye ,FaRegEyeSlash } from "react-icons/fa";
import { TailSpin } from 'react-loader-spinner'
import { useDispatch } from 'react-redux';
import axios from 'axios'

import { useNavigate } from 'react-router-dom';
import { setUserData } from '../../redux/userSlice';
import GoogleAuthBtn from '../../components/authComponents/GoogleAuthBtn';
import { useEffect } from 'react';
 

const SignUp = () => {
      const [firstName, setFirstName] = useState("")
      const [lastName, setLastName] = useState("")
      const [userName, setUserName] = useState("")
      const [email, setEmail] = useState("")
      const [password, setPassword] = useState("")
      const [showPassword,setShowPassword] = useState(false)
      const [loading,setLoading] = useState(false)  
      const [showError,setShowError] = useState('')
      const [isUseNameExists,setIsUseNameExists] = useState(false)


  const dispatch = useDispatch()
  const navigate = useNavigate();


const signupFnc = async (e)=>{
  e.preventDefault();
  setLoading(true);
   if(!firstName.trim() ||!userName.trim() ||!email.trim() ||!password.trim()){
      setShowError('All input requard')
        setLoading(false);
      return
    }
    if(!email.endsWith('@gmail.com')){
      setShowError('Enter Currect Email !')
        setLoading(false);
      return
    }
  try {
    const result=await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/signup`,{firstName,lastName,userName,email,password},{withCredentials:true})
  console.log(result.data);
    dispatch(setUserData(result.data));
    setShowError('')
    navigate('/')
  setLoading(false);

  } catch (error) {

    setShowError(error.response.data.message);
    setLoading(false);
    console.log(error);
  }
}

// useEffect(()=>{
  
// const isUseNameExistsFnc = async ()=>{
  
//   try {
//     // if(userName.trim())return
//   const result=await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/isUseNameExists`,{userName},{withCredentials:true});
//   console.log(result.data);
//   setIsUseNameExists(result.data.exist);
//   } catch (error) {
//     console.log(error); 
//   }
// }
// isUseNameExistsFnc();
// },[userName])

//add Debounce

useEffect(() => {
    // If input is cleared, we don't need to fetch anything
    if (!userName.trim()) {
        return;
    }

    const delayDebounceFn = setTimeout(async () => {
         try {
    // if(userName.trim())return
  const result=await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/isUseNameExists`,{userName},{withCredentials:true});
  console.log(result.data);
  setIsUseNameExists(result.data.exist);
  } catch (error) {
    console.log(error); 
  }
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
}, [userName]);

const clickEnterFnc = (e)=>{
  if(e.key === "Enter"){    
    signupFnc();
  }
}

  return (
    <div  className='h-screen w-screen flex justify-center items-center p-6 bg-gray-900 '>
      <form onKeyDown={clickEnterFnc} className='max-w-[430px] w-full px-6 flex-col justify-center items-center py-6 bg-gray-950 rounded-2xl'>
        <h1 className=' text-center font-bold text-2xl text-white mb-6 cursor-default'>Create an Account</h1>

        <div className={` ${firstName?'border-[1.5px] border-gray-400 bg-gray-950':'bg-gray-700'} w-full rounded-lg relative  px-2.5 py-1 my-3.5`}>
          <h6 className={`${!firstName?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-gray-950 gray-950  px-1`}>Enter your First Name*....</h6>
          <input type='text' value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder='Enter your First Name*....' className={` ${firstName?'bg-gray-950':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>

       <div className={` ${lastName?'border-[1.5px] border-gray-400 bg-gray-950':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-3.5`}>
          <h6 className={`${!lastName?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-gray-950 px-1`}>Enter your Last Name....</h6>
          <input type="text" value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder='Enter your Last Name....' className={` ${lastName?'bg-gray-950':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>
       <div className={` ${userName?'border-[1.5px] border-gray-400 bg-gray-950':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-3.5`}>
          <h6 className={`${!userName?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-gray-950 px-1`}>Enter your UserName*....</h6>
          <input type="text" value={userName} onChange={(e)=>setUserName(e.target.value)} placeholder='Enter your UserName*....' className={` ${userName?'bg-gray-950':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>

          {userName.trim() && isUseNameExists && <p className='text-xs text-red-800 font-semibold -my-2.5'> * This UserName already Exists try another one</p>}

         <div className={` ${email?'border-[1.5px] border-gray-400 bg-gray-950':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-3.5`}>
          <h6 className={`${!email?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-gray-950 px-1`}>Enter your email*....</h6>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter your email*....' className={` ${email?'bg-gray-950':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>
        <div className={` ${password?'border-[1.5px] border-gray-400 bg-gray-950':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-3.5`}>
          <h6 className={`${!password?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-gray-950 px-1`}>Enter your password*....</h6>
          <div className='absolute right-2 h-[90%] px-1- flex items-center text-white cursor-pointer' onClick={()=>setShowPassword((e)=>!e)}>{showPassword?<FaRegEyeSlash />:<FaRegEye />}</div>
          <input type={`${showPassword?'text':'password'}`} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter your password*....' className={` ${password?'bg-gray-950':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>
         
        {/* showError */}
       {showError && <p className='text-sm text-red-800 text-center font-semibold mt-2'>Error : {showError}</p>}
       
        <p onClick={()=>navigate('/signin')} className='text-white text-sm text-center cursor-pointer'>Alradey have an Account <span className='text-blue-600 underline font-semibold cursor-pointer'>SignIn</span> </p>
       
       <div className='hover:scale-105 active:scale-95  transition w-full text-center flex justify-center' >
        <button disabled={loading} onClick={signupFnc} className='w-[70%] text-center flex justify-center rounded-full bg-blue-50 text-black font-bold p-1.5 mt-4 '> {loading?<TailSpin
        height="25"
        width="25"
        color="#fff"
        ariaLabel="tail-spin-loading"
        //  visible={!loading}
      />:'Sign Up' }
      </button>
</div>

<div className='flex items-center px-2 cursor-default my-2'>
  <hr className='flex-1 bg-gray-800'/>
  <p className='text-xs mx-2'>OR</p>
  <hr className='flex-1 bg-gray-800' />
</div>

<GoogleAuthBtn/>

      
      </form>
      </div>
  )
}

export default SignUp