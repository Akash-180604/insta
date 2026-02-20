import React, { useState,} from 'react'
import { TailSpin } from 'react-loader-spinner'
import { FaRegEye ,FaRegEyeSlash } from "react-icons/fa";
import axios from 'axios'

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../redux/userSlice';
import GoogleAuthBtn from '../../components/authComponents/GoogleAuthBtn';


 

const SignIn = () => {
  const [input, setInput] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword,setShowPassword] = useState(false)
  const [loading,setLoading] = useState(false)
  const [isEmail,setIsEmail] = useState(true)
  const [showError,setShowError] = useState('')

  const navigate = useNavigate();
  const dispatch = useDispatch();

const signInFnc =async()=>{
  setLoading(true);
  try {
    if(!input||!password){
      setShowError(`${isEmail?'email':'userName'} and password both requard`);
      setLoading(false);
      return
    }
    const result=await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/login`,{input,password,isEmail},{withCredentials:true})
  console.log(result.data)
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

const clickEnterFnc = (e)=>{
  if(e.key === 'Enter'){
    signInFnc();
    
  }
}

  return (
    <div className='h-screen w-screen flex justify-center items-center bg-gray-900 p-6'>
      <div className='max-w-[430px] w-full p-6 flex-col justify-center items-center bg-gray-950 rounded-2xl'>
        <h1 className=' text-center font-bold text-2xl text-white mb-6 cursor-default'>Welcome Back!</h1>

        <div className='w-full mb-8 flex justify-center gap-8'>
          <button onClick={()=>setIsEmail(true)} className={`${isEmail? 'bg-gray-100 text-gray-950 ':' bg-gray-950  text-gray-100 shadow-white'} font-semibold text-sm rounded py-1 px-4 border-[1px] border-gray-600 shadow-md `}>Email</button>
          <button onClick={()=>setIsEmail(false)} className={`${!isEmail? 'bg-gray-100 text-gray-950 ':' bg-gray-950  text-gray-100 shadow-white'} font-semibold text-sm rounded py-1 px-4 border-[1px] border-gray-600 shadow-md`}>UserName</button>
        </div>

         <div className={` ${input?'border-[1.5px] border-gray-400 bg-gray-950':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-4`}>
          <h6 className={`${!input?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-gray-950  px-1`}>{isEmail?'Enter Email ....':'Enter UserName ....'}</h6>
          <input type= {isEmail?'email':'text'} value={input} onChange={(e)=>setInput(e.target.value)} placeholder={isEmail?'Enter Email ....':'Enter UserName ....'} className={` ${input?'bg-gray-950':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>
        <div className={` ${password?'border-[1.5px] border-gray-400 bg-gray-950':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-4`}>
          <h6 className={`${!password?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-gray-950  px-1`}>Enter your password....</h6>
          <div className='absolute right-2 h-[90%] px-1- flex items-center text-white cursor-pointer' onClick={()=>setShowPassword((e)=>!e)}>{showPassword?<FaRegEyeSlash />:<FaRegEye />}</div>
          <input type={`${showPassword?'text':'password'}`} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter your password....' className={` ${password?'bg-gray-950':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>

        {/* Forgot Password */}
        <p onClick={()=>navigate('/forgot-password')} className='active:scale-90 text-sm text-blue-800 text-center w-36 font-semibold underline rounded-md transition-all mb-4 cursor-pointer'>Forgot Password ?</p>

        <p onClick={()=>navigate('/signup')} className='text-white text-sm text-center cursor-pointer'> Have not any Account <span className='text-blue-600 underline font-semibold'>SignUp</span> </p>
       
       
       {/* showError */}
       {showError && <p className='text-sm text-red-800 text-center font-semibold mt-2'>Error : {showError}</p>}
       
       <div className='hover:scale-105 active:scale-95 transition w-full text-center flex justify-center' ><button disabled={loading} onClick={signInFnc} onKeyDown={clickEnterFnc} className='w-[70%] text-center flex justify-center rounded-full bg-blue-50 text-black font-bold p-1.5 mt-4 '> {loading?<TailSpin
        height="25"
        width="25"
        color="#111"
        ariaLabel="tail-spin-loading"
         visible={loading}
      />:'Sign In' }</button>
</div>

        <div className='flex items-center px-2 cursor-default my-2'>
          <hr className='flex-1 bg-gray-800'/>
          <p className='text-xs mx-2'>OR</p>
          <hr className='flex-1 bg-gray-800' />
        </div>
        
        <GoogleAuthBtn/>

      
      </div>
      </div>
  )
}

export default SignIn