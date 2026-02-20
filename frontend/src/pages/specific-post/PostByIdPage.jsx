import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingComponent from '../../components/loadingComponent';
import ImagePost from '../../components/ImagePost';
import { IoArrowBackSharp } from 'react-icons/io5';

const PostByIdPage = () => {
  const {postId} = useParams();
  const navigate = useNavigate();
  

  const [post,setPost] = useState({});
  const [pageLoading,setPageLoading] = useState(false);

  useEffect(()=>{
    const getPostFnc = async()=>{
      
      setPageLoading(true)
      try {
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/post/getPostById/${postId}`,{withCredentials:true})
        setPost(result.data);
      setPageLoading(false)
      

      } catch (error) {
        console.log(error);
      setPageLoading(false)
      }
    }
    if (postId) {
      getPostFnc();
    }
  },[postId])

  return (
    <div className='w-screen min-h-screen bg-gray-950 flex justify-center '>
            <div className='w-full max-w-[500px] bg-gray-950 rounded-2xl pb-4 '>
              {pageLoading && <LoadingComponent/>}
            <div className='fixed z-30 top-0 w-full max-w-[500px] bg-gray-950 px-4 flex gap-8 py-3 border-b-[0.0001px] border-gray-700 rounded-b-xl'>
                <IoArrowBackSharp onClick={()=> navigate(-1)} className='hover:bg-gray-600 active:scale-90 hover:scale-105 bg-gray-800 size-9 rounded-2xl ml-2 p-1 cursor-pointer'/>
                <h6 className='text-gray-100 text-xl font-semibold'>Post</h6>
            </div>
      
          {post?._id && <div className='w-full my-16'>
            <ImagePost post={post} navigateFrom={'mainPage'} />
          </div>}

        
        </div>
     </div>
  )
}

export default PostByIdPage