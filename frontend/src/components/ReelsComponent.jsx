import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import observerFnc from '../getingData/observerFnc';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dp from '../assets/dp.webp'
import { FaRegHeart,FaHeart, FaFacebookMessenger } from "react-icons/fa";
import { FaPauseCircle } from "react-icons/fa";
import { MdPlayCircle } from "react-icons/md";
import { FaRegComment } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { GrSend } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { TailSpin } from 'react-loader-spinner'
import axios from 'axios';
import { setReelsData } from '../redux/reelsSlice';
import { setOtherUserData, setUserData } from '../redux/userSlice';
import followFnc from '../getingData/followFnc';
import Suggetion from '../basicFunctions/Suggetion';
import { SocketDataContext } from '../context/SocketContext';

const ReelsComponent = ({reels, navigateFrom}) => {
const [progress,setProgress] = useState(0)
const [showmore,setShowmore] = useState(false)
const[comment,setComment] = useState('');
const[showComment,setShowComment] = useState(false);
const[loading,setLoading] = useState(false);
const[x,setX] = useState(300);
const[y,setY] = useState(300);
const[col, setCol] = useState('#FD1D1D');


const videoRef = useRef();
const reelsRef = useRef();
const playPauseRef = useRef();
const navigate = useNavigate();
const dispatch = useDispatch();

const {userData} = useSelector(state=>state.user);
const {reelsData} = useSelector(state=>state.reels);
const {otherUserData} = useSelector(state=>state.user);
  const {socket} = useContext(SocketDataContext);

// const likeHeartColor = ['#405DE6', '#5851DB', '#833AB4', '#C13584', '#E1306C', '#FD1D1D', '#F56040', '#F77737', '#FCAF45', '#FFDC80']
const likeHeartColor = [
  "#FD1D1D", // Red (Instagram Heart)
  "#FF3377", // Bright Hot Pink
  "#E1306C", // Purple-Red
  "#C13584", // Dark Pink
  "#833AB4", // Instagram Purple
  "#962fbf", // Vibrant Violet
  "#405DE6", // Royal Blue
  "#0061FF", // Electric Blue
  "#45CAFF", // Neon Sky
  "#00FF87", // Neon Lagoon
  "#FFDC80", // Light Yellow
  "#FCAF45", // Yellow
  "#F56040", // Dark Orange
  "#FF930F", // Sunset Orange
  "#F89B29", // Vibrant Orange
  "#D88CA3", // Dusty Rose
  "#E6D9FF", // Lavender
  "#CBE5FF", // Pastel Blue
  "#FFCBCB", // Pastel Pink
  "#FFE1CB"  // Peach Cream
]



useEffect(()=>{
observerFnc(videoRef);  //observe function
},[])

const[author,setAuthor] = useState(null);

useEffect(()=>{
if (navigateFrom == 'reelsPage') {
  setAuthor(reels?.author);
}else if (navigateFrom == 'profilePage' || navigateFrom == 'savedProfile'){
  setAuthor(otherUserData);
}
},[otherUserData, navigate])

const updateFnc = ()=>{
  const video = videoRef.current;
  if(video){
  const percent = (video.currentTime/video.duration) * 100;
    setProgress(percent);
  }
}

 const likeFnc = async ()=>{
    try {
      const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/reels/like/${reels._id}`,{withCredentials:true});
const updatedReels = result.data;
console.log(result);

    if (navigateFrom == 'mainPage') {
      const updatedData = reelsData.map(
          (p)=> String(p._id)===String(reels._id)?updatedReels:p 
        );
        dispatch(setReelsData(updatedData));
    }else if (navigateFrom == 'profilePage'){
      
      const updated = otherUserData?.reels?.map(
          (p)=> String(p._id)===String(reels._id)?updatedReels:p 
        );
        const updatedOtherUser = {...otherUserData,reels:updated}
     dispatch(setOtherUserData(updatedOtherUser));
    }else if (navigateFrom == 'savedProfile'){
      
      const updated = otherUserData?.savedReels?.map(
          (p)=> String(p._id)===String(reels._id)?updatedReels:p 
        );
        const updatedOtherUser = {...otherUserData,savedReels:updated}
     dispatch(setOtherUserData(updatedOtherUser));
    }

    } catch (error) {
      console.log(error);
      
    }
  }

  const likeDoubleClickFnc =(e)=>{
    console.log('liked');
    const randomNumber = Math.floor(Math.random() * likeHeartColor.length);

    setX(e.screenX)
    setY(e.screenY)
    setCol(likeHeartColor[randomNumber])
    
    reelsRef.current.classList.add('likeAnimation');


  if(!(reels?.likes.includes(userData._id))){
    likeFnc();
  }
  const timeOut = setTimeout(()=>{
    reelsRef.current.classList.remove('likeAnimation');
    
  },2100);
  return ()=>clearTimeout(timeOut);
}


  const commentFnc = async ()=>{
    setLoading(true)
    try {
      const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/reels/comment/${reels._id}`,{message:comment},{withCredentials:true});
const updatedReels = result.data;
console.log(result.data);

if (navigateFrom == 'mainPage') {
   const updatedData = reelsData.map(
      (p)=> String(p._id)===String(reels._id)?updatedReels:p 
    );
dispatch(setReelsData(updatedData));
}else if (navigateFrom == 'profilePage'){
  const updated = otherUserData?.reels?.map(
      (p)=> String(p._id)===String(reels._id)?updatedReels:p 
    );
    const updatedOtherUser = {...otherUserData,reels:updated}
 dispatch(setOtherUserData(updatedOtherUser));
}else if (navigateFrom == 'savedProfile'){
  const updated = otherUserData?.savedReels?.map(
      (p)=> String(p._id)===String(reels._id)?updatedReels:p 
    );
    const updatedOtherUser = {...otherUserData,savedReels:updated}
 dispatch(setOtherUserData(updatedOtherUser));
}

setLoading(false);
setComment('');
    } catch (error) {
      console.log(error);
      setLoading(false);
      
    }
  }

  const savedReelsFnc = async ()=>{
    try {
      const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/reels/saved/${reels._id}`,{withCredentials:true})
      dispatch(setUserData(result.data))
      console.log(result);
      dispatch(setUserData(result.data));

    } catch (error) {
      console.log(error);
      
    }
  }

  // share function
  const shareFnc =async ()=>{
    const baseURL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

    if(navigator.share){
      try {
        await navigator.share({
          title:`${author?.userName} Reels`,
          text:reels?.caption,
          url:`${baseURL}/reels/${reels?._id}`
        })
        console.log('share sucessfull');
      } catch (error) {
        console.log('share error',error);
      }
    }else{
      navigator.clipboard.writeText(`${baseURL}/reels/${reels?._id}`);
      alert('Sharing is not happend in Your web browser \n link copied to clipboard')
    }
  }

// Impliment socket io privious when socket is stored in redux
useEffect(()=>{
socket?.on('likedReels', (updatedReels)=>{

  if (navigateFrom == 'mainPage') {
   
    const updatedData = reelsData.map(
        (p)=> String(p._id)===String(updatedReels.reelsId)?{...p,likes:updatedReels.likes}:p );
        dispatch(setReelsData(updatedData));
  
  }else if (navigateFrom == 'profilePage'){
    const updated = otherUserData?.reels?.map(
        (p)=> String(p._id)===String(reels._id)?{...p,likes:updatedReels.likes}:p 
      );
      const updatedOtherUser = {...otherUserData,reels:updated}
   dispatch(setOtherUserData(updatedOtherUser));
  }else if (navigateFrom == 'savedProfile'){
    const updated = otherUserData?.savedReels?.map(
        (p)=> String(p._id)===String(reels._id)?{...p,likes:updatedReels.likes}:p 
      );
      const updatedOtherUser = {...otherUserData,savedReels:updated}
   dispatch(setOtherUserData(updatedOtherUser));
    }


  const updatedData = reelsData?.map(
      (r)=> String(r._id)===String(updatedReels.reelsId)?{...r,likes:updatedReels.likes}:r );
      dispatch(setReelsData(updatedData));
})
socket?.on('commentedReels', (updatedReels)=>{
  if (navigateFrom == 'mainPage') {
   
    const updatedData = reelsData.map(
        (p)=> String(p._id)===String(updatedReels.reelsId)?{...p,comments:updatedReels.comments}:p );
        dispatch(setReelsData(updatedData));
  
  }else if (navigateFrom == 'profilePage'){
    const updated = otherUserData?.reels?.map(
        (p)=> String(p._id)===String(reels._id)?{...p,comments:updatedReels.comments}:p 
      );
      const updatedOtherUser = {...otherUserData,reels:updated}
   dispatch(setOtherUserData(updatedOtherUser));
  }else if (navigateFrom == 'savedProfile'){
    const updated = otherUserData?.savedReels?.map(
        (p)=> String(p._id)===String(reels._id)?{...p,comments:updatedReels.comments}:p 
      );
      const updatedOtherUser = {...otherUserData,savedReels:updated}
   dispatch(setOtherUserData(updatedOtherUser));
  }
})

return ()=> {
  socket?.off('likedReels');
  socket?.off('commentedReels');
}
},[socket,reelsData,dispatch])

//single click and dubble click
const [isPause,setIsPause] = useState(false);

const timerRef = useRef(null);
  const DBL_CLICK_DELAY = 300; // milliseconds

    const handleClick = useCallback((e) => {
    // Clear the timer if it's already running (meaning a double click is likely happening)
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    } else {
      // Set a timer to execute the single click logic after a short delay
      timerRef.current = setTimeout(() => {
        console.log("Single click action executed");
        if(e.target.id == 'videoId'){
        setIsPause(prev=>!prev);
}

        timerRef.current = null; // Reset the timer reference
      }, DBL_CLICK_DELAY);
    }
  }, []);

const handleDoubleClick = useCallback((e) => {
    // Clear the timer immediately to prevent the single click from running
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    likeDoubleClickFnc(e)
  }, []);


const isInetialMount = useRef(true);
  useEffect(()=>{
    if (isInetialMount.current) {
      isInetialMount.current= false;
      return
    }
    if (isPause) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    playPauseRef.current.classList.add('playPauseAnimetion')
  const timeOut = setTimeout(()=>{
    playPauseRef.current.classList.remove('playPauseAnimetion')
    
  },1000);
  return ()=>clearTimeout(timeOut);
  },[isPause])




  return (
    <div onClick={handleClick} onDoubleClick={handleDoubleClick} className='h-screen w-full relative bg-black   '>
       <IoMdArrowRoundBack onClick={()=> navigate(-1)} className=' active:scale-90 hover:scale-105 hover:bg-gray-700 size-10 p-1 absolute z-50 left-3 top-4 rounded-full cursor-pointer'/>
        <div className={`${!showComment?'h-screen':'h-[50vh]'} mx-auto `}>
          <video src={reels?.media} autoPlay loop ref={videoRef} onTimeUpdate={updateFnc} id='videoId' className=' h-full w-full'></video>
        
        <FaHeart ref={reelsRef} style={{left:`${x}px`,top:`${y-70}px`,fill:col}} className='fixed text-6xl opacity-0'/>
        <div ref={playPauseRef} className='fill-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl opacity-0'>{isPause?<MdPlayCircle/>:<FaPauseCircle/>}</div>
        
        <div className='h-1 bg-white rounded-r-full absolute left-0 bottom-0 transition-all ease-linear duration-200' style={{width:`${progress}%`}}></div>
        
        <div className='absolute bottom-6 left-2 flex-col gap-2 p-3'>
          <div className='flex items-center gap-1.5 cursor-pointer py-2 mb-4'>
            <div onClick={()=>navigate(`/profile/${author?.userName}`)} className='active:scale-90 h-9 w-9 rounded-full '><img src={author?.profileImage} className='h-full w-full rounded-full overflow-hidden object-cover' alt="" /></div>
            <div onClick={()=>navigate(`/profile/${author?.userName}`)} className='active:scale-90 text-white font-semibold text-xl truncate max-w-20 mr-2'>{author?.userName}</div>
            {/* <button className='text-white border-2 border-white bg-transparent text-sm font-semibold px-4 py-2 rounded-full'>
              {(userData?.followings).includes(author?._id)?'Following':'Follow'}
            </button> */}

          {String(author?._id)!==String(userData._id)?
            <button onClick={()=>followFnc(author?._id,userData._id,dispatch)} className='active:scale-90 text-white border-[1px] border-white bg-transparent text-base font-normal px-2.5 py-1 rounded-full'>
              {(userData?.followings).includes(author?._id)?'Following':'Follow'}
            </button>:<button className='text-gray-200 border-2 border-gray-500 bg-transparent text-base font-semibold px-2 py-1 rounded-full'> Your Reels </button>}

          </div>
          <div onClick={()=>setShowmore((prev)=>!prev)} className={`text-gray-50 text-sm cursor-pointer max-w-[80%] ${showmore?'':'truncate line-clamp-2 '}`}>{reels.caption}</div>
        </div>

        {/* liked comment div */}
        {!showComment && <div className='absolute  right-1 bottom-14 md:bottom-16 flex-col items-center '>
          <div onClick={likeFnc} className='flex-col items-center gap-1 my-5 '>{reels.likes.includes(userData._id)? <FaHeart className='group-active:scale-90 fill-[#FD1D1D] text-3xl cursor-pointer ml-2'/>:<FaRegHeart className='group-active:scale-90 fill-slate-200 text-3xl cursor-pointer ml-2'/>}
            <p className='text-base text-white cursor-default text-center'>{reels?.likes?.length }</p>
            </div>
            <div onClick={()=>setShowComment(true)} className='active:scale-90 flex-col items-center gap-1 px-1 my-5 cursor-pointer'><FaRegComment className='fill-slate-200 text-3xl cursor-pointer ml-1.5'/>
            <p className='text-base text-white text-center'>{reels?.comments?.length }</p>
             </div>
             <div onClick={shareFnc} className='active:scale-90 flex-col items-center gap-1 px-1 my-5 cursor-pointer'><GrSend className='fill-slate-200 text-3xl cursor-pointer ml-1'/>
            <p className='text-sm text-white text-center'>Shere</p>
             </div>
            <div onClick={savedReelsFnc} className='active:scale-90 relative group px-1 my-5 cursor-pointer'>{(userData?.savedReels).includes(reels?._id)?<FaBookmark className='text-3xl text-gray-100'/>:<FaRegBookmark className='text-3xl text-gray-100 ml-1' />}<Suggetion text={'SaveReels'} direction='bottom '/></div>  
        </div>}
            </div>
        {/* comment div */}
        {showComment && 
          <div className='fixed z-30 bottom-0 left-0  rounded-xl  w-full transition-all duration-200'>
            <div onClick={()=>setShowComment(false)} className='w-screen  h-screen overflow-hidden   bg-gray-950 fixed left-0 top-0 opacity-30 z-10'></div>
            <div className='flex-col p-2 h-[50vh] rounded-t-2xl bg-gray-800 bottom-0 z-30 absolute left-1/2 transform -translate-x-1/2 w-full max-w-[500px] overflow-y-auto'>
              <div className='w-full border-b-[1px] flex items-center p-2 mb-2'>
                <IoMdArrowRoundBack onClick={()=>{setShowComment(false);dispatch(setLikedUsersData(null))}} className='active:scale-90 hover:scale-105 hover:bg-gray-800 size-8 p-1 rounded-2xl fill-white cursor-pointer' />
                <h1 className='mx-3 text-white font-xl cursor-default'> Comments </h1>
              </div>
            {/* comment input */}
            <div className='w-full px-2 h-8 flex gap-2 mb-2'>
          <input type="text" placeholder='Write a Comment' value={comment} onChange={(e)=>setComment(e.target.value)} className='border-none outline-none rounded-[24px] p-2 px-4 h-full flex-1 bg-gray-600 text-sm text-white'/>
          {comment &&  <button onClick={commentFnc} disabled={loading} className="active:scale-90 p-4 overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white rounded-full text-xl flex justify-center items-center">{loading?<TailSpin
        height="25"
        width="25"
        color="#fff"
        ariaLabel="tail-spin-loading"
        //  visible={!loading}
      />:<IoSend/> }</button>
          }
           </div>



        {/* View Comments */}
                        {reels?.comments?.map((comment,idx)=>
                        <div key={idx} className='h-11 p-2 flex justify-start items-center gap-4 '>
                   <div  className='flex items-center gap-2 p-3'> 
                    <div onClick={()=>navigate(`/profile/${comment?.author?.userName}`)} className='active:scale-90 w-9 h-9 rounded-full  bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 p-[0.16rem]   shrink-0 cursor-pointer mx-2'>
              <div className='h-full w-full bg-white rounded-full'>
                <img src={comment?.author?.profileImage || dp} onClick={()=>navigate(`/profile/${comment?.author?.userName}`)} alt="" className='h-full w-full rounded-full object-cover'/>
              </div>
            </div>
                    <div>
                    <h2 onClick={()=>navigate(`/profile/${comment?.author?.userName}`)} className='active:scale-90 font-bold text-sm leading-3 cursor-pointer'>{comment?.author?.userName}</h2>
                    <p className='text-xs cursor-default'>{`${comment?.author?.firstName} ${comment?.author?.lastName}`}</p>
                    </div>
                    </div>
                    <p className='text-sm '> {comment?.message} </p>
                </div>
                        )}
            </div>
            
            </div>
          }


    </div>
  )
}

export default ReelsComponent