import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

import axios from 'axios';

const getUserData = () => {
 const dispatch = useDispatch();

useEffect(()=>{
const fetchUser =async()=>{
try {
    const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/getUserData`,{withCredentials:true}); 
     dispatch(setUserData(result.data));     
} catch (error) {
    console.log(error);   
    }
}
fetchUser();
},[dispatch])
    
}

export default getUserData