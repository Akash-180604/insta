import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment';
import { TailSpin } from 'react-loader-spinner';
import { TbCopyPlus } from "react-icons/tb";
import { BiCheck } from "react-icons/bi"

const AiMessageChat = ({messageData,loading=false}) => {
  const scrollRef = useRef();

  const [isCopyed,setIsCopyed] = useState(false);

  const now = moment(messageData.createdAt);
const timeString = now.format("hh:mm A");

const coptTextFnc = async ()=>{
  setIsCopyed(true);
  await window.navigator.clipboard.writeText(messageData?.response);

  setTimeout(()=>{
    setIsCopyed(false);
  },2000)
}  

useEffect(() => {
  scrollRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messageData]);

  return (
    <div>
        <div ref={scrollRef} className={`flex justify-end w-full m-3 pr-2`}>
      <div className='bg-violet-950 rounded-br-none max-w-[80%] md:max-w-[70%] w-fit p-2 pb-1 text-sm text-white rounded-3xl text-start break-words'>
            {messageData?.request}
        <div className='flex justify-end items-center inset-0   cursor-default'>
          <p className='text-[.6rem] font-semibold text-gray-200'>{timeString}</p>
        </div>
        </div>
    </div>

    {!loading && 
    <div ref={scrollRef} className='flex justify-start w-full m-3 pr-2'>
      <div className='bg-gray-900/50 max-w-[80%] md:max-w-[70%] w-fit rounded-bl-none rounded-3xl'>
          <pre className=' p-2 px-3 pb-1 text-sm text-white text-start break-words'>
            {messageData?.response}
        </pre>
      
      <div className=' mx-auto mt-2 flex justify-end p-1'>
      {!isCopyed?
    <div onClick={coptTextFnc} className=' hover:bg-black active:scale-95 transition-all flex items-center gap-1 bg-gray-950 px-2 py-0.5  mr-2 rounded-lg w-fit border-[0.01px] border-gray-700 cursor-pointer'><TbCopyPlus className=' text-gray-900 size-4' /><p className='text-gray-100 font-semibold text-xs'>Copy Text</p></div>
    :<div className='flex items-center px-2 py-0.5 bg-green-700 gap-1 mr-2 rounded-lg w-fit cursor-pointer'><BiCheck className='text-white size-4 font-semibold' /><p className='text-white font-semibold text-xs'>Text Copied</p></div>
    }
      </div>
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
      <p> Thinking  ..... </p>

    </div>
    }
    </div>
     
  )
}

export default AiMessageChat
