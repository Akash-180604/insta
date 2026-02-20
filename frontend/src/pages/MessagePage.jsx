import React, { useEffect } from 'react'
import axios from 'axios'
import PrevMessageUser from '../components/messageComponents/PrevMessageUser'
import Conversation from '../components/messageComponents/Conversation'

import { useDispatch, useSelector } from 'react-redux';
import { setConversationData, setPrevMessageUserData, setSelectedUserData } from '../redux/messageSlice';
import { useParams } from 'react-router-dom';
import AiConversation from '../components/messageComponents/aiMessageComponent/AiConversation';


const MessagePage = () => {

const dispatch = useDispatch();
const {userId} = useParams();


// useEffect(()=>{
// const prevMessageUserFnc = async()=>{
//   try {
//     const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/message/getPrevUserMessages`,{withCredentials:true});
//     dispatch(setPrevMessageUserData(result.data));
//   } catch (error) {
//     console.log(error);
    
//   }
// }
// prevMessageUserFnc();
// },[dispatch])

// useEffect(()=>{
// const getConversationFnc = async()=>{
//   try {
//     const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/message/getAllMessages/${userId}`,{withCredentials:true});
//     dispatch(setConversationData(result.data));
    
//     if(!selectedUserData || String(userId)!==String(selectedUserData._id)){
//     const selectedUserResult = await axios.get(`${import.meta.env.VITE_SERVER_URL}/message/getProfileById/${userId}`,{withCredentials:true});
//     dispatch(setSelectedUserData(selectedUserResult.data));
//     }

//   } catch (error) {
//     console.log(error); 
//   }
// }
// if (userId) {
//   getConversationFnc();
// }

// },[dispatch,userId])


  return (
    <div className=" h-screen w-screen flex  bg-gray-950 ">
        <div className={`${userId?'md:block hidden':'block w-full'} md:w-[33%] md:border-r-[0.2px] md:border-gray-600 min-h-screen `}>
          <PrevMessageUser />
          </div>
        <div className={`${userId?'block':'hidden md:block '} md:w-[66%] h-screen w-screen`}>         
         {userId == 'AiAssistent'? <AiConversation/>: 
          userId?
          <Conversation/>
          :<div className='h-full w-full flex justify-center items-center text-center text-white text-3xl'>Start Conversation</div>
         }
          </div>
    </div>
  )
}

export default MessagePage