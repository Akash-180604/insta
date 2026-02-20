import React, { useContext, useEffect, useRef, useState } from 'react'
import { IoArrowBackOutline, IoSend } from "react-icons/io5";
import { AiFillPicture } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import { TailSpin } from 'react-loader-spinner'
import dp from '../../assets/dp.webp'

import { useDispatch, useSelector } from 'react-redux';
import { markMessagesAsSeen, setConversationData, setSelectedUserData } from '../../redux/messageSlice';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MessageChat from './MessageChat';
import getingDate from '../../basicFunctions/getingDate';
import { SocketDataContext } from '../../context/SocketContext';
import { FaChevronDown } from 'react-icons/fa';


const Conversation = () => {


  const [frontendMedia, setFrontendMedia] = useState('');
  const [backendMedia, setBackendMedia] = useState(null);
  const [media, setMedia] = useState(null);
  const [message, setMessage] = useState('')
  const [loading,setLoading] = useState(false);
  const [conversationLoading,setConversationDataLoading] = useState(false);
  const [showDownBotton,setShowDownBotton] = useState(true);
  const [isNewconversation,setIsNewconversation] = useState(false);


  

  const fileRef = useRef()
  const scrollRef = useRef()
const mainRef = useRef()

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const {userId} = useParams();



const {conversationData, selectedUserData} = useSelector((state)=>state.message)
  const {userData} = useSelector(state=>state.user);
  const { onlineUsers} = useSelector(state=>state.socket);

  const {socket} = useContext(SocketDataContext);


//geting selectedUser data if selected user data is not set
useEffect(()=>{
const getselectedUserFnc = async()=>{
  try {
    if(!selectedUserData || String(userId)!==String(selectedUserData._id)){
    const selectedUserResult = await axios.get(`${import.meta.env.VITE_SERVER_URL}/message/getProfileById/${userId}`,{withCredentials:true});
    dispatch(setSelectedUserData(selectedUserResult.data));
    }
  } catch (error) {
    console.log(error); 
  }
}
if (userId) {
  getselectedUserFnc();
}
},[userId])

useEffect(()=>{
const getConversationFnc = async()=>{
  
  if(conversationData && String(conversationData[0]?.recever)!==userId && String(conversationData[0]?.sender)!==userId){
    setConversationDataLoading(true);
    dispatch(setConversationData([]));
    
  }
  try {
    const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/message/getAllMessages/${userId}`,{withCredentials:true});
  
  
    setConversationDataLoading(false);
    dispatch(setConversationData(result.data));
if (result.data?.length===0) {
  setIsNewconversation(true);
}

  } catch (error) {
    console.log(error); 
  setConversationDataLoading(false);

  }
}
if (userId) {
  getConversationFnc();
}

},[dispatch,userId])

useEffect(()=>{

  const unReadMessages = conversationData?.filter((mess)=>{
    return String(mess?.recever) === String(userData?._id) && (mess?.isRead !== 'seen'); 
    })
    if (userId  && unReadMessages?.length>0) {
      const idsArray = unReadMessages?.map(mess=> mess._id)

const markAsReadFnc = async()=>{
  try {
    await axios.post(`${import.meta.env.VITE_SERVER_URL}/message/markReadMessage`,{messageIds:idsArray,otherUserId:userId},{withCredentials:true}); 
    
  } catch (error) {
    console.log(error); 
  }
}
  markAsReadFnc();

}

},[userId,conversationData, userData?._id])


// 1. Add a cleanup effect
  useEffect(() => {
    // Cleanup function that runs when component unmounts or frontendMedia changes
    return () => {
      if (frontendMedia) {
        URL.revokeObjectURL(frontendMedia);
      }
    };
  }, [frontendMedia]);

  const handleMediaFnc = (e)=>{
    const file = e.target.files[0];

    if (!file) return;

    // Optional: Validate file size/type here before setting state
    if (file.size > 100 * 1024 * 1024) { // 100MB limit example
        alert("File too large!");
        return;
    }

    setBackendMedia(file);
    setFrontendMedia(URL.createObjectURL(file));
    
    if(file.type.includes('image')){
      setMedia('image');
    }else if(file.type.includes('video')){
      setMedia('video')
    }
  }

  const cancelMediaFnc = ()=>{
    setFrontendMedia('');
      setBackendMedia(null);
      setMedia('');
      if (fileRef.current) fileRef.current.value = "";
    
  }


  const sendMessageFnc = async()=>{
  setIsNewconversation(false);
    setLoading(true)
    try {
      const formData = new FormData();
      if(backendMedia){
        formData.append('media',backendMedia);
      formData.append('messageType',media);
      }else{
      formData.append('messageType','text');

      }
      formData.append('message',message);
      

const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/message/sendMessage/${userId}`,formData,{withCredentials:true});
dispatch(setConversationData([...conversationData,result.data]))
cancelMediaFnc()
setMessage('');
setLoading(false);

if (onlineUsers?.includes(selectedUserData?._id)) {
  const result2 = await axios.get(`${import.meta.env.VITE_SERVER_URL}/message/markReceivedMessageById/${result.data._id}`,{withCredentials:true});
  dispatch(setConversationData([...conversationData,result2.data]));
}


    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

const clickEnterFnc = (e)=>{
  if (e.key === 'Enter') {
    sendMessageFnc()
  }
}
const clickDownArrow = ()=>{ 
  scrollRef.current.scrollIntoView({ behavior: 'smooth' });
}
const scrollFnc = ()=>{
  if(!mainRef.current) return
  const {scrollHeight, clientHeight, scrollTop} = mainRef.current;
  const isShowButton = clientHeight + scrollTop < scrollHeight-300
  setShowDownBotton(isShowButton);
  
}
useEffect(()=>{
  const node = mainRef.current;
  if (node) {
  node.addEventListener('scroll', scrollFnc);
  return ()=>node.removeEventListener('scroll',scrollFnc);
  }
  
},[scrollFnc])



  // impliment socket io
useEffect(()=>{
  socket?.on('newMessage', (mess)=>{
dispatch(setConversationData([...conversationData,mess]));
  })

  return ()=>socket?.off('newMessage');
},[conversationData,setConversationData])


useEffect(()=>{
  const markAsReadFnc = (data)=>{  
    dispatch(markMessagesAsSeen({ senderId: userData._id }))
  }
  socket?.on('markAsReadMessage',markAsReadFnc)

  return ()=>socket?.off('markAsReadMessage');
},[socket,dispatch,userData._id])


  return (
    <div className=" flex flex-col h-screen w-full overflow-hidden">

       <div className="w-full bg-gray-800 py-2 flex items-center px-3 border-b-[0.001px] border-gray-300 rounded-b-xl shrink-0">
        <IoArrowBackOutline
           onClick={() => navigate(-1)}
            className="lg:hidden hover:scale-105 active:scale-90 hover:bg-gray-700 size-8 text-white text-3xl font-semibold text-start rounded-2xl mx-1 cursor-pointer "
          />
          <div
            onClick={() => navigate(`/profile/${selectedUserData?.userName}`)}
            className="w-10 h-10 rounded-full  bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 p-[0.16rem] shrink-0 cursor-pointer mx-2"
          >
            <div className="h-full w-full bg-white relative rounded-full">
              <img src={selectedUserData?.profileImage || dp} alt="" className='h-full w-full rounded-full object-cover'/>
              {onlineUsers?.includes(selectedUserData?._id) &&  <div className='size-3.5 absolute -top-0.5 -right-0.5 rounded-full bg-violet-700'/>}
            </div>
          </div>
          <div className="h-full w-full px-2 flex-col justify-between cursor-default">
              <h2 onClick={() => navigate(`/profile/${selectedUserData?.userName}`)} className="text-white font-medium text-sm truncate cursor-pointer">{selectedUserData?.userName}</h2>
              <p className="text-gray-300 text-xs">{selectedUserData?.firstName} {selectedUserData?.lastName}</p>
          </div> 
       </div>

       {conversationLoading && <div className='h-full w-full flex flex-col justify-center items-center gap-3 '>
         
         <TailSpin
        height="25"
        width="25"
        color="#fff"
        ariaLabel="tail-spin-loading"
      /> <p className='text-violet-600 text-xl font-semibold'>wait few Second </p> 
          </div>}

        {/* if they start new conversation */}
       {isNewconversation && <div className='h-full w-full flex flex-col justify-center items-center gap-3 '>
        <div className='flex-col items-center mb-10'>
            <div onClick={() => navigate(`/profile/${selectedUserData?.userName}`)} className="h-32 w-32 bg-white relative mx-auto rounded-full cursor-pointer">
              <img src={selectedUserData?.profileImage || dp} alt="" className='h-full w-full rounded-full object-cover'/>
              {onlineUsers?.includes(selectedUserData?._id) &&  <div className='size-8 absolute top-1 right-1 rounded-full bg-violet-700'/>}
            </div>
            <div className=" px-2 flex-col items-center cursor-default mt-5">
              <h2 onClick={() => navigate(`/profile/${selectedUserData?.userName}`)} className="text-pink-600 text-3xl font-semibold text-center cursor-pointer">{selectedUserData?.userName}</h2>
              <p className="text-blue-500 text-xl font-semibold text-center">{selectedUserData?.firstName} {selectedUserData?.lastName}</p>
              <p  className="text-violet-600 text-2xl font-semibold text-center mt-4  cursor-default">Start Conversation with {selectedUserData?.firstName}</p>
          </div>
          
        </div>
        </div>}


       <div ref={mainRef} className="flex-1 p-4 overflow-y-scroll overflow-x-hidden space-y-4">
        {conversationData?.map((messageData,idx)=>{
          const date = new Date(messageData.createdAt);
          const currentDate = date.toLocaleDateString();
          const prevDate = idx>0? new Date(conversationData[idx-1].createdAt).toLocaleDateString():null
          const showDate = getingDate(date,true);
          //unseen messages
          const prevIsRead = idx>0? conversationData[idx-1].isRead ==='seen':true;
          const currentIsRead = messageData.isRead==='seen';
          
        return (<div key={idx}>
                {String(messageData?.recever) === String(userData._id) && currentIsRead !== prevIsRead && <div className='flex items-center cursor-default'><hr className='flex-1 border-[0.001px] border-slate-800 mx-4' /> <div className='mx-auto my-2 rounded-full py-1 px-2 bg-gray-900 text-gray-100 w-fit font-semibold text-xs'>unread messages</div><hr className='flex-1 border-[0.001px] border-slate-800 mx-4'/></div>}
                {currentDate!==prevDate && <div className='mx-auto my-2 rounded-full py-1.5 px-4 bg-black text-gray-50 w-fit font-semibold text-xs'>{showDate}</div>}
                <MessageChat messageData={messageData} key={idx} isUserSend={(String(messageData.sender)===String(userData._id))}/>
              </div>)
        }
        )}
        <div ref={scrollRef} />
        </div>
        {/* DownArrow button */}
        {showDownBotton && <div onClick={ clickDownArrow } className='active:scale-95 hover:scale-110 hover:bg-gray-700 transition-all size-fit p-2 absolute bottom-16 right-3 flex justify-center items-center rounded-full bg-black cursor-pointer '><FaChevronDown className='text-xl fill-white '/></div>}
        
        <div className="relative z-10 w-full  px-3 flex items-start justify-evenly gap-1 shrink-0">
        <div  className="  flex items-center flex-1 min-h-[40px] py-2 rounded-full  bg-gray-950   ">
          <input type="text" placeholder="Enter message..." value={message} onChange={(e)=>setMessage(e.target.value)} onKeyDown={clickEnterFnc} className={`${message?'bg-gray-900':'bg-black'} p-2 px-4 text-sm boeder-none outline-none w-full h-full text-white overflow-hidden border-b-[0.1px] border-gray-400 rounded-[24px]`} />
          <input type="file" hidden accept='image/*,video/*' ref={fileRef} onChange={handleMediaFnc} onKeyDown={clickEnterFnc} />
          <button onClick={()=>fileRef.current.click()} className="p-3 mx-2 overflow-hidden text-white bg-black rounded-full flex justify-center items-center text-xl border-b-[0.1px] border-gray-300"><AiFillPicture/></button>
          
        </div>
        {frontendMedia && <div className="absolute top-[-130px] right-10 h-32  p-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-xl">
          <ImCancelCircle onClick={cancelMediaFnc} className='absolute z-40 right-2 top-2 hover:fill-gray-800 hover:bg-gray-100 bg-gray-800 fill-gray-100 text-xl rounded-full transition-all duration-75 cursor-pointer ' />
            {media=='image'?<img src={frontendMedia} className="h-full object-cover rounded-xl"/>:<video src={frontendMedia} muted autoPlay controls className="h-full w-full object-cover rounded-xl" ></video>}
            </div>}
        {(message.trim()||frontendMedia)&& 
          <button onClick={sendMessageFnc} disabled={loading} className="px-4 mx-3 h-[70%] my-auto overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white rounded-full text-xl flex justify-center items-center">{loading?<TailSpin
        height="25"
        width="25"
        color="#fff"
        ariaLabel="tail-spin-loading"
        //  visible={!loading}
      />:<IoSend/> }</button>
        }

        </div>
      </div>

  )
}

export default Conversation