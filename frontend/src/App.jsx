import React, { useContext, useEffect } from 'react'
import { io } from 'socket.io-client'
import HomePage from './pages/homePage'
import ReelsPage from './pages/ReelsPage'
import { Navigate,Routes,Route } from 'react-router-dom'
import EditPage from './pages/EditPage'
import AgetAllPost from './getingData/getAllPost'
import { useDispatch, useSelector } from 'react-redux'
import AgetAllReels from './getingData/getAllReels'
import getUserData from './getingData/getUserData'
import Navbar from './components/Navbar'
import UploadPage from './pages/uploadPage'
import StoryPage from './pages/StoryPage'
import AgetAllStory from './getingData/getAllStory'
import MessagePage from './pages/MessagePage'
import WatchPosts from './pages/profile-pages/WatchPosts'
import SearchPage from './pages/SearchPage'
import { setOnlineUsers, setSocket } from './redux/socketSlice'
import WatchReels from './pages/profile-pages/watchReels'
import GetFollowers from './pages/profile-pages/GetFollowers'
import GetFollowings from './pages/profile-pages/getFollowings'
import ProfilePage from './pages/profile-pages/ProfilePage'
import PostByIdPage from './pages/specific-post/PostByIdPage'
import ReelsByIdPage from './pages/specific-post/ReelsByIdPage'
import SignUp from './pages/auth-pages/SignUp'
import SignIn from './pages/auth-pages/SignIn'
import NotificationPage from './pages/NotificationPage'
import SetUsername from './components/authComponents/SetUsername'
import ForgotPassword from './pages/auth-pages/ForgotPassword'
import AgetAllNotifications  from './getingData/getAllNotifications'
import OnlineUsersPage from './pages/OnlineUsersPage'
import AgetOnlineUserData from './getingData/getOnlineUserData'
import AmarkReceivedMessage from './getingData/markReceivedMessage'
import { SocketDataContext } from './context/SocketContext'



const App = () => {

  getUserData();
  // getAllNotifications();
  const {userData} = useSelector(state=>state.user);
// if (userData) {
//    getAllPost();
//   getAllReels();
//   getAllStory();
// }
 
  const dispatch = useDispatch();

  const {socket, setSocket} = useContext(SocketDataContext);
  
  useEffect(()=>{
    if (userData) {
    const socketIo = io(import.meta.env.VITE_SERVER_URL,{
      query:{
        userId:userData._id
      }
    })
      // dispatch(setSocket(socketIo))
      setSocket(socketIo)


      socketIo?.on('getOnlineUsers',(users)=>{
        dispatch(setOnlineUsers(users))
        
      })

      return ()=>socketIo.close()
    }else{
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
        setSocket(null)
      }
    }
  },[userData])
  

  return (
    
    <div >
      {userData && <AgetAllPost/>}
      {userData && <AgetAllReels/>}
      {userData && <AgetAllStory/>}
      {userData && <AgetOnlineUserData/>}
      {userData && <AmarkReceivedMessage/>}
      {userData && <AgetAllNotifications/>}
      {userData && !userData?.userName && <SetUsername/>}
      
      
     {userData && <Navbar/>}
     <Routes>
      <Route path='/' element={userData?<HomePage/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/signUp' element={!userData?<SignUp/>:<Navigate to={'/'}/>}/>
      <Route path='/signIn' element={!userData?<SignIn/>:<Navigate to={'/'}/>}/>
      <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Navigate to={'/'}/>}/>
      <Route path='/reels' element={userData?<ReelsPage/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/story/:userName' element={userData?<StoryPage/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/profile/:userName' element={userData?<ProfilePage/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/profile/followers/:userName' element={userData?<GetFollowers/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/profile/followings/:userName' element={userData?<GetFollowings/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/posts/:userName/:postIdx' element={userData?<WatchPosts/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/reels/:userName/:reelsIdx' element={userData?<WatchReels/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/edit' element={userData?<EditPage/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/upload' element={userData?<UploadPage/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/search' element={userData?<SearchPage/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/message/' element={userData?<MessagePage/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/message/:userId' element={userData?<MessagePage/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/post/:postId' element={userData?<PostByIdPage/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/reels/:reelsId' element={userData?<ReelsByIdPage/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/notification' element={userData?<NotificationPage/>:<Navigate to={'/signUp'}/>}/>
      <Route path='/onlineUsers' element={userData?<OnlineUsersPage/>:<Navigate to={'/signUp'}/>}/>

     </Routes>
    </div>
  )
}

export default App