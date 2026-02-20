import React, { useEffect } from 'react'

import axios from 'axios';

const AmarkReceivedMessage = () => {


useEffect(()=>{
const merkReceived =async()=>{
try {
        await axios.get(`${import.meta.env.VITE_SERVER_URL}/message/markReceivedMessage`,{withCredentials:true});
        
    } catch (error) {
        console.log(error);
    }
}
merkReceived();
},[])

return null
    
}

export default AmarkReceivedMessage