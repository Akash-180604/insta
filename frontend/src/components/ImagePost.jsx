import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import moment from 'moment';
import dp from '../assets/dp.webp'
import { FaRegHeart,FaHeart, FaFacebookMessenger } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { GrSend } from "react-icons/gr";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { SlOptionsVertical } from "react-icons/sl";
import { useDispatch, useSelector } from 'react-redux';
import VideoComponent from './VideoComponent';
import { setLikedUsersData, setPostData } from '../redux/postSlice';
import followFnc from '../getingData/followFnc';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner'
import { setOtherUserData, setUserData } from '../redux/userSlice';
import ImageComponent from './ImageComponent';
import Suggetion from '../basicFunctions/Suggetion';
import VideoComponentUpdated from './VideoComponentUpdated';
import { SocketDataContext } from '../context/SocketContext';
import { capitalizeFirstLetter } from '../basicFunctions/stringFunctions';

const ImagePost = ({post, navigateFrom = 'mainPage'}) => {
  

const[showmore,setShowmore] = useState(false);
const[comment,setComment] = useState('');
const[showComment,setShowComment] = useState(false);
const[showLike,setShowLike] = useState(false);
const[loading,setLoading] = useState(false);
const[showMenuDiv,setShowMenuDiv] = useState(false);
const[showEditDiv,setShowEditDiv] = useState(false);
const[caption,SetCaption] = useState(post?.caption);
const[editPostLoading,setEditPostLoading] = useState(false);


const dispatch = useDispatch()
const navigate = useNavigate()
const postRef = useRef()


const {userData}= useSelector(state=>state.user);
const {postData}= useSelector(state=>state.post);
const {socket} = useContext(SocketDataContext);


// This is for ProfilePage when anyOne click in any post
const {otherUserData} = useSelector(state=>state.user);
const {likedUsersData} = useSelector(state=>state.post);

const[author,setAuthor] = useState(null);

useEffect(()=>{
  
if (navigateFrom == 'mainPage' || navigateFrom == 'savedProfile') {
 setAuthor(post?.author);
}else if (navigateFrom == 'profilePage'){
 setAuthor(otherUserData);
}
},[otherUserData,navigate,navigateFrom])

const isFollow = (userData.followings).some((id)=>String(id)===String(author?._id))

  const likeFnc = async ()=>{
    try {
      const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/post/like/${post._id}`,{withCredentials:true});
const updatedPost = result.data;
console.log(navigateFrom);

if (navigateFrom == 'mainPage') {
  const updatedData = postData.map(
      (p)=> String(p._id)===String(post._id)?updatedPost:p 
    );
    dispatch(setPostData(updatedData));  
}else if (navigateFrom == 'profilePage'){
  
  const updated = otherUserData?.posts?.map(
      (p)=> String(p._id)===String(post._id)?updatedPost:p 
    );
    const updatedOtherUser = {...otherUserData,posts:updated}
 dispatch(setOtherUserData(updatedOtherUser));
}else if (navigateFrom == 'savedProfile'){
  
  const updated = otherUserData?.savedPosts?.map(
      (p)=> String(p._id)===String(post._id)?updatedPost:p 
    );
    const updatedOtherUser = {...otherUserData,savedPosts:updated}
 dispatch(setOtherUserData(updatedOtherUser));
}
    
    } catch (error) {
      console.log(error);
      
    }
  }

  const likeDoubleClickFnc = async()=>{
    postRef.current.classList.add('likeAnimation')
    
  if(!(post?.likes?.includes(String(userData._id)))){
    await likeFnc();
    
  }
  const timeOut = setTimeout(()=>{
    postRef?.current.classList.remove('likeAnimation')
    
  },2100);
  return ()=>clearTimeout(timeOut)
}


  const commentFnc = async ()=>{
    setLoading(true)
    try {
      const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/post/comment/${post._id}`,{message:comment},{withCredentials:true});
const updatedPost = result.data;
console.log(result.data);

if (navigateFrom == 'mainPage') {
   const updatedData = postData.map(
      (p)=> String(p._id)===String(post._id)?updatedPost:p 
    );
dispatch(setPostData(updatedData));
}else if (navigateFrom == 'profilePage'){
  
  const updated = otherUserData?.posts?.map(
      (p)=> String(p._id)===String(post._id)?updatedPost:p 
    );
    const updatedOtherUser = {...otherUserData,posts:updated}
 dispatch(setOtherUserData(updatedOtherUser));
}else if (navigateFrom == 'savedProfile'){
  
  const updated = otherUserData?.savedPosts?.map(
      (p)=> String(p._id)===String(post._id)?updatedPost:p 
    );
    const updatedOtherUser = {...otherUserData,savedPosts:updated}
 dispatch(setOtherUserData(updatedOtherUser));
}
setLoading(false);
setComment('');
    } catch (error) {
      console.log(error);
      setLoading(false);
      
    }
  }

  const savedPostFnc = async ()=>{
    try {
      const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/post/saved/${post._id}`,{withCredentials:true})
      dispatch(setUserData(result.data))
      console.log(result);

dispatch(setUserData(result.data));
    } catch (error) {
      console.log(error);
      
    }
  }

  // show liked users function
  const likedUsers = async()=>{
    try {
      setShowLike(true);
      const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/post/likedUsers/${post._id}`,{withCredentials:true})
      dispatch(setLikedUsersData(result.data));
      console.log(result.data);
      
      
    
    } catch (error) {
      console.log(error);
      
    }
  }

  // share function
  const shareFnc =async ()=>{
    const baseURL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

    if(navigator.share){
      try {
        await navigator.share({
          title:`${author?.userName} Post`,
          text:post?.caption,
          url:`${baseURL}/post/${post?._id}`
        })
        console.log('share sucessfull');
      } catch (error) {
        console.log('share error',error);
      }
    }else{
      navigator.clipboard.writeText(`${baseURL}/post/${post?._id}`);
      alert('Sharing is not happend in Your web browser \n link copied to clipboard')
    }
  }


  // Impliment socket io privious when socket is stored in redux
