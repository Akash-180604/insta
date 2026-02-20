import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { TailSpin } from 'react-loader-spinner'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../../redux/userSlice'
import { useNavigate } from 'react-router-dom'

const SetUsername = () => {
      const dispatch = useDispatch();
      const navigate = useNavigate();


          const [userName, setUserName] = useState("")
          const [loading,setLoading] = useState(false)  
      const [showError,setShowError] = useState('')
      const [isUseNameExists,setIsUseNameExists] = useState(false)
    
    const {userData} = useSelector(state => state.user);

      const setUsernameFnc = async (e)=>{
  e.preventDefault();
  setLoading(true);
   if(!userName.trim()){
      setShowError('Enter User Name')
        setLoading(false);
      return
    }
    
  try {
    const result=await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/setUseName`,{userName,userId:userData._id},{withCredentials:true});
  console.log(result.data);
    dispatch(setUserData(result.data));
    setShowError('')
    navigate('/')
  setLoading(false);

  } catch (error) {
    setLoading(false);
    console.log(error);
    setShowError(error.response.data.message);
    
  }
}


// Add Debounce
useEffect(() => {
    // If input is cleared, we don't need to fetch anything
    if (!userName.trim()) {
        return;
    }

    const delayDebounceFn = setTimeout(async () => {
    setShowError('')
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

  return (
    <div className='h-screen w-screen flex justify-center items-center p-6  '>
      <form className='max-w-[430px] w-full p-6 flex-col justify-center items-center gap-3 bg-gray-950 rounded-xl'>
        
        <h1 className=' text-center font-bold text-xl text-white mb-8 cursor-default'>Enter a User Name </h1>
        
        <div className={` ${userName?'border-[1.5px] border-gray-400 bg-gray-950':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-6`}>
          <h6 className={`${!userName?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-gray-950 px-1`}>Enter your UserName*....</h6>
          <input type="text" value={userName} onChange={(e)=>setUserName(e.target.value)} placeholder='Enter your UserName*....' className={` ${userName?'bg-gray-950':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>

       {userName.trim() && isUseNameExists && <p className='text-xs text-red-800 font-semibold my-2'> * This UserName already Exists try another one</p>}
       {showError && <p className='text-sm text-red-800 text-center font-semibold -m-2'>Error : {showError}</p>}



        <button disabled={loading} onClick={setUsernameFnc} className='hover:scale-105 active:scale-90 w-[70%] text-center flex justify-center rounded-full bg-blue-50 text-black font-bold mx-auto p-1.5 mt-6  '> {loading?<TailSpin
        height="25"
        width="25"
        color="#000"
        ariaLabel="tail-spin-loading"
        //  visible={!loading}
      />:'Set User Name' }
      </button>
        </form>
    </div>
  )
}

export default SetUsername