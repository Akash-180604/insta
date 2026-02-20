import React from 'react'
import { useSelector } from 'react-redux'
import ReelsComponent from '../components/ReelsComponent';

const ReelsPage = () => {


    const {reelsData} = useSelector(state=>state.reels);
    const {userData} = useSelector(state=>state.user);

  return (
    <div className='w-screen flex justify-center items-center bg-black  overflow-y-scroll snap-y snap-mandatory'>
       <div className='w-full max-w-[500px] h-screen flex-col justify-center items-center'>
        
        {reelsData?.map((reels,idx)=>
            (userData?.followings?.includes(reels?.author?._id)) &&
            (<div key={idx} className='w-full h-screen snap-start'>
            <ReelsComponent reels={reels} navigateFrom='reelsPage' />
            </div>)
          )}
          {reelsData.map((reels,idx)=>
            (userData?.previousSearchedUsers?.includes(reels?.author?._id)) &&
            !(userData?.followings?.includes(reels?.author?._id)) &&
             (<div key={idx} className='w-full h-screen snap-start'>
            <ReelsComponent reels={reels} navigateFrom='reelsPage' />
            </div>)
          )}
          {reelsData.map((reels,idx)=>
            !(userData?.previousSearchedUsers?.includes(reels?.author?._id)) &&
            !(userData?.followings?.includes(reels?.author?._id)) &&
              (<div key={idx} className='w-full h-screen snap-start'>
            <ReelsComponent reels={reels} navigateFrom='reelsPage' />
            </div>)
          )}
        </div> 
    </div>
  )
}

export default ReelsPage