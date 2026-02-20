import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setPostData } from '../redux/postSlice';

import axios from 'axios';

const AgetAllPost = () => {
 const dispatch = useDispatch();

useEffect(()=>{
const fetchPost =async()=>{
try {
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/post/getAllPost`,{withCredentials:true});
        dispatch(setPostData(result.data));
    } catch (error) {
        console.log(error);
        
    }
}
fetchPost();
},[dispatch])

return null
    
}

export default AgetAllPost