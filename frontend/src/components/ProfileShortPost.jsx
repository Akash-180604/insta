import React, { useState } from 'react'
import VideoComponent from './VideoComponent'
import { useNavigate, useParams } from 'react-router-dom';
import { MdSlowMotionVideo } from "react-icons/md";


const ProfileShortPost = ({post, PostIndex, navigateForm}) => {
    const navigate = useNavigate();
    const {userName} = useParams();

    const clickedFnc = ()=>{
    if (navigateForm=='profilePage') {
      navigate(`/posts/${userName}/${PostIndex}`)
    }else if(navigateForm=='savedProfile'){
      navigate(`/posts/${userName}/saved${PostIndex}`)
    }
  }

  return (
    <div onClick={clickedFnc} className='h-32 bg-black border-[1px] border-black cursor-pointer '>
       {post.mediaType=='image'?
          <img src={post.media} alt="" className=' w-full max-h-full object-cover'/>
          :<div className='w-full h-full relative bg-black'>
            <video src={post.media} muted={true} autoPlay={false}  className='w-full h-full object-cover' ></video>
            <MdSlowMotionVideo className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl fill-white ' />
          </div>
        // :<VideoComponent media={post.media} />
          }
    </div>
    
  )
}

export default ProfileShortPost