import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'

import dp from '../../assets/dp.webp'
import { IoArrowBackSharp } from "react-icons/io5";
import { setFollowersData } from '../../redux/userSlice';
import followFnc from '../../getingData/followFnc';

const GetFollowers = () => {
    const {userName} =useParams();
    const navigate =useNavigate();
    const dispatch =useDispatch();
    

    const [input, setInput] = useState('');
    const [filteredList, setFilteredList] = useState([]);

    const {userData, followersData} = useSelector(state=>state.user);

    useEffect(()=>{
        const getFollowersFnc = async ()=>{
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/getFollowers/${userName}`,{withCredentials:true});
            dispatch(setFollowersData(result.data));
            setFilteredList(result.data);
            
        }
        getFollowersFnc()
    },[userName,followFnc])


    const searchFnc = (e)=>{
        const val = e.target.value;
        setInput(val);

    const searchInput = val.toLowerCase();
    if (val.trim()) {
        const filtered = followersData.filter(user=>{
        return(
            user?.userName?.toLowerCase().includes(searchInput) ||
            user?.firstName?.toLowerCase().includes(searchInput) ||
            user?.lastName?.toLowerCase().includes(searchInput)
            )
        })
        setFilteredList(filtered)
    }else{
        setFilteredList(followersData);
    }

}


  return (
        <div className='w-screen min-h-screen bg-black flex justify-center overflow-auto '>
            <div className='w-full max-w-[500px] bg-gray-950 rounded-2xl pb-16'>
                <div className='w-full max-w-[500px] p-3 flex items-center gap-6 px-7 fixed bg-gray-950 '>
                    <IoArrowBackSharp onClick={()=> navigate(-1)} className=' hover:bg-gray-900 hover:border-b-[0.3px] border-gray-400 text-3xl rounded-xl cursor-pointer  '/>
                    <h1 className='font-bold text-xl text-gray-50 cursor-default'>{ userName }  <span className='font-semibold'>Followers</span></h1>
                </div>
                <div className='w-full py-2 px-8 pt-16 '>
                    <input type="text" placeholder='search followers....' value={input} onChange={searchFnc} className='outline-none border-none w-full px-3 py-1 text-white bg-gray-700 text-sm rounded-[24px]'/>
                </div>
                <div className='w-full py-2 px-20 pt-2 flex items-center gap-8'>
                    <div className='flex-1 text-white text-sm font-semibold text-center py-2 border-b-2 border-white cursor-pointer'>{followersData?.length} Followers</div>
                    <div onClick={()=>navigate(`/profile/followings/${userName}`)} className='hover:border-gray-400 hover:text-gray-400 flex-1 text-gray-500 text-sm font-semibold text-center py-2 border-b-2 border-gray-500 cursor-pointer'> Followings</div>
                </div>


                <div className='w-full px-3 pb-14 overflow-y-scroll'>
                    {filteredList?.map((user, idx)=>
                        <div key={idx} onClick={()=>navigate(`/profile/${user?.userName}`)} className='hover:bg-gray-800 h-[8vh] p-2 flex justify-between items-center py-6 rounded-xl cursor-pointer border-b-[0.001px] border-gray-600'>
           <div className='  flex items-center gap-2 p-3'> 
            <div className='w-9 h-9 rounded-full  bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 p-[0.16rem]   shrink-0 cursor-pointer mx-2'>
      <div className='h-full w-full bg-white rounded-full'>
        <img src={user?.profileImage || dp} alt="" className='h-full w-full rounded-full object-cover'/>
      </div>
    </div>
            <div>
            <h2 className='font-medium  leading-3 text-gray-100 cursor-pointer'>{user?.userName}</h2>
            <p className='text-sm font-semibold text-gray-300'>{`${user?.firstName} ${user?.lastName}`}</p>
            </div>
            </div>
            {String(user._id)!==String(userData._id)?
            <div onClick={(e)=>{followFnc(user?._id,userData._id,dispatch); e.stopPropagation()}} className='hover:scale-105 text-gray-950 text-xs font-semibold  bg-white px-2.5 py-1.5 rounded-full transition-all duration-100'>
            {((userData?.followings).includes(user?._id))?'Following' : 'Follow'}
            
            </div>:<div className='text-sm text-gray-300 px-4 cursor-default'>You</div>}
        </div>
                    )}


                    {/* No user found */}
            {filteredList?.length === 0 && (
              <p className="text-gray-500 text-center text-sm mt-8">No Folloewr found</p>
            )}
                </div>
            </div>
        </div>
  )
}

export default GetFollowers