import axios from 'axios'
import React from 'react'

import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../../config/firebaseAuth'
import googleLogo from '../../assets/google-logo.avif'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUserData } from '../../redux/userSlice'

const GoogleAuthBtn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    

    const googleAuthFnc = async (e)=>{
         e.preventDefault();
        try {
            const response = await signInWithPopup(auth,provider);
            

            const formData = {
            name: response.user.displayName,
            email: response.user.email,
            profileImage: response.user.photoURL || ""
        };
            
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/googleAuth`,formData,{withCredentials:true});

            dispatch(setUserData(result.data));
            navigate('/');
            
        } catch (error) {
            console.log(error);
            
        }
    }

  return (
    <button onClick={googleAuthFnc} className='hover:scale-105 active:scale-95 w-[90%] py-1 h-8 mx-auto bg-white flex justify-center items-center gap-3 rounded-full transition-all  cursor-pointer'>
        <img src={googleLogo} className='object-cover h-full'/>
        <p className='text-gray-950 text-sm font-semibold'>Continue with Google</p>
    </button>
  )
}

export default GoogleAuthBtn