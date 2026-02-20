import React from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import shortCount from '../basicFunctions/shortCount';

const ProfileShortReel = ({reels, reelsIndex, navigateForm='profilePage'}) => {

const navigate = useNavigate();
const {userName} = useParams();

 const {userData} = useSelector(state=>state.user);


 const clickedFnc = ()=>{
    if (navigateForm=='profilePage') {
      navigate(`/reels/${userName}/${reelsIndex}`)
    }else if(navigateForm=='savedProfile'){
      navigate(`/reels/${userName}/saved${reelsIndex}`)
    }
  }

  return (
    <div onClick={clickedFnc} className=' h-52 bg-black border-[1px] border-black relative cursor-pointer'>
      <video src={reels?.media}  muted={true} autoPlay={false} width='full' className='w-full max-h-full object-cover' ></video>
      
      <div className=' absolute flex items-center gap-2 bottom-1 left-1'>
        {reels?.likes?.includes(userData?._id)?<FaHeart className='fill-[#E31B23] text-xl'/>:<FaRegHeart className=' fill-slate-200 text-xl'/>}
      <p className='text-base text-gray-100 font-semibold'>{shortCount(reels?.likes.length)}</p>
      </div>
    
    </div>
  )
}

export default ProfileShortReel