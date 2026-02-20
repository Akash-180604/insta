import React from 'react'
import dp from '../assets/dp.webp'
import { useNavigate } from 'react-router-dom'
import followFnc from '../getingData/followFnc';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';


const NotificationCard = ({notification}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

   const {userData} = useSelector(state=>state.user)


  return (
    <div
      className="hover:bg-gray-900 w-full bg-gray-950 border-b-[0.2px] border-gray-500 flex justify-between items-center py-1 px-2 rounded-2xl my-1 "
    >
      <div className="flex items-center">
        <div onClick={()=>navigate(`/profile/${notification?.sender?.userName}`)} className="w-9 h-9 rounded-full  bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 p-[0.16rem]   shrink-0 cursor-pointer mx-2">
          <div className="h-full w-full bg-white rounded-full">
            <img
              src={notification?.sender?.profileImage || dp}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
        <div className="h-full flex-1 px-2 flex-col items-center  cursor-default ">
          <p className='text-gray-100 text-sm flex'><span onClick={()=>navigate(`/profile/${notification?.sender?.userName}`)} className='font-semibold cursor-pointer truncate max-w-28'>{notification?.sender?.userName }</span>  {`.  ${notification?.message}`}</p>
        <p className='text-gray-200 text-xs cursor-default'>{moment(notification?.createdAt).fromNow()}</p>
        </div>

      </div>
      {notification?.type=='follow'? 
      <div onClick={()=>followFnc(notification?.sender?._id,userData._id,dispatch)} className='hover:scale-105 text-gray-950 text-xs font-semibold  bg-white px-2.5 py-1.5 rounded-full transition-all duration-100'>
        {((userData?.followings).includes(notification?.sender?._id))?'Following' : 'Follow'}
      </div>
      :
      <div className="h-full max-w-20 px-2 ">
        <div className=" h-9 rounded max-w-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 p-[0.1rem] shrink-0 cursor-pointer mx-2">
            {notification?.post &&(notification?.post?.mediaType=='image'?<img
              src={notification?.post?.media || dp}
              onClick={()=>navigate(`/post/${notification?.post?._id}`)}
              alt=""
              className="h-full max-w-full object-cover"
            />
        :<video onClick={()=>navigate(`/post/${notification?.post?._id}`)} src={notification?.post?.media}></video>
        ) }
        {notification?.reels && (
        <video onClick={()=>navigate(`/reels/${notification?.reels?._id}`)} src={notification?.reels?.media} className="h-full w-full object-cover"></video>
        )}
        </div>
      </div>
    }
    </div>
  )
}

export default NotificationCard