import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:'message',
    initialState:{
        conversationData:[],
        prevMessageUserData:[],
        selectedUserData:null,
        aiConversationData:[]
    },
    reducers:{
        setConversationData:(state,action)=>{
            state.conversationData = action.payload
        },
        setPrevMessageUserData:(state,action)=>{
            state.prevMessageUserData = action.payload
        },
        setSelectedUserData:(state,action)=>{
            state.selectedUserData = action.payload
        },
        setAiConversationData:(state,action)=>{
            state.aiConversationData = action.payload
        },
        
        markMessagesAsSeen: (state, action) => {
      const { senderId } = action.payload;
      state.conversationData = state.conversationData.map((mess) => {
        if (String(mess.sender) === String(senderId) && mess.isRead !== 'seen') {
          return { ...mess, isRead: 'seen' };
        }
        return mess;
      });
    }
    }
})

export const {setConversationData, setPrevMessageUserData, setSelectedUserData, setAiConversationData, markMessagesAsSeen} = messageSlice.actions;
export default messageSlice.reducer;