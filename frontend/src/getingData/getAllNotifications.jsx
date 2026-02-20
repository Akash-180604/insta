import axios from 'axios'
import React from 'react'
import { setNotificationData } from '../redux/userSlice'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

 const AgetAllNotifications = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
            const getAllNotification = async()=>{
              try {          
              const result= await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/getAllNotification`,{withCredentials:true})
              dispatch(setNotificationData(result.data));
              } catch (error) {
                console.log(error);
                
              }
            }
            getAllNotification()
        },[dispatch])

}

export default AgetAllNotifications