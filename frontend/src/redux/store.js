import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice';
import postSlice from './postSlice';
import reelsSlice from './reelsSlice.js';
import storySlice from './storySlice';
import messageSlice from './messageSlice';
import socketSlice from './socketSlice';



const store = configureStore({
 reducer:{
 user:userSlice,
 post:postSlice,
 reels:reelsSlice,
 story:storySlice,
 message:messageSlice,
 socket:socketSlice
 }
})
export default store;