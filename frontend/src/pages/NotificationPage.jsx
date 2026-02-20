import React, { useContext } from 'react'
import { useEffect } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setNotificationData } from '../redux/userSlice';
import NotificationCard from '../components/NotificationCard';
import axios from 'axios';
import { SocketDataContext } from '../context/SocketContext';

const NotificationPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    
    const { notificationData} = useSelector(state=>state.user);
      const {socket} = useContext(SocketDataContext);


    

    useEffect(()=>{
        const markAsReadFnc = async()=>{
          try {
          const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/markAsReadNotification`,{withCredentials:true})
          dispatch(setNotificationData(result.data));
          console.log(result.data);
          } catch (error) {
            console.log(error); 
          }
        }

        markAsReadFnc();
    },[])

    // impliment socket io
    useEffect(()=>{
        socket?.on('newNotification',(noti)=>{
          dispatch(setNotificationData([noti,...notificationData]));
        })
    },[socket,dispatch,notificationData])

  return (
    <div className="w-screen h-screen bg-black flex justify-center overflow-hidden">
          <div className="w-full max-w-[500px] h-screen flex flex-col bg-gray-950 rounded-2xl px-4 overflow-hidden">
            
            <div className=" w-full max-w-[500px] flex gap-8 py-3 border-b-[0.0001px] border-gray-700 rounded-xl">
              <IoArrowBackSharp
                onClick={() => navigate(-1)}
                className="hover:bg-gray-800 active:scale-90 text-3xl  rounded-lg ml-2 my-auto cursor-pointer"
              />
              <h6 className="text-gray-100 text-xl font-semibold">Notifications</h6>
            </div>

            <div className="py-3 flex-1 overflow-y-scroll pb-16">
            {notificationData?.map((notification,idx)=>(
                <NotificationCard key={idx} notification={notification}/>
            ))}
            
            </div> 
        </div>
</div>
  )
}

export default NotificationPage