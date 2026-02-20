import React, { useEffect, useRef, useState } from 'react'
import observerFnc from '../getingData/observerFnc';
import { IoArrowBackOutline } from 'react-icons/io5';
import { GoMute, GoUnmute } from 'react-icons/go';
import { FaCirclePause, FaCirclePlay } from 'react-icons/fa6';

const VideoComponentUpdated = ({url, controllers=null}) => {

    const videoRef = useRef();
    const videoRefFull = useRef();
    
    const [isPlay, setIsPlay] = useState(true);
    const [isMute, setIsMute] = useState(true);
    const [progress, setProgress] = useState(0);


    useEffect(()=>{
  observerFnc(videoRef);  //observe function
  },[])
  useEffect(()=>{
  observerFnc(videoRefFull);  //observe function
  },[])

  useEffect(()=>{
    if (isPlay) {
      videoRef?.current?.play();
    } else {
      videoRef?.current?.pause();
    }
  },[isPlay])


  const updateFnc = ()=>{
const video = videoRef.current;
if (video) {
  const currentWidth = (video.currentTime/video.duration)*100;
  setProgress(currentWidth);
}
  }

    const closeFullScreen = (e)=> {e.stopPropagation();controllers.setIsFullScreen(false)};
    const openFullScreen = (e)=> {e.stopPropagation();controllers.setIsFullScreen(true)};

    useEffect(()=>{
        if (videoRef?.current) {
            if (controllers?.isFullScreen === true) {
            setIsPlay(false);
            videoRefFull?.current?.play();
        }else{
            setIsPlay(true)
            videoRefFull?.current?.pause();
        }
        }
        
    },[controllers?.isFullScreen])

const handlePlay = () => {
    setIsPlay(true);
};

  const handlePause = () => {
    setIsPlay(false);
  };

  return (
    <div className='max-h-full w-full relative'>
          <video src={url} ref={videoRef} autoPlay muted={isMute} onTimeUpdate={updateFnc} onPlay={handlePlay} onPaste={handlePause} onEnded={handlePause} className='cursor-pointer w-full max-h-full object-cover mx-auto'>
            <source src={url} type="video/mp4" />
            <source src={url} type="video/webm" />
                Your browser does not support the video tag.
          </video>
           <div
                   onClick={(e) => {e.stopPropagation();setIsMute(prev => !prev)}}
                   className="absolute right-3 bottom-3 p-2 rounded-2xl bg-gray-600  hover:bg-gray-800"
                 >
                   {isMute ? <GoMute className='text-xl fill-white font-bold' /> : <GoUnmute className='text-xl fill-white font-bold'/>}
                 </div>
            {/* play pause */}
                  <div onClick={(e) => {e.stopPropagation();setIsPlay(prev=>!prev)}} className="absolute bottom-3 left-1 p-2 rounded-2xl bg-gray-600  hover:bg-gray-800">
                  {!isPlay?<FaCirclePlay className='text-2xl fill-white font-bold' />:<FaCirclePause className='text-2xl fill-white font-bold' />}
                  </div>

            {/* update  */}
            <div className="absolute h-1 bottom-0 left-0 bg-purple-800 transition-all ease-in-out" style={{width:`${progress}%`}}></div>
            

           { controllers?.isFullScreen && <div className='fixed inset-0 flex justify-center items-center z-50 bg-black'>
                {/* <div onClick={()=>setIsFullScreen(false)} className='h-screen w-screen fixed z-[41] bg-green-700'></div> */}
                <IoArrowBackOutline
                           onClick={closeFullScreen}
                            className="hover:bg-gray-600 active:scale-90 hover:scale-105 bg-gray-800 absolute text-white size-12 font-semibold top-5 left-5 p-2 rounded-3xl cursor-pointer "
                          />
                <video src={url} ref={videoRefFull} controls autoPlay muted={isMute} className='max-w-screen max-h-screen object-cover'></video>
            </div>
        }
    
        </div>
  )
}

export default VideoComponentUpdated