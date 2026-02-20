import React, { useEffect, useRef } from 'react'
import moment from 'moment';
import { TailSpin } from 'react-loader-spinner';

const AiMessageChat = ({messageData,loading=false}) => {
  const scrollRef = useRef()

  const now = moment(messageData.createdAt);
const timeString = now.format("hh:mm A");

  

useEffect(() => {
  scrollRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messageData]);

  return (
    <div>
        <div ref={scrollRef} className={`flex justify-end w-full m-3 pr-2`}>
      <div className='bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-600 rounded-br-none max-w-[80%] md:max-w-[70%] w-fit p-2 pb-1 text-sm text-white rounded-3xl text-start break-words'>
            {messageData?.request}
        <div className='flex justify-end items-center inset-0   cursor-default'>
          <p className='text-[.6rem] font-semibold text-gray-200'>{timeString}</p>
        </div>
        </div>
    </div>

    {!loading && 
    <div ref={scrollRef} className='flex justify-start w-full m-3 pr-2'>
      <div className=' bg-gray-800 rounded-bl-none max-w-[80%] md:max-w-[70%] w-fit p-2 px-3 pb-1 text-sm text-white rounded-3xl text-start break-words'>
            {messageData?.response}
        </div>
    </div>
    }
    {loading && 
    <div ref={scrollRef} className='flex justify-start gap-4 w-full m-3 pr-2'>
        <TailSpin
        height="25"
        width="25"
        color="#fff"
        ariaLabel="tail-spin-loading"
      />
      <p> 🤔🤔🤔🤔 Thinking  ..... </p>

    </div>
    }
    </div>
     
  )
}

export default AiMessageChat
