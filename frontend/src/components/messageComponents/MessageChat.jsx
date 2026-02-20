import React, { useEffect, useRef } from 'react'
import moment from 'moment';
import { BiCheck, BiCheckDouble } from "react-icons/bi"
import ImageComponentSimple from '../ImageComponentSimple';

const MessageChat = ({messageData, isUserSend}) => {
  const scrollRef = useRef();
  const initRef = useRef(true);

  const now = moment(messageData.createdAt);
const timeString = now.format("hh:mm A");

  

useEffect(() => { //scroll effect
  if (initRef.current == true) {
     const element = scrollRef.current
  if (isUserSend || messageData?.isRead === 'seen') {
  element?.scrollIntoView({ behavior: "smooth" });
  } else {
    if (element.scrollHeight > element.clientHeight) {
      // Calculate 60vh in pixels
      const vh60InPixels = window.innerHeight * 0.6;
        // If it can scroll, scroll by 60vh amount
        element.scrollTop += vh60InPixels; // Scrolls down by 60vh from the current position
        initRef.current = false
    }else{
      element?.scrollIntoView({ behavior: "smooth" });
    }
  }
  }
}, [messageData]);

  return (
     <div ref={scrollRef} className={`flex ${isUserSend ?'justify-end':'justify-start'} w-full m-3 pr-2`}>
      <div className={` ${isUserSend ?'bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-600 rounded-br-none ':'bg-gray-800 rounded-bl-none'} max-w-[80%] md:max-w-[65%] min-w-16 w-fit p-2 px-3 pb-1 text-sm text-white rounded-3xl text-start break-words`}>
            {messageData?.messageType=='text'&& messageData.message}
        {messageData?.messageType=='image'&& 
          <div className='max-w-full'>
            <ImageComponentSimple url={messageData?.media}/>
            {/* <img src={messageData?.media} alt="" className='w-full max-h-48 object-cover rounded-xl' /> */}
            <p className='font-semibold text-sm px-1 mt-1.5 -mb-1'>{messageData?.message}</p>
            </div>
        }
        {messageData?.messageType=='video'&& 
          <div>
            <video src={messageData?.media} controls muted autoPlay mute className='w-full object-cover rounded-xl'></video>
            <p>{messageData?.message || ''}</p>
            </div>
        }
        <div className='flex justify-end items-center inset-0   cursor-default'>
          <p className='text-[.6rem] font-semibold text-gray-200'>{timeString}</p>
          {isUserSend && (messageData?.isRead=='send'?<BiCheck className='fill-slate-100 font-semibold text-xl -mr-1'/>:<BiCheckDouble className={`${messageData?.isRead=='seen'?'fill-blue-500':'fill-gray-100'} font-semibold text-xl -mr-1`}/>)}
        </div>
        </div>
    </div>
  )
}

export default MessageChat
