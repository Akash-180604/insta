import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import dp from '../assets/dp.webp'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { IoArrowBackSharp } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'


const EditPage = () => {

        const {userData} = useSelector(state=>state.user);


          const [firstName, setFirstName] = useState(userData.firstName || '')
          const [lastName, setLastName] = useState(userData.lastName || '')
          const [userName, setUserName] = useState(userData.userName || '')
          const [gender, setGender] = useState(userData.gender || '')
          const [bio, setBio] = useState(userData.bio || '')
          const [frontendFile,setFrontendFile] = useState(userData.profileImage || dp)
          const [backendFile,setBackendFile] = useState(null)
          const [loading,setLoading] = useState(false)
          const [isUseNameExists,setIsUseNameExists] = useState(false)

          

        const fileRef = useRef();
        const navigate = useNavigate();
        const dispatch = useDispatch();



    const editFnc = async()=>{

      try {
    setLoading(true);
   if(!firstName||!lastName||!userName||!gender){
      console.error('All input requard');
      return
    }
      const formData = new FormData();
        formData.append('firstName',firstName);
        formData.append('lastName',lastName);
        formData.append('userName',userName);
        formData.append('bio',bio);
        formData.append('gender',gender);
        
        if(backendFile){
        formData.append('profileImage',backendFile);
        }
        const result= await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/edit`,formData,{withCredentials:true})
      console.log(result.data)
       dispatch(setUserData(result.data));
    navigate(-1);
  setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
    setLoading(false);
    
  }
    }
const setFileFnc = (e)=>{
  const file = e.target.files[0];
    setBackendFile(file);
    setFrontendFile(URL.createObjectURL(file));
}

useEffect(()=>{
const isUseNameExistsFnc = async ()=>{
  try {
    if (userName==userData?.userName) {
   return setIsUseNameExists(false);
    }
    // if(userName.trim())return
  const result=await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/isUseNameExists`,{userName},{withCredentials:true});
  console.log(result.data);
  setIsUseNameExists(result.data.exist);
  } catch (error) {
    console.log(error); 
  }
}

isUseNameExistsFnc();
},[userName])

return (
    <div  className='min-h-screen w-screen flex justify-center items-center p-6 pb-16 bg-gray-900 '>
      <div onClick={()=>navigate(-1)} className='opacity-50 z-10 absolute  w-screen min-h-screen flex-1 '></div>
      <div className='relative max-w-[430px] w-full p-6 flex-col justify-center items-center  bg-black rounded-2xl z-20'>
        <IoArrowBackSharp onClick={()=> navigate(-1)} className=' hover:bg-gray-950   absolute left-5 top-6 text-3xl rounded cursor-pointer'/>

        <h1 className=' text-center font-bold text-2xl text-white mb-6'>Edit Your Profile</h1>

      <input type="file" ref={fileRef} hidden accept="image/*" onChange={setFileFnc} />
        <div className='w-full text-center flex justify-center my-4 '>
          <div onClick={()=>fileRef.current.click()} className='w-[11vh] h-[11vh] relative rounded-full flex justify-center border-[0.5px] border-white cursor-pointer group'>
            <img src={frontendFile} alt="Profile Image" onClick={()=>fileRef.current.click()} className='w-full h-full object-cover rounded-full overflow-hidden' />
          <div className='group-hover:block hidden absolute z-20 h-full w-full bg-[#1211114A]  '><CiCirclePlus className='fill-white font-extrabold opacity-100 text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/></div>
          </div>
        </div>

        <div className={` ${firstName?'border-[1.5px] border-gray-400 bg-black':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-4`}>
          <h6 className={`${!firstName?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-black  px-1`}>Enter your First Name....</h6>
          <input type="text" value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder='Enter your First Name....' className={` ${firstName?'bg-black':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>

       <div className={` ${lastName?'border-[1.5px] border-gray-400 bg-black':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-4`}>
          <h6 className={`${!lastName?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-black  px-1`}>Enter your Last Name....</h6>
          <input type="text" value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder='Enter your Last Name....' className={` ${lastName?'bg-black':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>
       <div className={` ${userName?'border-[1.5px] border-gray-400 bg-black':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-4`}>
          <h6 className={`${!userName?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-black  px-1`}>Enter your UserName....</h6>
          <input type="text" value={userName} onChange={(e)=>setUserName(e.target.value)} placeholder='Enter your UserName....' className={` ${userName?'bg-black':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>
        
        {userName.trim() && isUseNameExists && <p className='text-xs text-red-800 font-semibold -mt-2.5'> * This UserName already Exists try another one</p>}

        <div className={` ${gender?'border-[1.5px] border-gray-400 bg-black':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-4`}>
            <label htmlFor='gender-select' className={`${!gender?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-black  px-1`}>Enter your gender....</label>
        <select name="" id="" value={gender} onChange={(e)=>setGender(e.target.value)} className={` ${gender?'bg-black':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm `}>
          <option value="" disabled selected>-- Select a gender --</option>
          <option value="male"> Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
          </div>
        
        <div className={` ${bio?'border-[1.5px] border-gray-400 bg-black':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-4`}>
          <h6 className={`${!bio?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-black  px-1`}>Enter your bio....</h6>
          <input type="text" multiple value={bio} onChange={(e)=>setBio(e.target.value)} placeholder='Enter your bio....' className={` ${bio?'bg-black':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>
       <div className='w-full text-center flex justify-center' ><button disabled={loading} onClick={editFnc}  className='w-[70%] text-center flex justify-center rounded-full bg-blue-50 text-black font-bold p-1.5 mt-4 '> {loading?<TailSpin
        height="25"
        width="25"
        color="#111"
        ariaLabel="tail-spin-loading"
        //  visible={!loading}
      />:'Edit' }</button>
</div>

      
      </div>
      </div>
  )
}

export default EditPage