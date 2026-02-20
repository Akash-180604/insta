import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import dp from '../assets/dp.webp'
import { IoArrowBackSharp } from "react-icons/io5";

const OnlineUsersPage = () => {
    const navigate =useNavigate();
    
    const {onlineUserData} = useSelector(state=>state.socket);

    const [input, setInput] = useState('');
    const [filteredList, setFilteredList] = useState(onlineUserData);


    const searchFnc = (e)=>{
        const val = e.target.value;
        setInput(val);

    const searchInput = val.toLowerCase();
    if (val.trim()) {
        const filtered = onlineUserData.filter(user=>{
        return(
            user?.userName?.toLowerCase().includes(searchInput) ||
            user?.firstName?.toLowerCase().includes(searchInput) ||
            user?.lastName?.toLowerCase().includes(searchInput)
            )
        })
        setFilteredList(filtered)
    }else{
        setFilteredList(onlineUserData);
    }

}


  return (
        <div className='w-screen min-h-screen bg-black flex justify-center overflow-auto '>
            <div className='w-full max-w-[500px] bg-gray-950 rounded-2xl pb-16'>
                <div className='w-full max-w-[500px] p-2 flex items-center gap-6 px-7 fixed bg-gray-900 rounded-b-3xl border-b-[0.5px] border-slate-100'>
                    <IoArrowBackSharp onClick={()=> navigate(-1)} className=' hover:bg-gray-800 hover:border-b-[0.3px] border-gray-400 text-3xl rounded-xl cursor-pointer  '/>
                    <h1 className='font-bold text-xl text-gray-50 cursor-default'> Online Users </h1>
                </div>
                <div className='w-full py-2 px-8 pt-16 '>
                    <input type="text" placeholder='search online User....' value={input} onChange={searchFnc} className='outline-none border-none w-full px-3 py-1.5 text-white bg-gray-700 text-sm rounded-[24px]'/>
                </div>
                

                <div className='w-full px-3 pb-14 overflow-y-scroll'>
                    {filteredList?.map((user, idx)=>
                        <div key={idx} onClick={()=>navigate(`/profile/${user?.userName}`)} className='hover:bg-gray-800 h-[8vh] p-4 flex  items-center py-6 rounded-xl cursor-pointer border-b-[0.001px] border-gray-600'>
            <div className='w-10 h-10 rounded-full bg-violet-800 p-[0.07rem] shrink-0 cursor-pointer relative mx-3'>
                <img src={user?.profileImage || dp} alt="" className='h-full w-full rounded-full object-cover'/>
                <div className='size-3 absolute top-[1.5px] right-[1.5px] rounded-full bg-violet-600'/>
            </div>
            <div>
                <h2 className='font-medium  leading-3 text-gray-100 cursor-pointer'>{user?.userName}</h2>
                <p className='text-sm font-semibold text-gray-300'>{`${user?.firstName} ${user?.lastName}`}</p>
            </div>
        </div>
                )}

                {/* No user found */}
            {filteredList?.length === 0 && (
              <p className="text-gray-500 text-center text-sm mt-8">No Online user found in your followings</p>
            )}

                </div>
            </div>
        </div>
  )
}

export default OnlineUsersPage