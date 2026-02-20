import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:'user',
    initialState:{
        userData:null,
        otherUserData:null,
        followersData:null,
        followingsData:null,
        previousSearchedUsers:null,
        searchedUserData:null,
        notificationData:[]
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData = action.payload
        },
        setOtherUserData:(state,action)=>{
            state.otherUserData = action.payload
        },
        setFollowersData:(state,action)=>{
            state.followersData = action.payload
        },setFollowingsData:(state,action)=>{
            state.followingsData = action.payload
        },setPreviousSearchedUsers:(state,action)=>{
            state.previousSearchedUsers = action.payload
        },setSearchedUserData:(state,action)=>{
            state.searchedUserData = action.payload
        },setNotificationData:(state,action)=>{
            state.notificationData = action.payload
        }
    }
})

export const {setUserData ,setOtherUserData, setSearchedUserData, setFollowersData, setFollowingsData,setPreviousSearchedUsers, setNotificationData} = userSlice.actions;
export default userSlice.reducer;