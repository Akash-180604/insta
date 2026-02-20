import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setAllStoryData, setUserStoryData } from '../redux/storySlice';

import axios from 'axios';

const AgetAllStory = () => {
const dispatch = useDispatch();

useEffect(()=>{
const fetchStory =async()=>{
try {
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/story/getAllStory`,{withCredentials:true});
        dispatch(setAllStoryData(result.data));
        const userResult = await axios.get(`${import.meta.env.VITE_SERVER_URL}/story/userStory`,{withCredentials:true});
        dispatch(setUserStoryData(userResult.data));

    } catch (error) {
        console.log(error.response.data);
        console.log(error);
        
    }
}
fetchStory();
},[dispatch])
return null;
    
}

export default AgetAllStory