useEffect(()=>{
socket?.on('likedPost', (updatedPost)=>{

if (navigateFrom == 'mainPage') {
 
  const updatedData = postData.map(
      (p)=> String(p._id)===String(updatedPost.postId)?{...p,likes:updatedPost.likes}:p );
      dispatch(setPostData(updatedData));

}else if (navigateFrom == 'profilePage'){
  
  const updated = otherUserData?.posts?.map(
      (p)=> String(p._id)===String(post._id)?{...p,likes:updatedPost.likes}:p 
    );
    const updatedOtherUser = {...otherUserData,posts:updated}
 dispatch(setOtherUserData(updatedOtherUser));
}else if (navigateFrom == 'savedProfile'){
  
  const updated = otherUserData?.savedPosts?.map(
      (p)=> String(p._id)===String(post._id)?{...p,likes:updatedPost.likes}:p 
    );
    const updatedOtherUser = {...otherUserData,savedPosts:updated}
 dispatch(setOtherUserData(updatedOtherUser));
}

})
socket?.on('commentedPost', (updatedPost)=>{


if (navigateFrom == 'mainPage') {
 
  const updatedData = postData.map(
      (p)=> String(p._id)===String(updatedPost.postId)?{...p,comments:updatedPost.comments}:p );
      dispatch(setPostData(updatedData));

}else if (navigateFrom == 'profilePage'){
  
  const updated = otherUserData?.posts?.map(
      (p)=> String(p._id)===String(post._id)?{...p,comments:updatedPost.comments}:p 
    );
    const updatedOtherUser = {...otherUserData,posts:updated}
 dispatch(setOtherUserData(updatedOtherUser));
}else if (navigateFrom == 'savedProfile'){
  
  const updated = otherUserData?.savedPosts?.map(
      (p)=> String(p._id)===String(post._id)?{...p,comments:updatedPost.comments}:p 
    );
    const updatedOtherUser = {...otherUserData,savedPosts:updated}
 dispatch(setOtherUserData(updatedOtherUser));
}
})

return ()=> {
  socket?.off('likedPost');
  socket?.off('commentedPost');
}
},[socket,postData,dispatch])

