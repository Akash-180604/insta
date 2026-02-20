import React, { useContext, useEffect, useState } from 'react'
import { IoArrowBackOutline, IoSearchSharp } from "react-icons/io5";
import { SiGooglegemini } from "react-icons/si";
import { useLocation, useNavigate } from "react-router-dom";
import UserMessageCard from './UserMessageCard'
import { useDispatch, useSelector } from 'react-redux';
import { setPrevMessageUserData } from '../../redux/messageSlice';
import axios from 'axios';

import { ImCancelCircle } from 'react-icons/im';
import Suggetion from '../../basicFunctions/Suggetion';
import { SocketDataContext } from '../../context/SocketContext';


const PrevMessageUser = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {pathname} = useLocation();
  

const {prevMessageUserData,conversationData} = useSelector((state)=>state.message);
  const {socket} = useContext(SocketDataContext);



  const [input, setInput] = useState('')
  const [filteredList, setFilteredList] = useState(prevMessageUserData)



useEffect(()=>{
const prevMessageUserFnc = async()=>{
  try {
    const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/message/getPrevUserMessages`,{withCredentials:true});
    dispatch(setPrevMessageUserData(result.data));
    setFilteredList(result.data)
    
  } catch (error) {
    console.log(error);
    
  }
}
prevMessageUserFnc();
},[dispatch,conversationData,pathname])

// search functionality
useEffect(()=>{
const searchInput = input.toLowerCase();
    if (input.trim()) {
        const filtered = prevMessageUserData.filter(data=>{
        return(
            data?.user?.userName?.toLowerCase().includes(searchInput) ||
            data?.user?.firstName?.toLowerCase().includes(searchInput) ||
            data?.user?.lastName?.toLowerCase().includes(searchInput)
            )
        })
        setFilteredList(filtered)
    }else{
        setFilteredList(prevMessageUserData);
    }
},[input,prevMessageUserData])

// impliment socket io
useEffect(()=>{
  const prevMessageUserFnc = async()=>{
  try {
    const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/message/getPrevUserMessages`,{withCredentials:true});
    dispatch(setPrevMessageUserData(result.data));
    
  } catch (error) {
    console.log(error);
  }
}
  socket?.on('newMessage',prevMessageUserFnc)

  return ()=>socket?.off('newMessage');
},[socket,setPrevMessageUserData])

  return (
    <div className=" min-h-screen w-full relative">
        <div className="  w-full  py-3 px-4 flex items-center gap-6 border-b-[0.001px] border-gray-600 rounded-xl ">
          <IoArrowBackOutline
            onClick={() => navigate('/')}
            className={`${pathname=='/'?'hidden':'block'} hover:scale-105 active:scale-90 hover:bg-gray-800 size-8 text-white text-2xl font-semibold text-start rounded-2xl p-1   cursor-pointer `}
          />
          <h1 className="text-white text-xl font-semibold text-center cursor-default">
            Messages
          </h1>
        </div>

        <div className="w-[90%] pl-2 my-2 mx-auto relative flex items-center bg-gray-800 rounded-full ">
            <IoSearchSharp className="w-6 pr-1 h-full text-3xl text-gray-50" />
            <input type="text" value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Search User ....." className="w-full h-full bg-gray-900 text-sm px-2 py-2 text-gray-100 border-none outline-none" />
            {input && <ImCancelCircle onClick={()=>setInput('')} className="hover:bg-black hover:fill-white absolute right-3 text-xl bg-white fill-black rounded-full cursor-pointer" />}
        </div>
        <div className=" overflow-x-hidden overflow-y-scroll min-h-full">
       
        {/* {prevMessageUserData?.map((user,idx)=>(
            <UserMessageCard user={user} key={idx}/>
        ))} */}
        
        {filteredList?.map((data,idx)=>(
            <UserMessageCard user={data?.user} lastMessage={data?.lastMessage} unSeenMessage={data?.unSeenMessage} key={idx}/>
        ))}
        <div onClick={()=>navigate('/message/AiAssistent')} className='hover:scale-105 active:scale-95 absolute group right-7 bottom-16 z-30 size-12 rounded-full bg-gray-900 border-[1px] border-gray-50 flex justify-center items-center bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 cursor-pointer '>
          <SiGooglegemini className='fill-blue-200 size-8'/>
          <Suggetion text='Ai Assistent' direction='top' />
        </div>
        

        </div>

        


      </div>
  )
}

export default PrevMessageUser