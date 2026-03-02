import React from 'react'
import dp from '../assets/dp.webp'
import moment from 'moment'
import { capitalizeFirstLetter } from '../basicFunctions/stringFunctions';
import { useNavigate } from 'react-router-dom';

const ShowViewers = ({viewer}) => {
  const navigate = useNavigate();
  
  
  return (
    
     <div  className=' hover:bg-gray-900 h-11 w-full p-2 flex justify-between items-center rounded-2xl'>
               <div  className='flex items-center gap-2 p-3'> 
                <div onClick={()=>navigate(`/profile/${viewer?.vieweres?.userName}`)} className='w-8 h-8 rounded-full  bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 p-[0?.16rem]   shrink-0 cursor-pointer mx-2'>
          <div className='h-full w-full bg-white rounded-full'>
            <img src={viewer?.vieweres?.profileImage || dp} onClick={()=>navigate(`/profile/${viewer?.vieweres?.userName}`)} alt="" className='h-full w-full rounded-full object-cover border-[1px] border-white'/>
          </div>
        </div>
                <div className='h-full flex-col justify-between gap-1'>
                <h2 onClick={()=>navigate(`/profile/${viewer?.vieweres?.userName}`)} className='font-semibold text-base cursor-pointer'>{viewer?.vieweres?.userName}</h2>
                <p className='text-xs cursor-default'>{`${capitalizeFirstLetter(viewer?.vieweres?.firstName)} ${capitalizeFirstLetter(viewer?.vieweres?.lastName)}`}</p>
                </div>
                </div>
                <p className='text-sm px-2 cursor-default'>View {moment(viewer?.viewTime)?.fromNow()}</p>
            </div>
  )
}

export default ShowViewers