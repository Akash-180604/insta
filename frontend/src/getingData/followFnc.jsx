import axios from "axios"

import { setUserData } from "../redux/userSlice";

const followFnc = async (id,userId,dispatch) => {

try {
if(String(userId)===String(id)){
    console.log('user cant follow itsalf');
    return 
       }
    const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/follow/${id}`,{withCredentials:true});
    dispatch(setUserData(result.data));

} catch (error) {
   console.log(error);
    
}

}

export default followFnc