import { createSlice } from "@reduxjs/toolkit";

const reelsSlice = createSlice({
    name:'reels',
    initialState:{
        reelsData:[]
    },
    reducers:{
        setReelsData:(state,action)=>{
            state.reelsData = action.payload
        }
    }
})

export const {setReelsData} = reelsSlice.actions;
export default reelsSlice.reducer;