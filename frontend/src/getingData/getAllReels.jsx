import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setReelsData } from '../redux/reelsSlice';

import axios from 'axios';

const AgetAllReels = () => {
const dispatch = useDispatch();

useEffect(()=>{
const fetchReels =async()=>{
try {
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/reels/getAllReels`,{withCredentials:true});
        dispatch(setReelsData(result.data));
    } catch (error) {
        console.log(error.response.data);
        console.log(error);
        
    }
}
fetchReels();
},[dispatch])
    
}

export default AgetAllReels