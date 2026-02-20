import React, { useState } from "react";
import dp from '../assets/dp.webp'
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "./loadingComponent";
import { RxCross1 } from "react-icons/rx";
import { setPreviousSearchedUsers } from "../redux/userSlice";



const SearchedPageCard = ({user}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [pageLoading, setPageLoading] = useState(false);
    const { previousSearchedUsers } = useSelector(state=>state?.user);


const clickedFnc =async (user)=>{
      try {
        setPageLoading(true)
          const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/pushPreviousSearchedUsers/${user._id}`,{withCredentials:true})
          dispatch(setPreviousSearchedUsers(result.data))
          navigate(`/profile/${user?.userName}`);

        setPageLoading(false)
      } catch (error) {
        setPageLoading(false)
        console.log(error);
        
      }
    }

    const deleteSearchedUsers = async(e)=>{
      try {
        e.stopPropagation();
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/deletePreviousSearchedUsers/${user?._id}`,{withCredentials:true});
        dispatch(setPreviousSearchedUsers(result.data))
          console.log(result.data);
      
      } catch (error) {
        console.log(error);
        
      }
    }

  return (
    <div
      onClick={() => clickedFnc(user)}
      className="hover:bg-gray-900 active:scale-95 w-full bg-gray-950 border-b-[0.2px] border-gray-500 flex justify-between items-center py-1 px-2 rounded-2xl my-1 cursor-pointer"
    >
        {pageLoading && <LoadingComponent/>}  

      <div className="flex items-center">
        <div className="w-9 h-9 rounded-full  bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 p-[0.16rem]   shrink-0 cursor-pointer mx-2">
          <div className="h-full w-full bg-white rounded-full">
            <img
              src={user?.profileImage || dp}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
        <div className="h-full w-full px-2 flex-col justify-between">
          <h2 className="text-white font-medium text-sm truncate">
            {user?.userName}
          </h2>
          <p className="text-gray-300 text-xs">
            {user?.firstName} {user?.lastName}
          </p>
        </div>
      </div>
      <div className="h-full px-2 flex items-center gap-3">
      <div className="h-full w-16 px-2 flex-col justify-between">
        <h2 className="text-white font-medium text-sm truncate">
          {user?.followers?.length}
        </h2>
        <p className="text-gray-300 text-xs">Followers</p>
      </div>

          <div onClick={deleteSearchedUsers} className="active:scale-90 hover:scale-110">
      {previousSearchedUsers?.some(prev=>String(prev?._id)===String(user?._id)) &&  <RxCross1  className=" text-2xl cursor-pointer border-[1.5px] border-white rounded-full p-0.5"/>}
          </div>
      </div>
    </div>
  );
};

export default SearchedPageCard;
