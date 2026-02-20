import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { GoUnmute, GoMute } from "react-icons/go";
import observerFnc from "../getingData/observerFnc";
import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";
import { RiFullscreenFill, RiFullscreenExitFill } from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";

const VideoComponent = ({ media }) => {
  const [isPlay, setIsPlay] = useState(true);
  const [isMute, setIsMute] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const videoRef = useRef();
  const videoRefFull = useRef();
  

  useEffect(()=>{
  observerFnc(videoRef);  //observe function
  },[])
  useEffect(()=>{
  observerFnc(videoRefFull);  //observe function
  },[])

  const [progress, setProgress] = useState(0);

  const updateFnc = ()=>{
const video = videoRef.current;
if (video) {
  const currentWidth = (video.currentTime/video.duration)*100;
  setProgress(currentWidth);
}
  }


  const playFnc = () => {
    if (isPlay) {
      videoRef.current.pause();
      setIsPlay(false);
    } else {
      videoRef.current.play();
      setIsPlay(true);
    }
  };

  return (
    <div className='w-full relative'>
      <video
        src={media}
        ref={videoRef}
        onClick={playFnc}
        autoPlay
        loop
        muted={isMute}
        onTimeUpdate={updateFnc}
        className="max-w-full max-h-full object-cover"
      >
        <source src={media} type="video/mp4" />
        <source src={media} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      <div onClick={() => {setIsFullScreen(true);setIsPlay(false)}} className='hover:bg-gray-800 absolute top-3 left-3 p-2 text-3xl text-white font-bold rounded-full bg-gray-600'><IoMdArrowRoundBack /></div>
      <div
        onClick={() => setIsMute(prev => !prev)}
        className="absolute right-9 bottom-3 p-2 text-xl font-bold rounded  hover:bg-gray-800"
      >
        {isMute ? <GoMute className='text-2xl fill-white font-bold' /> : <GoUnmute className='text-2xl fill-white font-bold'/>}
      </div>
      <div onClick={() => setIsFullScreen(prev => !prev)} className="absolute right-1 bottom-3 p-2 text-xl font-bold text-white rounded-full  hover:bg-gray-800  ">
        {isFullScreen?<RiFullscreenFill className='text-2xl fill-white font-bold'/>:<RiFullscreenExitFill className='text-2xl fill-white font-bold'/>}
      </div>

      {/* play pause */}
      <div onClick={playFnc} className="absolute bottom-3 left-1 text-3xl text-black flex items-center gap-2.5">
      {!isPlay?<FaCirclePlay  className='text-2xl fill-white font-bold'/>:<FaCirclePause className='text-2xl fill-white font-bold'/>}
      </div>
      {/* update  */}
      <div className="absolute h-1 bottom-0 left-0 bg-gray-900 transition-all ease-in-out" style={{width:`${progress}%`}}></div>
    
    { isFullScreen && <div className='fixed inset-0 flex justify-center items-center z-50 bg-black'>
                    {/* <div onClick={()=>setIsFullScreen(false)} className='h-screen w-screen fixed z-[41] bg-green-700'></div> */}
                    <IoArrowBackOutline
                               onClick={()=>setIsFullScreen(false)}
                                className="hover:bg-gray-900 active:scale-90 absolute text-white size-12 font-semibold top-5 left-5 p-2 rounded-3xl cursor-pointer "
                              />
                    <video src={media} ref={videoRefFull} controls autoPlay muted={isMute} className='max-w-screen max-h-screen object-cover'></video>
                </div>
            }
    </div>
  );
};

export default VideoComponent;
