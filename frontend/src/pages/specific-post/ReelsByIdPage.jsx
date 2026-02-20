import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReelsComponent from '../../components/ReelsComponent';
import { useParams } from 'react-router-dom';
import LoadingComponent from '../../components/loadingComponent';
import axios from 'axios';

const ReelsByIdPage = () => {

    const {reelsId} = useParams();

  const [currentReels,setCurrentReels] = useState({});
  const [pageLoading,setPageLoading] = useState(false);

  useEffect(()=>{
    const getReelsFnc = async()=>{
      setPageLoading(true)
      try {
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/reels/getReelsById/${reelsId}`,{withCredentials:true})
        setCurrentReels(result.data);
        setPageLoading(false)

      } catch (error) {
        console.log(error);
        setPageLoading(false)
      }
    }
    getReelsFnc()
  },[])

  const {reelsData} = useSelector(state=>state.reels);

  return (
    <div className='w-screen flex justify-center items-center bg-black overflow-y-scroll snap-y snap-mandatory'>
       <div className='w-full max-w-[500px] h-screen flex-col justify-center items-center'>
        {pageLoading && <LoadingComponent/>}

        {currentReels?._id &&<div className='w-full h-screen snap-start'>
            <ReelsComponent reels={currentReels} navigateFrom='reelsPage' />
        </div>}

        {reelsData?.map((reels,idx) =>
            <div key={idx} className='w-full h-screen snap-start'>
            <ReelsComponent reels={reels} navigateFrom='reelsPage' />
            </div>
        )}
        </div> 
    </div>
  )
}

export default ReelsByIdPage