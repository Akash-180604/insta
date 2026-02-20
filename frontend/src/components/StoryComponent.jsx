import React from 'react'
import { useNavigate } from 'react-router-dom'

const StoryComponent = ({story}) => {
  const navigate = useNavigate();
  
  return (
    <div onClick={()=>navigate(`/story/${story?.author?.userName}`)} className='flec-col justify-center items-center gap-1 h-full'>
      <div className='w-14 h-14 rounded-full  bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 p-[0.16rem]   shrink-0 cursor-pointer'>
      <div className='h-full w-full bg-white rounded-full'>
        <img src={story?.author?.profileImage} alt="" className='w-full h-full object-cover rounded-full overflow-hidden' />
      </div>
    </div>
    <p className='w-10 truncate text-gray-200 font-medium text-xs'>{story.author.userName}</p>
    </div>
  )
}

export default StoryComponent