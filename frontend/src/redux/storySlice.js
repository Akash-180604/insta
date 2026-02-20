import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
    name:'story',
    initialState:{
        userStoryData:null,
        allStoryData:null,
        otherStoryData:[]
    },
    reducers:{
        setAllStoryData:(state,action)=>{
            state.allStoryData = action.payload
        },
        setUserStoryData:(state,action)=>{
            state.userStoryData = action.payload
        },
        setOtherStoryData:(state,action)=>{
            state.otherStoryData = action.payload
        }
    }
})

export const {setAllStoryData, setUserStoryData, setOtherStoryData} = storySlice.actions;
export default storySlice.reducer;