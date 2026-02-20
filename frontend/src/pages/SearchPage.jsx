import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { setPreviousSearchedUsers, setSearchedUserData } from "../redux/userSlice";
import { ImCancelCircle } from "react-icons/im";
import { IoSearchSharp } from "react-icons/io5";
import SearchedPageCard from "../components/searchedPageCard";


const SearchPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    const [input, setInput] = useState('');
    
    


  useEffect(()=>{
        const getPreviousSearchedUsers = async()=>{
            try {
            const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/getPreviousSearchedUsers`,{withCredentials:true})
            dispatch(setPreviousSearchedUsers(result.data))
            } catch (error) {
               console.log(error);  
            } 
        }
      
      getPreviousSearchedUsers()
    },[])





    useEffect(() => {
    // If input is cleared, we don't need to fetch anything
    if (!input.trim()) {
        dispatch(setSearchedUserData(null));
        return;
    }

    const delayDebounceFn = setTimeout(async () => {
        try {
            const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/search?input=${input}`, { withCredentials: true });
            dispatch(setSearchedUserData(result.data));
        } catch (error) {
            console.error("Search error:", error);
        }
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
}, [input, dispatch]);
    

    

    const {searchedUserData, previousSearchedUsers} = useSelector(state=>state?.user);    

  return (
    <div className="w-screen h-screen bg-black flex justify-center overflow-hidden">
      <div className="w-full max-w-[500px] h-screen flex flex-col bg-gray-950 rounded-2xl px-4 overflow-hidden">
        <div className=" w-full max-w-[500px] flex gap-8 py-3 border-b-[0.0001px] border-gray-700 rounded-xl">
          <IoArrowBackSharp
            onClick={() => navigate(-1)}
            className="hover:bg-gray-600 active:scale-90 hover:scale-105 bg-gray-800 size-9 rounded-2xl ml-2 p-1 cursor-pointer"
          />
          <h6 className="text-gray-100 text-xl font-semibold">Search User</h6>
        </div>
        <div className="w-full pl-2 my-2 relative flex items-center bg-gray-800 rounded-full ">
            <IoSearchSharp className="w-6 pr-1 h-full text-3xl text-gray-50" />
            <input type="text" value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Search User ....." className="w-full h-full bg-gray-900 text-sm px-2 py-2 text-gray-100 border-none outline-none" />
            {input && <ImCancelCircle onClick={()=>{setInput('');dispatch(setSearchedUserData(null))}} className="hover:bg-black hover:fill-white absolute right-3 text-xl bg-white fill-black rounded-full cursor-pointer" />}
        </div>
        <div className="py-3 flex-1 overflow-y-scroll pb-16">

          {!input.trim() && previousSearchedUsers?.length > 0 && <p className="text-xs text-green-50 font-thin px-4 pb-2">Previous Searched Users</p>}
          
          {(input.trim())?(
            <>
            {searchedUserData?.map((user)=>
              previousSearchedUsers?.some(prev=>prev?._id==user?._id) &&
              <SearchedPageCard user={user} key={`hist-${user._id}`} />)}

              {searchedUserData?.map((user)=>
              !previousSearchedUsers?.some(prev=>prev?._id===user?._id) &&
              <SearchedPageCard user={user} key={`new-${user._id}`} />)}
            </>
            ):
            previousSearchedUsers?.map((user)=>
              <SearchedPageCard user={user} key={`prev-${user._id}`} />
            )
            }


            {/* No user found */}
            {input.trim() && searchedUserData?.length === 0 && (
              <p className="text-gray-500 text-center text-sm mt-8">No users found</p>
            )}

        </div>
      </div>
    </div>
  );
};

export default SearchPage;
