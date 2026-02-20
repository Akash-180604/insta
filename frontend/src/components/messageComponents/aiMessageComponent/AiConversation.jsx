import React, { useEffect, useState } from 'react'
import { IoArrowBackOutline, IoSend } from "react-icons/io5";
import { TailSpin } from 'react-loader-spinner'
import geminiPng from '../../../assets/geminiPng.webp'
import { useDispatch, useSelector } from 'react-redux';
import { setAiConversationData } from '../../../redux/messageSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import getingDate from '../../../basicFunctions/getingDate';
import AiMessageChat from './AiMessageChat';


const AiConversation = () => {
  const [message, setMessage] = useState('')
  const [prompt, setPrompt] = useState('')
  const[loading,setLoading] = useState(false);

  
  const navigate = useNavigate();
  const dispatch = useDispatch();



  const {aiConversationData} = useSelector(state=>state.message);
  const {userData} = useSelector(state=>state.user);



useEffect(()=>{
const aiGetConversationFnc = async()=>{
  try {
    const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/message/aiGetAllMessages`,{withCredentials:true});
    dispatch(setAiConversationData(result.data));
    

  } catch (error) {
    console.log(error); 
  }
}
aiGetConversationFnc()

},[dispatch])


  const sendMessageFnc = async()=>{
    if (!message.trim()) {
      alert('Enter some message!');
      setMessage('');
      return 
    }
    setLoading(true);
    setPrompt(message);
    setMessage('');
    try {
const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/message/aiSendMessage`,{message},{withCredentials:true});
dispatch(setAiConversationData([...aiConversationData,result.data]))

setLoading(false);
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


  return (
    <div className=" flex flex-col h-screen w-full overflow-hidden">

       <div className="w-full bg-gray-800 py-2 flex items-center px-3 border-b-[0.001px] border-gray-300 rounded-b-xl shrink-0">
        <IoArrowBackOutline
           onClick={() => navigate(-1)}
            className="lg:hidden hover:scale-105 active:scale-90 hover:bg-gray-800 size-8 p-1 text-white text-3xl font-semibold text-start rounded-2xl cursor-pointer "
          />
          <div className="w-10 h-10 rounded-full  bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 p-[0.16rem]   shrink-0 cursor-pointer mx-2">
            <div className="h-full w-full bg-white rounded-full">
              <img src={geminiPng} alt="" className='h-full w-full rounded-full object-cover'/>
            </div>
          </div>
          <div className="h-full w-full px-2 flex items-center">
              <h2 className="text-white font-medium text-xl my-auto truncate">Your Assistent</h2>
          </div> 
       </div>

       <div className="flex-1 p-4 overflow-y-scroll overflow-x-hidden space-y-4">
        {aiConversationData?.map((messageData,idx)=>{
          const date = new Date(messageData.createdAt);
          const currentDate = date.toLocaleDateString();
          const prevDate = idx>0? new Date(aiConversationData[idx-1].createdAt).toLocaleDateString():null
          const showDate = getingDate(date,true);
        return (<>
                {currentDate!==prevDate && <div className='mx-auto my-2 rounded-full py-1.5 px-4 bg-black text-gray-50 w-fit font-semibold text-xs'>{showDate}</div>}
                <AiMessageChat messageData={messageData} key={idx}/>
              </>)
        }
        )}

        {loading && <AiMessageChat messageData={{request:prompt,createdAt:Date.now()}} loading={true}/>}

        {!loading && aiConversationData.length == 0 && <div className='h-full w-full flex flex-col justify-center items-center gap-3 '>
         <h1 className='text-pink-500 text-3xl font-bold'> Hello' {userData?.firstName},</h1> <p className='text-violet-600 text-2xl font-semibold'>what's in your mind 🤗</p> 
          </div>}

        </div>
        
        <div className="relative z-10 w-full px-3 pb-2 flex items-center justify-evenly gap-1 shrink-0">
        <div  className="  flex items-center flex-1 min-h-[40px] py-2 rounded-full  bg-gray-950   ">
          <input type="text" placeholder="Enter message..." value={message} onChange={(e)=>setMessage(e.target.value)} onKeyDown={clickEnterFnc} className=" p-2 px-4 text-sm boeder-none outline-none w-full h-full text-white  bg-black overflow-hidden border-b-[0.1px] border-gray-400 rounded-[24px]" />          
        </div>
        {message && 
          <button onClick={sendMessageFnc} disabled={loading} className="px-4 mx-3 h-[80%] overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white rounded-full text-xl flex justify-center items-center">{loading?<TailSpin
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

export default AiConversation