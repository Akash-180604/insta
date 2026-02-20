import React, { useState } from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import { RiFullscreenFill, RiFullscreenExitFill } from "react-icons/ri";



const ImageComponent = ({url,controllers=null}) => {

    const closeFullScreen = (e)=> {e.stopPropagation();controllers.setIsFullScreen(false)}
    const openFullScreen = (e)=> {e.stopPropagation();controllers.setIsFullScreen(true)}


  return (
    <div className='max-h-full w-full relative'>
       <img src={url} alt=""  className='cursor-pointer w-full max-h-[400px] object-cover mx-auto' />
      
       { controllers?.isFullScreen && <div className='fixed inset-0 flex justify-center items-center z-50 bg-black'>
            {/* <div onClick={()=>setIsFullScreen(false)} className='h-screen w-screen fixed z-[41] bg-green-700'></div> */}
            <IoArrowBackOutline
                       onClick={closeFullScreen}
                        className="hover:bg-gray-600 active:scale-90 hover:scale-105 bg-gray-800 absolute text-white size-12 font-semibold top-5 left-5 p-2 rounded-3xl cursor-pointer "
                      />
            <img src={url} alt="" className='max-w-screen max-h-screen object-cover' />
       </div>
    }

    </div>
  )
}

export default ImageComponent