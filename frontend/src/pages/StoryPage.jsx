import React, { useState,useEffect, useRef } from 'react'
import axios from 'axios'
import dp from '../assets/dp.webp'

import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { FaEye } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { setOtherStoryData } from '../redux/storySlice'
import VideoComponent from '../components/VideoComponent'
import ShowViewers from '../components/ShowViewers'
import observerFnc from '../getingData/observerFnc'
import LoadingComponent from '../components/loadingComponent'

const StoryPage = () => {

const [showViewers,setShowViewers] = useState(false)
const [showMoreCaption,setShowMoreCaption] = useState(false)
const [currentStoryNo,setCurrentStoryNo] = useState(0)
const [progress,setProgress] = useState(0)
const [loading,setLoading] = useState(false)

const imageRef = useRef();
const videoRef = useRef();

const navigate = useNavigate()
const dispatch = useDispatch();
const { userName } = useParams();

const {userStoryData,otherStoryData} = useSelector(state=>state.story)
const {userData} = useSelector(state=>state.user)




useEffect(()=>{
const getStoryFnc = async()=>{
  setLoading(true)
  dispatch(setOtherStoryData([]))
try {
    if(userName==userData.userName){
      console.log(userStoryData);
     dispatch(setOtherStoryData(userStoryData))        
    }else{
     const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/story/getStory/${userName}`,{withCredentials:true});
    // story=result.data;
    dispatch(setOtherStoryData(result.data))
    console.log(result.data);
    }
    setLoading(false)

} catch (error) {
    console.log(error);
    setLoading(false)
}
}
getStoryFnc()
},[ userData.userName, dispatch])

const userViewFnc = async(id)=>{
try {
    if(userName!==userData.userName){
    await axios.get(`${import.meta.env.VITE_SERVER_URL}/story/viewStory/${id}`,{withCredentials:true});    
    }
} catch (error) {
    console.log(error);
}
}


 const [duration, setDuration] = useState(5000); // Default 5s
 useEffect(() => {
    if (!otherStoryData || !otherStoryData.length) return;

    userViewFnc(otherStoryData[currentStoryNo]?._id);

    // Determine duration: 5s for image, dynamic for video
    const isVideo = otherStoryData[currentStoryNo]?.mediaType === 'video';
    const time = isVideo ? duration : 5000;

    const timer = setTimeout(() => {
      if (currentStoryNo < otherStoryData.length - 1) {
        setCurrentStoryNo(prev => prev + 1);
        setProgress(0); // Reset progress for next story
      } else {
        navigate(-1);
      }
    }, time);

    return () => clearTimeout(timer);
  }, [currentStoryNo, otherStoryData, duration]);



const updateFnc = ()=>{
  if (otherStoryData[currentStoryNo].mediaType=='video') {
  const video = videoRef.current;
if (video) {
  const currentWidth = (video.currentTime/video.duration)*100;
  setProgress(currentWidth);
  }
    }

}
useEffect(()=>{
  observerFnc(videoRef);  //observe function
  },[])

const handleVideoLoad = (e) => {
  setDuration(e.target.duration * 1000);
};

// status change onClick

const goToNext = () => {
  if (currentStoryNo < otherStoryData.length - 1) {
    setCurrentStoryNo(prev => prev + 1);
    setProgress(0);
  } else { navigate(-1); }
};

const goToPrev = () => {
  if (currentStoryNo > 0) {
    setCurrentStoryNo(prev => prev - 1);
    setProgress(0);
  }
};



  return (

    <div className='w-screen h-screen flex justify-center items-center bg-black'>

     <div className='absolute w-full h-[75%] flex justify-center items-center z-30'>
      <div onClick={goToPrev} className='h-full w-1/3 '/>
      <div onClick={goToNext} className='h-full w-2/3 '/>
    </div>

     <div className='w-full md:max-w-[500px] relative h-full flex justify-center items-center  bg-gray-950  rounded-2xl'>
        {loading && <LoadingComponent/>}

    <div className='h-1 absolute z-40 top-0 w-full flex rounded-full'>
      {otherStoryData?.map((_,idx)=>
        <div key={idx} className=' h-full flex-1 mx-0.5 bg-gray-600 rounded-full'>
        
        {currentStoryNo==idx && (otherStoryData[currentStoryNo].mediaType=='image'?
        <div className='storyAnimation bg-gray-50 h-full rounded-full '/>
        :<div className='bg-gray-50 h-full rounded-full' style={{width:`${progress}%`}}/>  
        )
      }
          {/* <div className='bg-gray-50 h-full rounded-full' style={{width:`${progress}%`}}/> */}
        </div>
      )}
    </div>

            <div className='absolute z-40 top-3 left-2 flex justify-start items-center gap-2'>
                <IoMdArrowRoundBack onClick={()=>navigate(-1)} className='hover:bg-gray-800 active:scale-95 rounded-xl text-3xl fill-white cursor-pointer' />
                <img onClick={()=>navigate(`/profile/${otherStoryData[currentStoryNo]?.author?.userName}`)} src={otherStoryData[currentStoryNo]?.author?.profileImage || dp} alt="" className='h-10 w-10 rounded-full object-cover border-2 border-gray-100 cursor-pointer'/>
                <div onClick={()=>navigate(`/profile/${otherStoryData[currentStoryNo]?.author?.userName}`)} className='flex-col'>
                  <h2 className='font-semibold text-sm cursor-pointer text-white leading-tight'>{otherStoryData[currentStoryNo]?.author?.userName}</h2>
                  <p className='text-xs cursor-pointer text-white leading-tight'>{`${otherStoryData[currentStoryNo]?.author?.firstName} ${otherStoryData[currentStoryNo]?.author?.lastName}`}</p>
                  <p className='text-xs text-white leading-snug cursor-default'>Set story {moment(otherStoryData[currentStoryNo]?.createdAt).fromNow()}</p>
                </div>

            </div>


        {otherStoryData[currentStoryNo]?.mediaType=='image'?
            <img src={otherStoryData[currentStoryNo]?.media} ref={imageRef} alt="" onError={goToNext} className='max-w-full max-h-[75%] object-cover' />
            // : <VideoComponent media={otherStoryData[currentStoryNo]?.media}/>
            : <video ref={videoRef} src={otherStoryData[currentStoryNo]?.media} autoPlay onTimeUpdate={updateFnc} onLoadedMetadata={handleVideoLoad} onError={goToNext} className='max-w-full max-h-full object-cover'></video>
            
            }
          <div className='absolute bottom-6 px-24 w-full text-center'><h6 onClick={()=>setShowMoreCaption((prev)=>!prev)} className={`text-gray-100 text-sm ${showMoreCaption?'':'truncate'}`}>{otherStoryData[currentStoryNo]?.caption || ''}</h6></div>

          {userName==userData.userName &&
          <div className='absolute bottom-0 left-0  rounded-xl  w-full'>
            <div onClick={()=>setShowViewers(true)} className={`${showViewers?'hidden':'block'} flex w-fit justify-start items-center rounded-2xl gap-3 p-3 ml-2 mb-3 cursor-pointer bg-black`}>
                <h1 className='text-gray-300 text-xl font-semibold'>{(otherStoryData[currentStoryNo]?.views)?.length}</h1>
                <FaEye className='text-gray-300 text-xl font-semibold' />
            </div>
            <div onClick={()=>setShowViewers(false)} className={`${!showViewers?'hidden':'block'} w-screen  h-screen  bg-gray-950 fixed left-0 top-0 opacity-50 z-10`}></div>
            <div className={`${!showViewers?'hidden':'block'} flex-col w-full p-2 h-[50vh] rounded-t-2xl bg-gray-800 bottom-0 z-30 absolute  overflow-y-auto`}>
              <div className='w-full border-b-[1px] flex items-center p-2'>
                <IoMdArrowRoundBack onClick={()=>setShowViewers(false)} className='hover:bg-gray-900 active:scale-95 rounded-xl text-2xl fill-white cursor-pointer' />
                <h1 className='mx-3 text-white text-xl cursor-default'>Your Story Viewers</h1>
              </div>
                {otherStoryData[currentStoryNo]?.views.map((viewer,idx)=>
                ( <ShowViewers viewer={viewer} key={idx}/> )
                )}
            </div>
            
            </div>
          
          }

        {/* Preloading image (Hidden) */}
       {otherStoryData[currentStoryNo + 1] && 
        (otherStoryData[currentStoryNo].mediaType=='image'?
    <img src={otherStoryData[currentStoryNo + 1].media} className="hidden" />
    :<video src={otherStoryData[currentStoryNo + 1].media} preload='auto' muted className='hidden'/>
  )}
    </div>  
       
    </div>
  )
}

export default StoryPage
