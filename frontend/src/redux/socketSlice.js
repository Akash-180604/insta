import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name:'socket',
    initialState:{
        socket:null,
        onlineUsers:[],
        onlineUserData:[]
    },
    reducers:{
        setSocket:(state,action)=>{
            state.socket = action.payload
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload
        },
        setOnlineUserData:(state,action)=>{
            state.onlineUserData = action.payload
        },
    }
})

export const { setSocket, setOnlineUsers, setOnlineUserData } = socketSlice.actions;
export default socketSlice.reducer;