//single click and dubble click
const [isFullScreen,setIsFullScreen] = useState(false)

const timerRef = useRef(null);
  const DBL_CLICK_DELAY = 300; // milliseconds

    const handleClick = useCallback(() => {
    // Clear the timer if it's already running (meaning a double click is likely happening)
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    } else {
      // Set a timer to execute the single click logic after a short delay
      timerRef.current = setTimeout(() => {
        setIsFullScreen(true);
        

        timerRef.current = null; // Reset the timer reference
      }, DBL_CLICK_DELAY);
    }
  }, []);

const handleDoubleClick = useCallback(() => {
    // Clear the timer immediately to prevent the single click from running
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    likeDoubleClickFnc()
  }, []);

  useEffect(()=>{
    const closeShowMenuDivDiv = (e)=>{
      
      if (showMenuDiv) {
        if (!e.target.classList[0].includes('editDiv')) {
        setShowMenuDiv(false);
        }
      }
      
    }
    
    document.addEventListener('mousedown',closeShowMenuDivDiv);

    return ()=> {
      document.removeEventListener("mousedown", closeShowMenuDivDiv);    
    }
  },[showMenuDiv])

  const editPostFnc = async ()=>{
    setEditPostLoading(true);
    try {
    const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/post/editPost/${post._id}`,{caption},{withCredentials:true});

      if (navigateFrom == 'mainPage') {
  const updatedData = postData.map(
      (p)=> String(p._id)===String(post._id)?{...p, caption:caption}:p
    );
    dispatch(setPostData(updatedData));  
}else if (navigateFrom == 'profilePage'){
  
  const updated = otherUserData?.posts?.map(
      (p)=> String(p._id)===String(post._id)?{...p, caption}:p 
    );
    const updatedOtherUser = {...otherUserData,posts:updated}
 dispatch(setOtherUserData(updatedOtherUser));
}else if (navigateFrom == 'savedProfile'){
  
  const updatedSavedPosts = otherUserData?.savedPosts?.map(
      (p)=> String(p._id)===String(post._id)?{...p, caption}:p 
    );
    const updatedPost = otherUserData?.posts?.map(
      (p)=> String(p._id)===String(post._id)?{...p, caption}:p 
    );
    const updatedOtherUser = {...otherUserData,savedPosts:updatedSavedPosts, posts:updatedPost}
 dispatch(setOtherUserData(updatedOtherUser));
}
    setEditPostLoading(false);
    setShowEditDiv(false);

    } catch (error) {
      console.log(error);
    setEditPostLoading(false);

      
    }
  }


  const deletePostFnc = async ()=>{
  const userResponse = confirm('Are you sure to delete the Post?');
  if (!userResponse) {
    return
  }
    try {
    const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/post/deletePost/${post._id}`,{withCredentials:true});

      if (navigateFrom == 'mainPage') {
  const updatedData = postData.filter(
      (p)=> String(p._id)!==String(post._id) 
    );
    dispatch(setPostData(updatedData));  
}else if (navigateFrom == 'profilePage'){
  
  const updated = otherUserData?.posts?.filter(
      (p)=> String(p._id)!==String(post._id) 
    );
    const updatedOtherUser = {...otherUserData,posts:updated}
 dispatch(setOtherUserData(updatedOtherUser));
}else if (navigateFrom == 'savedProfile'){
  
  const updatedSavedPosts = otherUserData?.savedPosts?.filter(
      (p)=> String(p._id)!==String(post._id)
    );
    const updatedPost = otherUserData?.posts?.filter(
      (p)=> String(p._id)!==String(post._id) 
    );
    const updatedOtherUser = {...otherUserData,savedPosts:updatedSavedPosts, posts:updatedPost}
 dispatch(setOtherUserData(updatedOtherUser));
 setShowMenuDiv(false);
}
    } catch (error) {
      console.log(error);
      
    }
  }


  return (
    <div className='w-full shadow-xl '>
        <div className='p-2 flex justify-between items-center gap-2'>
           <div className='flex items-center gap-2'> 
            <div onClick={()=>navigate(`/profile/${author?.userName}`)} className='active:scale-90 w-10 h-10 rounded-full  bg-white p-[0.04rem] shrink-0 cursor-pointer mx-0.5'>
      <div className='h-full w-full bg-white rounded-full'>
        <img src={author?.profileImage || dp} alt="" className='h-full w-full rounded-full object-cover'/>
      </div>
    </div>
            <div>
            <h2 onClick={()=>navigate(`/profile/${author?.userName}`)} className='active:scale-90 font-semibold text-sm leading-3 cursor-pointer text-white'>{capitalizeFirstLetter(author?.userName)}</h2>
            <p className='text-xs cursor-pointer text-gray-200'>{`${capitalizeFirstLetter(author?.firstName)} ${capitalizeFirstLetter(author?.lastName) || ''}`}</p>
            <p className='text-[.6rem] text-white'>Posted {moment(post?.createdAt).fromNow()}</p>
            </div>
            </div>

            {String(author?._id)!==String(userData._id)?
            <div onClick={()=>followFnc(author?._id,userData._id,dispatch)} className='active:scale-90 text-gray-900 text-sm font-semibold  bg-white px-4 py-2 rounded-full cursor-pointer'>
            {isFollow?'Following' : 'Follow'}
            </div>:
            <div className='relative text-sm text-gray-300 px-4 flex gap-3 items-center cursor-default'>Your Post 
            
            {/* it is menu for edit and delete post */}
            <SlOptionsVertical onClick={()=>setShowMenuDiv(prev=>!prev)} className='editDiv hover:bg-gray-900 hover:border-b-[0.3px] active:scale-95 border-gray-400 p-2 text-3xl rounded-full cursor-pointer'/>
            {showMenuDiv && <div className='editDiv absolute min-w-36 z-50 p-1 py-2 top-8 right-7 w-fit rounded-sm flex-col gap-1 transition bg-gray-900'>
              <div onClick={()=>{setShowEditDiv(true);}} className='editDiv w-full rounded-lg text-white font-semibold text-sm hover:bg-gray-700 active:scale-95 py-1.5 px-2 text-nowrap border-gray-600 transition cursor-pointer'>Edit Post</div>
              <div onClick={deletePostFnc} className='editDiv rounded-lg w-full hover:bg-gray-700 active:scale-95 py-1.5 px-2 font-semibold text-sm text-white text-nowrap border-gray-600 transition cursor-pointer'>Delete Post</div>
            </div>}
            </div>}
        </div>

         {showEditDiv && <div onClick={()=>setShowEditDiv(false)} className='fixed z-50 top-0 left-0 h-screen w-screen overflow-hidden flex justify-center items-center rounded-lg bg-black/70'>
              <div onClick={(e)=>e.stopPropagation()} className='flex-col p-5 pb-10 w-full sm:max-w-[500px] bg-gray-950'>
                <IoArrowBackSharp onClick={()=>setShowEditDiv(false)} className='hover:scale-110 active:scale-90 text-3xl rounded-xl  cursor-pointer'/>
                  
                  <div className='max-w-44 max-h-44 mb-7 overflow-hidden mx-auto'>
                    {post.mediaType=='image'?
          <img src={post?.media} alt="" className=' max-w-full max-h-full object-contain'/>
          :<video src={post?.media} autoPlay={false} controls className=' w-full max-h-full object-contain'/>
          }
                  </div>
                  <div className={` ${caption?'border-[1.5px] border-gray-400 bg-gray-950':'bg-gray-700'} w-full rounded-lg relative  px-2.5 py-1 my-3.5`}>
          <h6 className={`${!caption?'hidden':''} text-white absolute top-[-12px]  text-xs  bg-gray-950 gray-950  px-1`}>Set caption*....</h6>
          <input type='text' value={caption} onChange={(e)=>SetCaption(e.target.value)} placeholder='Set caption*....' className={` ${caption?'bg-gray-950':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>
        <div className=' w-full text-center flex justify-center' ><button disabled={editPostLoading} onClick={editPostFnc} className='hover:scale-105 active:scale-95 transition w-[70%] text-center flex justify-center rounded-full bg-blue-50 text-black font-bold p-1.5 mt-4 '> {editPostLoading?<TailSpin
                height="25"
                width="25"
                color="#111"
                ariaLabel="tail-spin-loading"
                 visible={editPostLoading}
              />:'Edit Post' }</button>
        </div>
              </div>
          </div>}


        <div onDoubleClick={handleDoubleClick} onClick={handleClick} className='max-h-[500px] w-full bg-slate-400 relative overflow-hidden'> 
          {post.mediaType=='image'?
          // <img src={post.media} alt="" className=' w-full max-h-full object-cover'/>
          <ImageComponent url={post?.media} controllers={{isFullScreen,setIsFullScreen}}/>
          :<VideoComponentUpdated url={post?.media} controllers={{isFullScreen,setIsFullScreen}} />
          }

        <FaHeart ref={postRef} className='fill-[#FD1D1D] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl opacity-0'/>
        </div>
        <div className='px-3 w-full '><p onClick={()=>setShowmore((prev)=>!prev)} className={`text-white text-sm cursor-pointer m-1 p-2 ${showmore?'':'truncate '}`}>{post.caption || ''}</p></div>
        <div className='h-fit flex justify-between px-4 mb-2'>
            <div className='flex flex-col gap-1.5' >
                         <div className='flex flex-row justify-between w-12'>
                            <div className='flex items-center gap-1 pr-1.5 '>{post?.likes.includes(userData._id)? <FaHeart onClick={likeFnc} className='active:scale-90 fill-[#FD1D1D] text-xl cursor-pointer '/>:<FaRegHeart onClick={likeFnc} className='active:scale-90 fill-slate-200 text-xl cursor-pointer'/>}
                            <p onClick={likedUsers} className='text-sm text-gray-100 cursor-pointer'>{post?.likes?.length }</p>
                            </div>
                            <div onClick={()=>setShowComment(true)} className='active:scale-90 flex items-center gap-1 px-1 cursor-pointer'><FaRegComment className='fill-slate-200 text-xl cursor-pointer'/>
                            <p className='text-sm text-gray-100'>{post?.comments?.length }</p>
                            </div>
                            <div onClick={shareFnc} className='active:scale-90 flex items-center gap-1 px-1 cursor-pointer'><GrSend className='fill-slate-200 text-xl cursor-pointer'/>
                            <p className='text-sm text-gray-100'>Shere</p>
                            </div>
                        </div>  
                        <p className='text-xs'>{post?.likes?.length } Likes and {post?.comments?.length } Comments</p>
 
                        </div>
            <div onClick={savedPostFnc} className='group relative'>{(userData?.savedPosts).includes(post?._id)?<FaBookmark className='active:scale-90 text-2xl text-gray-100 cursor-pointer'/>:<FaRegBookmark className='text-2xl text-gray-100 cursor-pointer' />}<Suggetion text={'SavePost'} direction='bottom' /></div>
        </div>
        <div className='w-full px-2 h-8 flex gap-2 mb-2'>
          <input type="text" placeholder='Write a Comment' value={comment} onChange={(e)=>setComment(e.target.value)} className='border-none outline-none rounded-full p-2 px-4 h-full flex-1 bg-gray-800 text-sm text-white'/>
          {comment &&  <button onClick={commentFnc} disabled={loading} className="active:scale-90 p-4 overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white rounded-full text-xl flex justify-center items-center">{loading?<TailSpin
        height="25"
        width="25"
        color="#fff"
        ariaLabel="tail-spin-loading"
        //  visible={!loading}
      />:<IoSend/> }</button>
          }
           </div>

          
            {/* Comment Div */}
            {showComment && <div onClick={()=>setShowComment(false)} className='fixed z-30 bg-black/30 h-screen w-screen top-0 left-0 flex justify-center items-end overflow-y-hidden'>
              <div onClick={(e)=>e.stopPropagation()} className=' p-2 h-[50vh] rounded-t-2xl bg-gray-800 w-full max-w-[500px] pb-16'>
                <div className='w-full border-b-[1px] flex items-center p-2'>
                <IoMdArrowRoundBack onClick={()=>setShowComment(false)} className='active:scale-90 hover:scale-105 hover:bg-gray-700 size-8 p-1 rounded-2xl  fill-white' />
                <h1 className='mx-3 text-white font-xl cursor-default'> Comments </h1>
              </div>
              
              {/* View Comments */}
              <div className='w-full h-full overflow-y-auto pb-12'>
                {post.comments.map((comment,idx)=>
                <div key={idx} className='h-11 p-2 flex justify-start items-center gap-4 '>
           <div  className='flex items-center gap-2 p-3'> 
            <div onClick={()=>navigate(`/profile/${comment?.author?.userName}`)} className='active:scale-90 w-8 h-8 rounded-full  bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 p-[0.16rem]   shrink-0 cursor-pointer mx-2'>
      <div className='h-full w-full bg-white rounded-full'>
        <img src={comment?.author?.profileImage || dp} onClick={()=>navigate(`/profile/${comment?.author?.userName}`)} alt="" className='h-full w-full rounded-full object-cover'/>
      </div>
    </div>
            <div>
            <h2 onClick={()=>navigate(`/profile/${comment?.author?.userName}`)} className='font-bold text-sm leading-3 cursor-pointer'>{comment?.author?.userName}</h2>
            <p className='text-xs cursor-default'>{`${comment?.author?.firstName} ${comment?.author?.lastName}`}</p>
            </div>
            </div>
            <p className='text-sm '> {comment?.message} </p>
        </div>
                )}
                </div>
                </div>
              </div>}
          
          
          




    

          {/* setLikedUsersData part */}
          {showLike && 
          <div className='fixed z-30 bottom-0 left-0  rounded-xl  w-full '>
            <div onClick={()=>{setShowLike(false);dispatch(setLikedUsersData(null))}} className=' w-screen h-screen overflow-hidden bg-black/30 fixed left-0 top-0 z-10 '></div>
            <div className='flex-col p-2 h-[50vh] rounded-t-2xl bg-gray-800 bottom-0 z-30 absolute left-1/2 transform -translate-x-1/2 w-full max-w-[500px] pb-16'>
              <div className='w-full border-b-[1px] flex items-center p-2 mb-2'>
                <IoMdArrowRoundBack onClick={()=>{setShowLike(false);dispatch(setLikedUsersData(null))}} className='active:scale-90 hover:scale-105 hover:bg-gray-700 size-8 p-1 rounded-2xl fill-white cursor-pointer' />
                <h1 className='mx-3 text-white font-xl cursor-default'> Liked Users </h1>
              </div>

        {/* View likedUsers */}
        <div className='overflow-y-auto'>
                {likedUsersData?.map((user,idx)=>
                <div key={idx} className='hover:bg-gray-700 h-10 p-2 flex justify-between items-center py-6 rounded-full'>
           <div  className='  flex items-center gap-2 p-3'> 
            <div onClick={()=>navigate(`/profile/${user?.userName}`)} className='active:scale-90 w-9 h-9 rounded-full  bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 p-[0.16rem]   shrink-0 cursor-pointer mx-2'>
      <div className='h-full w-full bg-white rounded-full'>
        <img src={user?.profileImage || dp} onClick={()=>navigate(`/profile/${user?.userName}`)} alt="" className='h-full w-full rounded-full object-cover'/>
      </div>
    </div>
            <div>
            <h2 onClick={()=>navigate(`/profile/${user?.userName}`)} className='font-medium  leading-3 text-gray-100 cursor-pointer'>{user?.userName}</h2>
            <p className='text-sm font-semibold text-gray-300 cursor-default'>{`${user?.firstName} ${user?.lastName}`}</p>
            </div>
            </div>
            {String(user._id)!==String(userData._id)?
            <div onClick={()=>followFnc(user?._id,userData._id,dispatch)} className='  text-gray-900 text-xs font-semibold  bg-white px-2 py-1 rounded-full cursor-pointer'>
            {((userData?.followings).includes(user._id))?'Following' : 'Follow'}
            
            </div>:<div className='text-sm text-gray-300 px-4 cursor-default'>You</div>}
        </div>
                )}
                </div>
            </div>
            
            </div>
          }

    </div>
  )
}

export default ImagePost