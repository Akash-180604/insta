import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';
import { setOnlineUserData } from '../redux/socketSlice';

const AgetOnlineUserData = () => {
 const dispatch = useDispatch();
 const { onlineUsers } = useSelector(state=>state.socket);
 const { userData } = useSelector(state=>state.user);

useEffect(()=>{
const fetchOnlineUserData =async()=>{
try {
    const onlineIds = onlineUsers?.filter(userId => {
       return (userData?.followings).includes(userId)
    });
    if (onlineIds?.length>0) {
        const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/getOnlineUserData`,{onlineUsers:onlineIds},{withCredentials:true});
        dispatch(setOnlineUserData(result.data));
        
    }else{
        dispatch(setOnlineUserData([]));

    }
       
    } catch (error) {
        console.log(error);
        
    }
}
fetchOnlineUserData();
},[dispatch, onlineUsers])

    return null
}



export default AgetOnlineUserData