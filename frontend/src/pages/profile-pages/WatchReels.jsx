import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ReelsComponent from '../../components/ReelsComponent';

const WatchReels = () => {

    const {reelsIdx} = useParams();


const [reelsDataList,setReelsDataList] = useState(null)
    const [reelsIndex,setReelsIndex] = useState(reelsIdx)
    const [navigateForm,setNavigateForm] = useState('')

    const {otherUserData} = useSelector(state=>state.user);



    useEffect(()=>{
      if(reelsIdx.startsWith('saved')){
      setReelsDataList(otherUserData?.savedReels);
      const i = Number(reelsIdx.slice(5));
      setReelsIndex(i);
      setNavigateForm('savedProfile');
    }else{
      setReelsDataList(otherUserData?.reels)
      setReelsIndex(Number(reelsIdx));
      setNavigateForm('profilePage');
    }
    },[reelsIdx,otherUserData])


  return (
    <div className='w-screen flex justify-center items-center bg-black  overflow-y-scroll snap-y snap-mandatory'>
       <div className='w-full max-w-[500px] h-screen flex-col justify-center items-center'>
        {
        reelsDataList?.map((reels,idx) =>{
            if(idx >= reelsIndex){
            return (<div key={idx} className='w-full h-screen snap-start'>
                        <ReelsComponent reels={reels} navigateFrom={navigateForm} key={idx} />
                    </div>)
        }}
        )}
        {
        reelsDataList?.map((reels,idx) =>{
            if(idx < reelsIndex){
            return (<div key={idx} className='w-full h-screen snap-start'>
                        <ReelsComponent reels={reels} navigateFrom={navigateForm} key={idx} />
                    </div>)
        }}
        )}
        </div> 
    </div>
  )
}

export default WatchReels