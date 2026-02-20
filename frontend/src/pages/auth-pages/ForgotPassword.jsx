import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setUserData } from '../../redux/userSlice';
import { TailSpin } from 'react-loader-spinner';
import { FaRegEye ,FaRegEyeSlash } from "react-icons/fa";
import { IoArrowBackSharp } from 'react-icons/io5';
import OTPComponent from '../../components/authComponents/OTPComponent';


const ForgotPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const [step,setStep] = useState(0);
    const [isEmail,setIsEmail] = useState(true);
    const [input,setInput] = useState('');
    const [otp,setOtp] = useState('');
    const [password,setPassword] = useState('');
    const [conformPassword,setConformPassword] = useState('');
    const [showError,setShowError] = useState(false);
    const [showPassword,setShowPassword] = useState('');
    const [loading,setLoading] = useState(false);
    const [showResendOtp,setShowResendOtp] = useState(false);


    const sendOtpFnc = async()=>{
        setShowError('');
        setLoading(true);
        try {
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/sendOtp`,{input,isEmail},{withCredentials:true});
            console.log(result.data);
            setLoading(false);
            setStep(1);
        } catch (error) {
            setLoading(false);
            console.log(error);
            setShowError(error.response.data.message);
        }  
    }

    const otpVerificationFnc = async()=>{
        setShowError('');
        if(otp.length != 4){
            setShowError('Fill the OTP');
            return
        }
        try {
            setLoading(true);
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/otpVerification`,{input, isEmail, otp},{withCredentials:true});
            console.log(result.data);
            setLoading(false);
            setStep(2);
            setShowError('');
        } catch (error) {
            setLoading(false);
            console.log(error);
            setShowError(error.response.data.message);
        }  
    }

    const resetPasswordFnc = async()=>{
        setShowError('');
        if(password.length < 8){
            setShowError('Password length should greater than 8');
            return
        }
        if(password !== conformPassword){
            setShowError('Password and ConformPassword are Different');
            return
        }
        try {
            setLoading(true);
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/resetPassword`,{input, isEmail, password},{withCredentials:true});
            console.log(result.data);
            dispatch(setUserData(result.data));
            setLoading(false);
            navigate('/');
        } catch (error) {
            setLoading(false);
            console.log(error);
            setShowError(error.response.data.message);
        }  
    }

    const clickEnterFnc = (e)=>{
        if (e.key == 'Enter') {
            if (step == 0) {
                sendOtpFnc();
            }else if (step == 1) {
                otpVerificationFnc();
            }else if (step == 2) {
                resetPasswordFnc();
            }
        }
    }


  return (
    <div className='h-screen w-screen flex justify-center items-center bg-gray-900 p-6'>
         
         {step == 0 && <div className='max-w-[430px] w-full p-6 flex-col justify-center items-center bg-gray-950 relative rounded-2xl'>
        <IoArrowBackSharp onClick={()=> navigate(-1)} className=' hover:bg-gray-950 active:scale-90  absolute left-5 top-5 text-3xl rounded cursor-pointer'/>
            
        <h1 className=' text-center font-bold text-2xl text-white mb-6 cursor-default'>Forgot Password!</h1>

        <div className='w-full mb-8 flex justify-center gap-8'>
          <button onClick={()=>setIsEmail(true)} className={`${isEmail? 'bg-gray-100 text-gray-950 ':' bg-gray-950  text-gray-100 shadow-white'} font-semibold text-sm rounded py-1 px-4 border-[1px] border-gray-600 shadow-md `}>Email</button>
          <button onClick={()=>setIsEmail(false)} className={`${!isEmail? 'bg-gray-100 text-gray-950 ':' bg-gray-950  text-gray-100 shadow-white'} font-semibold text-sm rounded py-1 px-4 border-[1px] border-gray-600 shadow-md`}>UserName</button>
        </div>

         <div className={` ${input?'border-[1.5px] border-gray-400 bg-gray-950':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-4`}>
          <h6 className={`${!input?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-gray-950  px-1`}>{isEmail?'Enter Email ....':'Enter UserName ....'}</h6>
          <input type= {isEmail?'email':'text'} autoFocus value={input} onChange={(e)=>setInput(e.target.value)} placeholder={isEmail?'Enter Email ....':'Enter UserName ....'} className={` ${input?'bg-gray-950':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>
        

        <p onClick={()=>navigate('/signup')} className='text-white text-sm text-center cursor-pointer'> Have not any Account <span className='text-blue-600 underline font-semibold'>SignUp</span> </p>
       {/* showError */}
       {showError && <p className='text-sm text-red-800 text-center font-semibold mt-2'>Error : {showError}</p>}
       
       <div className='w-full text-center flex justify-center' ><button disabled={loading} onClick={sendOtpFnc} onKeyDown={clickEnterFnc} className='w-[70%] text-center flex justify-center rounded-full bg-blue-50 text-black font-bold p-1.5 mt-4 '> {loading?<TailSpin
        height="25"
        width="25"
        color="#111"
        ariaLabel="tail-spin-loading"
         visible={loading}
      />:'Send OTP' }</button>
</div>
      </div>} 

      {step == 1 && <div className='max-w-[430px] w-full p-6 flex-col justify-center items-center bg-gray-950 relative rounded-2xl'>
        <IoArrowBackSharp onClick={()=> setStep(0)} className=' hover:bg-gray-950 active:scale-90  absolute left-5 top-5 text-3xl rounded cursor-pointer'/>
        
        <h1 className=' text-center font-bold text-2xl text-white mb-4 cursor-default'>Enter OTP</h1>

        <p className='text-base text-gray-100 text-center font-semibold cursor-default'>OTP send at your email</p>
        <p className='text-xs text-gray-300 text-center mb-5 cursor-default'>OTP expire after 90 second</p>

         {/* <div className={` ${otp?'border-[1.5px] border-gray-400 bg-gray-950':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-4`}>
          <h6 className={`${!otp?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-gray-950  px-1`}>Enter OTP ....</h6>
          <input type= 'number' value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder='Enter OTP ....' className={` ${otp?'bg-gray-950':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
            <OTPComponent setOtp ={setOtp} />
        </div> */}
            <OTPComponent setOtp ={setOtp} setShowResendOtp={setShowResendOtp}/>

        
        {showResendOtp && <p onClick={()=>{sendOtpFnc();setStep(1)}} className='  active:scale-90 text-sm text-blue-800 text-center w-36 font-semibold underline rounded-md transition-all -ml-4 mb-1.5 -mt-1 cursor-pointer'>Resend OTP ?</p>}

       {/* showError */}
       {showError && <p className='text-sm text-red-800 text-center font-semibold mt-2'>Error : {showError}</p>}
       
       <div className='w-full text-center flex justify-center' ><button disabled={loading} onClick={otpVerificationFnc} onKeyDown={clickEnterFnc} className='active:scale-95 hover:scale-105 transition-all w-[70%] text-center flex justify-center rounded-full bg-blue-50 text-black font-bold p-1.5 mt-4 '> {loading?<TailSpin
        height="25"
        width="25"
        color="#111"
        ariaLabel="tail-spin-loading"
         visible={loading}
      />:'Next' }</button>
</div>
      </div>} 

      {step == 2 && <div className='max-w-[430px] w-full p-6 flex-col justify-center items-center bg-gray-950 rounded-2xl'>
        <h1 className=' text-center font-bold text-2xl text-white mb-6 cursor-default'>Reset Password</h1>

         <div className={` ${password?'border-[1.5px] border-gray-400 bg-gray-950':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-4`}>
          <h6 className={`${!password?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-gray-950  px-1`}>Enter Password ....</h6>
          <div className='absolute right-2 h-[90%] px-1- flex items-center text-white cursor-pointer' onClick={()=>setShowPassword((e)=>!e)}>{showPassword?<FaRegEyeSlash />:<FaRegEye />}</div>
          <input type={showPassword?'text':'password'} autoFocus value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter Password ....' className={` ${password?'bg-gray-950':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>
        <div className={` ${conformPassword?'border-[1.5px] border-gray-400 bg-gray-950':'bg-gray-700'} w-full rounded-lg relative  px-2.5 py-1 my-4`}>
          <h6 className={`${!conformPassword?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-gray-950  px-1`}>Enter ConformPassword ....</h6>
            <div className='absolute right-2 h-[90%] px-1- flex items-center text-white cursor-pointer' onClick={()=>setShowPassword((e)=>!e)}>{showPassword?<FaRegEyeSlash />:<FaRegEye />}</div>
          <input type={showPassword?'text':'password'}  value={conformPassword} onChange={(e)=>setConformPassword(e.target.value)} placeholder='Enter ConformPassword ....' className={` ${conformPassword?'bg-gray-950':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>
        
       {/* showError */}
       {showError && <p className='text-sm text-red-800 text-center font-semibold mt-2'>Error : {showError}</p>}
       
       <div className='w-full text-center flex justify-center' ><button disabled={loading} onClick={resetPasswordFnc} onKeyDown={resetPasswordFnc} className='w-[70%] text-center flex justify-center rounded-full bg-blue-50 text-black font-bold p-1.5 mt-4 '> {loading?<TailSpin
        height="25"
        width="25"
        color="#111"
        ariaLabel="tail-spin-loading"
         visible={loading}
      />:'Reset Password' }</button>
</div>
      </div>}
         
          </div>
  )
}

export default ForgotPassword