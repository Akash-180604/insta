import React, { useEffect, useState } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ImagePost from '../../components/ImagePost';


const WatchPosts = () => {
    const navigate = useNavigate();
    const {postIdx} = useParams();

    const [postDataList,setPostDataList] = useState(null)
    const [postIndex,setPostIndex] = useState(postIdx)
    const [navigateForm,setNavigateForm] = useState('')

    const {otherUserData} = useSelector(state=>state.user);


    useEffect(()=>{
      if(postIdx.startsWith('saved')){
      setPostDataList(otherUserData?.savedPosts);
      const i = Number(postIdx.slice(5));
      setPostIndex(i);
      setNavigateForm('savedProfile');
    }else{
      setPostDataList(otherUserData?.posts)
      setPostIndex(Number(postIdx));
      setNavigateForm('profilePage');
    }
    },[postIdx,navigate,otherUserData])
    



  return (
    <div className='w-screen min-h-screen bg-gray-950 flex justify-center '>
        <div className='w-full max-w-[500px] bg-gray-950 rounded-2xl pb-4'>
        <div className='fixed z-30 top-0 w-full max-w-[500px] bg-gray-950 flex gap-8 py-2 px-4'>
            <IoArrowBackSharp onClick={()=> navigate(-1)} className=' hover:bg-gray-950   text-3xl rounded cursor-pointer'/>
            <h6 className='text-gray-100 text-xl font-semibold'>Posts</h6>
        </div>
        <div className='w-full mt-14'>
            {postDataList?.map((post, idx)=>{
    if(idx>=postIndex){
    return (<ImagePost post={post} navigateFrom={navigateForm} key={idx}/>)}
  })}
  {postDataList?.map((post, idx)=>{
    if(idx<postIndex){
    return (<ImagePost post={post} navigateFrom={navigateForm} key={idx}/>)}
  })}
        </div>
        </div>
    </div>
  )
}

export default WatchPosts