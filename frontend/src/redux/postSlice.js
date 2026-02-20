import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name:'post',
    initialState:{
        postData:[],
        likedUsersData:null
    },
    reducers:{
        setPostData:(state,action)=>{
            state.postData = action.payload
        },
        setLikedUsersData:(state,action)=>{
            state.likedUsersData = action.payload
        }
    }
})

export const {setPostData, setLikedUsersData} = postSlice.actions;
export default postSlice.reducer;