import React, { useContext } from 'react'
import StoryComponent from '../components/StoryComponent';
import dp from '../assets/dp.webp'
import { FaRegHeart, FaFacebookMessenger, FaHeart, FaComment } from "react-icons/fa";
import ImagePost from '../components/ImagePost';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Suggetion from '../basicFunctions/Suggetion';
import { useEffect } from 'react';
import { useState } from 'react';
import { FaUserLarge } from 'react-icons/fa6';
import { useRef } from 'react';
import { SocketDataContext } from '../context/SocketContext';



const Main = () => {

   const {userData,notificationData} = useSelector(state=>state.user)
   const {postData} = useSelector(state=>state.post)
   const {allStoryData} = useSelector(state=>state.story)
   const {userStoryData} = useSelector(state=>state.story)
   const {onlineUserData} = useSelector(state=>state.socket)
   const {prevMessageUserData} = useSelector((state)=>state.message);
   const {socket} = useContext(SocketDataContext);


   
   const [isActive,setIsActive] = useState(false);
   const [newFollowerNo,setNewFollowerNo] = useState(0);
   const [newLikeNo,setNewLikeNo] = useState(0);
   const [newCommentNo,setNewCommentNo] = useState(0);
   const [showNotificationPopUp,setShowNotificationPopUp] = useState(false);
   const [messageCount,setMessageCount] = useState(0);

   const notificationPopUpRef = useRef();
   const navigate = useNavigate();

   const userStoryDp = ()=>{
    if(userStoryData[0]){
      navigate(`/story/${userStoryData[0]?.author?.userName}`)
    }else{
      navigate(`/upload`)
    }
   }

   //notification popup
   useEffect(()=>{
    let followNo = 0;
    let likeNo = 0;
    let commentNo = 0;
    let active = false;
    // setIsActive(notificationData?.some((noti)=>noti?.isRead==false));
    notificationData?.map(noti => {
      if (noti?.isRead == false) {
        active = true;
        if(noti?.type=='follow'){
          followNo++;
        }else if(noti?.type=='like'){
          likeNo++;
        }else if(noti?.type=='comment'){
          commentNo++;
        }
      }
    });

    setIsActive(active);
    setNewLikeNo(likeNo);
    setNewFollowerNo(followNo);
    setNewCommentNo(commentNo);

    const popUpOffFnc = ()=>{
      const timeOut = setTimeout(()=>{
      setShowNotificationPopUp(false);
    },[3000]);
    return ()=> clearTimeout(timeOut);
    }

    if (newFollowerNo > 0 || newLikeNo >0 || newCommentNo > 0) {
      setShowNotificationPopUp(true);
      popUpOffFnc();
      
    }
   },[userData,notificationData,socket,notificationPopUpRef])
   
   //notification popup component 
   const NotificationPopUp = ()=>{
    if (newFollowerNo == 0 && newLikeNo ==0 && newCommentNo == 0) {
      return null;
    }
    return(
      <div className=' absolute z-50 -bottom-12 -left-6 rounded-xl bg-violet-950 w-fit flex-col gap-3 px-2 py-1'>
        <div className='flex gap-3'>
          {newFollowerNo >0 && <div className='flex gap-1 items-center'><FaUserLarge className='fill-slate-100 text-sm'/><p className='font-semibold text-white text-sm'>{newFollowerNo}</p></div>}
          {newLikeNo >0 && <div className='flex gap-1 items-center'><FaHeart className='fill-white text-sm'/><p className='font-semibold text-white text-sm'>{newLikeNo}</p></div>}
        </div>
        
        <div className='flex justify-center'>
        {newCommentNo >0 && <div className='flex gap-1 items-center'><FaComment className='fill-slate-100 text-sm'/><p className='font-semibold text-white text-sm'>{newCommentNo}</p></div>}
        </div>
        {/* {newCommentNo >=0 && <div className='flex gap-1 items-center'><FaComment className='fill-slate-100 text-sm'/><p className='font-semibold text-white text-sm'>{newCommentNo}</p></div>} */}
      </div>
    )
   }
   //message unseen count
   useEffect(()=>{
    setMessageCount(0);

    prevMessageUserData?.forEach((data)=>{
      if(data?.unSeenMessage>0){
        setMessageCount(prev=>prev+1);        
      }
    })
   },[prevMessageUserData])

  return (
    <div className=' bg-gray-950 w-full  max-w-[550px]'>
        <div className=' px-4 h-[9vh] flex justify-between items-center w-full'>
            <div onClick={()=>window.location.reload()} className='h-[3rem] cursor-pointer'><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png" alt="" className='h-full invert'/></div>
            <div className='flex justify-between w-16 gap-1' >
                <div onClick={()=>navigate('/notification')} className='relative group active:scale-90 cursor-pointer'><FaRegHeart className='fill-slate-200  text-xl '/>{isActive && <div className='h-2 w-2 rounded-full bg-red-700 absolute -right-0.5 top-0'/>}<div className='group-hover:flex hidden'>{isActive?<NotificationPopUp />:<Suggetion text={'Notification'} direction='bottom'/>}</div>{showNotificationPopUp && <div ref={notificationPopUpRef}><NotificationPopUp /></div>}</div>
                <div onClick={()=>navigate('/message')} className='relative group cursor-pointer'><FaFacebookMessenger className='fill-slate-200 active:scale-90 text-xl' />{messageCount>0 && <div className='size-4 rounded-full bg-red-700 absolute -right-1.5  -top-1.5 flex justify-center items-center text-white text-[.55rem] font-semibold'>{messageCount<100 ?messageCount:'99+'}</div>}<Suggetion text={'Message'} direction='bottom'/></div>
            </div>
        </div>

        <div className='h-20 p-2 flex flex-nowrap items-center overflow-x-scroll  overflow-y-hidden gap-2 '>

          <div onClick={userStoryDp} className='flec-col justify-center items-center gap-1 h-full'>
      <div className={`${userStoryData?'p-[0.16rem]':'p-0'} w-14 h-14 rounded-full  bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 shrink-0 cursor-pointer`}>
      <div className='h-full w-full bg-white rounded-full'>
        <img src={userData?.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full overflow-hidden' />
      </div>
    </div>
    <p className='w-10 truncate text-gray-200 font-medium text-xs'>Your Story</p>
    </div>
          
            {allStoryData?.map((story,idx)=>{
              return <StoryComponent story={story} key={idx} />
            })}


            
        </div>
        {/* online Users */}
        <div className='w-full m-2 pr-5'>
          <div className='flex justify-between items-center'>
            <h3 className='text-gray-50 text-lg font-semibold cursor-default'>Online Users</h3>
            <p onClick={()=>navigate('/onlineUsers')} className='hover:underline active:scale-90  text-blue-600 text-sm font-medium px-2 py-0.5 rounded-2xl cursor-pointer'>show more</p>
          </div>
            <div className='w-full flex gap-2 p-1 overflow-x-auto'>
            {onlineUserData?.map((user)=>(
              <div onClick={()=>navigate(`/profile/${user?.userName}`)} className='active:scale-90 flec-col justify-center items-center gap-1 h-full cursor-pointer'>
                <div className='w-10 h-10 relative rounded-full  bg-slate-700 p-[0.5px] cursor-pointer'>
                    <img src={user?.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full border-[1px] border-violet-800 overflow-hidden' />
                  <div className='size-3 absolute top-[1.5px] right-[1.5px] rounded-full bg-violet-600'/>
              </div>
            <p className='w-10 truncate text-gray-50 font-normal text-xs'>{user?.userName}</p>
          </div>
            ))}
        </div>
        </div>
        

        <div className='flex flex-col pb-20'>
          {postData?.map((post,idx)=>
            (userData?.followings?.includes(post?.author?._id)) &&
              <ImagePost post={post}  key={idx} navigateFrom='mainPage'/>
          )}
          {postData?.map((post,idx)=>
            (userData?.previousSearchedUsers?.includes(post?.author?._id)) &&
            !(userData?.followings?.includes(post?.author?._id)) &&
              <ImagePost post={post}  key={idx} navigateFrom='mainPage'/>
          )}
          {postData?.map((post,idx)=>
            !(userData?.previousSearchedUsers?.includes(post?.author?._id)) &&
            !(userData?.followings?.includes(post?.author?._id)) &&
              <ImagePost post={post}  key={idx} navigateFrom='mainPage'/>
          )}
            
            </div>
    </div> 
  )
}

export default Main