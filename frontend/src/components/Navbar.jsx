import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import dp from '../assets/dp.webp'
import { useSelector } from 'react-redux'
import { AiFillHome } from "react-icons/ai";
import { ImLoop } from "react-icons/im";
import { IoSearchSharp } from "react-icons/io5";
import { MdDriveFolderUpload } from "react-icons/md";
import { useState } from 'react';
import Suggetion from '../basicFunctions/Suggetion';
import { BiLogoInstagramAlt } from 'react-icons/bi';

const Navbar = () => {

const [showNav,setShowNav] = useState(true)
  const {pathname} = useLocation();
  
 const hiddenNavPaths = ['/message','/story','/upload','/posts','/reels']
  useEffect(()=>{
  setShowNav(true)
  hiddenNavPaths.forEach(path => {
 if(pathname.startsWith(path)){
  setShowNav(false)
}
});

  },[pathname])

  const navigate = useNavigate();
 const {userData} = useSelector(state=>state.user);


  const divStyle = 'hover:bg-white active:scale-90 flex flex-1 rounded-xl justify-center items-center h-full w-full group'
  const iconStyle = 'text-3xl group-hover:fill-black'
  return (
    
      <div className={`${showNav?'fixed':'hidden'} md:left-0 md:flex-col md:w-16 md:h-80 md:translate-x-0 md:translate-y-1/2 md:bottom-1/2 md:bg-black z-40 bottom-0 w-full max-w-[450px] md:rounded-xl rounded-t-lg h-14 left-1/2 -translate-x-1/2 flex justify-between items-center sm:rounded-2xl sm:border-[1px] border-white p-2 gap-2 bg-slate-950`}>
        <div onClick={()=>navigate('/')} className={divStyle}><AiFillHome className={iconStyle} /><Suggetion text={'Home'} /></div>
        <div onClick={()=>navigate('/reels')} className={divStyle} ><BiLogoInstagramAlt className={iconStyle}/><Suggetion text={'Reels'} /></div>
        <div onClick={()=>navigate('/upload')} className={divStyle}><MdDriveFolderUpload className={iconStyle}/><Suggetion text={'Upload'} /></div>
        <div onClick={()=>navigate('/search')} className={divStyle}><IoSearchSharp className={iconStyle}/><Suggetion text={'Search'} /></div>
        <div onClick={()=>navigate(`/profile/${userData.userName}`)} className='hover:bg-white hover:text-black active:scale-90 flex flex-1 rounded-xl justify-center items-center h-full w-full group'><div className='h-9 w-9 bg-white rounded-full border-[1px] group-hover:border-black'><img src={userData.profileImage || dp} alt="" className='overflow-hidden h-full w-full object-cover rounded-full' /></div><Suggetion text={'Profile'} /></div>
    </div>
  )
}

export default Navbar