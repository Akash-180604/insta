import React, { useEffect, useState } from 'react'
import axios from 'axios'
import dp from '../../assets/dp.webp'

import { useDispatch, useSelector } from 'react-redux';
import { setOtherUserData, setUserData } from '../../redux/userSlice'
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router-dom';
import ProfileShortPost from '../../components/ProfileShortPost';
import ProfileShortReel from '../../components/ProfileShortReel';
import followFnc from '../../getingData/followFnc';
import shortCount from '../../basicFunctions/shortCount';
import LoadingComponent from '../../components/loadingComponent';
import { setSelectedUserData } from '../../redux/messageSlice';
import { useRef } from 'react';

const ProfilePage = () => {


    const [select,setSelect] = useState("post");
    const [selectSaved,setSelectSaved] = useState("post");
    const [pageLoading,setPageLoading] = useState(false);
    const [showLargeDp,setShowLargeDp] = useState(false);

const {userData, otherUserData}=useSelector(state=>state.user);
const {onlineUsers}=useSelector(state=>state.socket);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {userName} = useParams();
    const initRef = useRef(true);
      

useEffect(()=>{
    const getProfile = async()=>{
      try {
        if (initRef.current === true) {
          setPageLoading(true)
          dispatch(setOtherUserData(null));
          initRef.current = false;
        }
      
      
      const result= await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/getProfile/${userName}`,{withCredentials:true})
        dispatch(setOtherUserData(result.data));        
        setPageLoading(false)

      } catch (error) {
        setPageLoading(false)
        console.log(error);
      }
    }
    getProfile()
},[dispatch,userName,userData])


const logOutFnc = async ()=>{
  const userResponse = confirm('Are you sure you want to log out?')
  try {
    if (userResponse) {
      const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/logout`,{withCredentials:true});
      navigate('/signIn');
    }
} catch (error) {
  console.log(error);
  
}
  

}

const clickImageFnc = ()=>{
  if (otherUserData?.isStory) {
    navigate(`/story/${otherUserData?.userName}`)
  }else{
    setShowLargeDp(true);
  }
}


const clickMessageBtnFnc = ()=>{
  const selectedUser = {
    _id:otherUserData._id,
    userName:otherUserData?.userName,
    firstName:otherUserData?.firstName,
    lastName:otherUserData?.lastName,
    profileImage:otherUserData?.profileImage,
  }
  dispatch(setSelectedUserData(selectedUser));

  navigate(`/message/${otherUserData._id}`)
}



  return (
    <div className='w-screen min-h-screen bg-black flex justify-center overflow-auto '>
        <div className='w-full max-w-[650px] relative bg-gray-950 rounded-2xl pt-4 pb-16'>
        {pageLoading && <LoadingComponent/>}
          
          <IoArrowBackSharp onClick={()=> navigate(-1)} className=' hover:bg-gray-600 active:scale-90 hover:scale-105 bg-gray-900 absolute text-white size-12 font-semibold top-4 left-4 p-2 rounded-3xl cursor-pointer'/>
            <div className='border-b-[0.2px] border-blue-50 p-5'>
                
      <div className='flex justify-evenly items-center gap-6 ml-5 mt-5 m-3'> 
          <div onClick={clickImageFnc} className={`${otherUserData?.isStory?'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 p-[0.16rem] cursor-pointer':'bg-violet-600 p-[1px]'} active:scale-90 w-20 h-20 rounded-full cursor-pointer shrink-0 `}>
      <div className='h-full w-full bg-gray-800 relative rounded-full'>
        <img src={otherUserData?.profileImage || dp} alt="" className='h-full w-full rounded-full object-cover'/>
        {onlineUsers?.includes(otherUserData?._id) && userData?.followings?.includes(otherUserData?._id) &&  <div className='size-5 absolute top-1 right-0 rounded-full bg-violet-700'/>}
      
      </div>
    </div>

    {showLargeDp && otherUserData?.profileImage && <div onClick={()=>setShowLargeDp(false)} className='fixed z-40 top-0 left-0 bg-black/60 w-screen h-screen flex justify-center items-center'>
        <img onClick={(e)=>e.stopPropagation()} src={otherUserData?.profileImage || dp} alt="" className='h-96 w-96 rounded-full object-cover border-2 border-white'/>
      
      </div>}

            <div className='w-56'>
            <h2 className='font-bold text-2xl text-gray-50 cursor-default '>{otherUserData?.userName}</h2>
            <p className='text-xl cursor-default'>{otherUserData?.firstName +' '+ otherUserData?.lastName == undefined?'':otherUserData?.lastName }</p>
            <p className='text-sm cursor-default mt-2 lining-nums'>{ otherUserData?.bio == undefined?'':otherUserData?.bio } </p>
            </div>
            </div>
            <div className='w-full flex justify-around pb-5  '>
                <div className='flex-col items-center cursor-default'>
                <h1 className='font-semibold '>{shortCount(otherUserData?.posts?.length )}</h1>
                <h1 className='font-semibold '>Posts</h1>
                </div>
                <div className='flex-col items-center cursor-default'>
                <h1 className='font-semibold '>{shortCount(otherUserData?.reels?.length)}</h1>
                <h1 className='font-semibold '>Reels</h1>
                </div>                
                <div onClick={()=>navigate(`/profile/followers/${otherUserData?.userName}`)} className='flex-col items-center cursor-pointer '>
                <h1 className='font-semibold '>{shortCount(otherUserData?.followers?.length)}</h1>
                <h1 className='font-semibold '>Follower</h1>
                </div>
                <div onClick={()=>navigate(`/profile/followings/${otherUserData?.userName}`)} className='flex-col items-center cursor-pointer'>
                <h1 className='font-semibold '>{shortCount(otherUserData?.followings?.length)}</h1>
                <h1 className='font-semibold '>Following</h1>
                </div>                
            </div>


        {String(otherUserData?._id)===String(userData?._id)?
            (<div className='flex gap-3 justify-around py-3'>
                <div onClick={()=> navigate('/edit')} className='  text-gray-800  font-semibold  bg-white px-4 py-2 rounded-full cursor-pointer'>Edit Profile</div>
                <div onClick={()=> navigate('/upload')} className=' text-gray-800  font-semibold  bg-white px-4 py-2 rounded-full cursor-pointer'>Upload</div>
                <div onClick={ logOutFnc } className=' text-gray-800  font-semibold  bg-white px-4 py-2 rounded-full cursor-pointer'>Log Out</div>
            </div>) :
            (<div className='flex justify-around py-3'>
                <div onClick={()=>followFnc(otherUserData._id,userData._id,dispatch)} className='active:scale-90  text-gray-800  font-semibold  bg-white px-6 py-2 rounded-full cursor-pointer'>  {((userData?.followings).includes(otherUserData?._id))?'Following' : 'Follow'}</div>
                <div onClick={clickMessageBtnFnc} className='active:scale-90 text-gray-800  font-semibold  bg-white px-6 py-2 rounded-full cursor-pointer'>Message</div>
            </div>) }
            
         </div>
            <div  className='w-full flex justify-around gap-6 m-2'>
                <div className={` w-1/3 font-semibold border-b-2  cursor-pointer ${select=="post"?' text-white border-white':'text-gray-400 border-gray-700 hover:border-gray-300 hover:text-gray-300'} text-center py-2 cursor-pointer rounded-xl `} onClick={()=>setSelect("post")}>Posts</div>
                <div className={` w-1/3 font-semibold border-b-2  cursor-pointer ${select=="reel"?' text-white border-white':'text-gray-400 border-gray-700 hover:border-gray-300 hover:text-gray-300'} text-center py-2 cursor-pointer rounded-xl `} onClick={()=>setSelect("reel")}>Reels</div>
                {String(otherUserData?._id)===String(userData?._id) && 
                <div className={` w-1/3 font-semibold border-b-2  cursor-pointer ${select=="saved"?' text-white border-white':'text-gray-400 border-gray-700 hover:border-gray-300 hover:text-gray-300'} text-center py-2 cursor-pointer rounded-xl `} onClick={()=>setSelect("saved")}>Saved</div>
                }
            </div>

            {select==="post" && <div className='w-full grid grid-cols-3 sm:grid-cols-4'>

            {(otherUserData?.posts)?.map((post,idx)=>(
              <ProfileShortPost post={post} key={idx} PostIndex={idx} navigateForm={'profilePage'}/>
            ))}
            </div>}
            
            {select==="reel" && <div className='w-full grid grid-cols-3 sm:grid-cols-4'>
              {(otherUserData?.reels)?.map((reels,idx)=>(
              <ProfileShortReel reels={reels} key={idx} reelsIndex={idx} />
            ))}
            </div>}
            
            {select==="saved" && 
            <div>
              <div className='w-full py-2 px-14 pt-2 flex justify-evenly items-center gap-3 -mt-2 mb-2'>
                    <div onClick={()=>setSelectSaved('post')} className={`font-semibold border-b-2  cursor-pointer ${selectSaved=="post"?' text-white border-white':'text-gray-400 border-gray-700 hover:border-gray-300 hover:text-gray-300'} text-center text-sm py-2 px-4 sm:px-6 cursor-pointer`}>Saved Post</div>
                    <div onClick={()=>setSelectSaved('reel')} className={`font-semibold border-b-2  cursor-pointer ${selectSaved=="reel"?' text-white border-white':'text-gray-400 border-gray-700 hover:border-gray-300 hover:text-gray-300'} text-center text-sm py-2 px-4 sm:px-6 cursor-pointer`}> Saved Reels</div>
                </div>

              {selectSaved==="post" && <div className='w-full grid grid-cols-3 sm:grid-cols-4'>
            {(otherUserData?.savedPosts)?.map((post,idx)=>(
              <ProfileShortPost post={post} key={idx} PostIndex={idx} navigateForm={'savedProfile'} />
            ))}
            </div>}
            
            {selectSaved==="reel" && <div className='w-full grid grid-cols-3 sm:grid-cols-4'>
              {(otherUserData?.savedReels)?.map((reels,idx)=>(
              <ProfileShortReel reels={reels} key={idx} reelsIndex={idx} navigateForm={'savedProfile'}/>
            ))}
            </div>}

            </div>
            }

        </div>
  
    </div>
  )
}

export default ProfilePage