import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dp from '../../assets/dp.webp'
import axios from 'axios'
import { setConversationData, setSelectedUserData } from '../../redux/messageSlice'
import { useDispatch, useSelector } from 'react-redux'
import { FaImage } from 'react-icons/fa'
import { RiFolderVideoFill } from 'react-icons/ri'
import { BiCheck, BiCheckDouble } from 'react-icons/bi'
import moment from 'moment'
import getingDate from '../../basicFunctions/getingDate'


const UserMessageCard = ({user, lastMessage, unSeenMessage}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {userId} = useParams()

const lastMessageDate = moment(lastMessage?.createdAt);
const timeString = lastMessageDate.format("hh:mm A");



const {selectedUserData} = useSelector((state)=>state.message)
const {userData} = useSelector((state)=>state.user)
const {onlineUsers} = useSelector((state)=>state.socket)

const handleConversationFnc =()=>{
  dispatch(setSelectedUserData(user));
  navigate(`/message/${user?._id}`)

}

  return (
    
<div onClick={handleConversationFnc} className={`${(userId && user?._id==userId)?'bg-blue-950':'hover:bg-gray-800 bg-gray-950'} ${unSeenMessage>0? 'bg-violet-950 hover:bg-violet-600':''}  hover:border-white  w-full  flex justify-between items-center gap-2 py-1.5 px-2 cursor-pointer border-b-[0.001px] border-gray-600 rounded-xl`}>
  <div className='flex w-full truncate'>

      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 p-[0.16rem] mx-1.5  shrink-0 cursor-pointer">
            <div className="h-full w-full bg-white rounded-full relative">
              <img src={user?.profileImage || dp} alt="" className='h-full w-full rounded-full object-cover'/>
              {onlineUsers?.includes(user?._id) &&  <div className='size-3 absolute -top-0.5 -right-0.5 rounded-full bg-violet-700'/>}
            </div>
          </div>

      <div className='flex-col justify-around w-full mx-1.5'>
        <h2 className="text-white font-semibold text-sm w-full truncate">{user?.userName}</h2>
        <div className='flex gap-2 w-full'>
        {String(lastMessage?.sender)==String(userData?._id) && (lastMessage?.isRead=='send'?<BiCheck className='fill-slate-100 font-semibold text-xl -mr-1'/>:<BiCheckDouble className={`${lastMessage?.isRead=='seen'?'fill-blue-500':'fill-gray-100'} font-semibold text-xl -mr-1`}/>)}
        {lastMessage?.messageType=='image' && <FaImage />}
        {lastMessage?.messageType=='video' && <RiFolderVideoFill />}
        {lastMessage?.message?<p className='text-gray-300 text-xs w-full truncate'>{lastMessage?.message}</p>
        :
        <p className='text-gray-400 text-xs w-full truncate'>{lastMessage?.mediaType}</p>
        }
        </div>
      </div> 
  </div>

  <div className='flex gap-2 '>
  <div className='w-12 flex-col justify-between items-center mx-1'>
    <p className='text-gray-200 text-xs w-full mx-auto truncate'>{getingDate(lastMessageDate)}</p>
    <p className='text-gray-200 text-[.7rem] mt-1 w-full truncate'>{timeString}</p>
  </div>

  {unSeenMessage>0 && <div className='h-full flex justify-center items-center p-1'><div className='text-xs font-semibold text-white flex justify-center items-center size-6 rounded-full bg-violet-700'>{unSeenMessage<100?unSeenMessage:'99+'}</div></div>}       
  

  </div>
          
        </div>
  )
}

export default UserMessageCard
