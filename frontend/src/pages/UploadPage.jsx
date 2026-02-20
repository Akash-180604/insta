import axios from 'axios'
import React, { useCallback, useEffect, useRef ,useState } from 'react'
import { TailSpin } from 'react-loader-spinner'

import { useDispatch, useSelector } from 'react-redux'
import { setPostData } from '../redux/postSlice'
import { setUserStoryData } from '../redux/storySlice'
import { useNavigate } from 'react-router-dom'
import VideoComponent from '../components/VideoComponent'
import { MdDriveFolderUpload } from "react-icons/md";
import { IoArrowBackSharp } from "react-icons/io5";
import { setReelsData } from '../redux/reelsSlice'
import VideoComponentUpdated from '../components/VideoComponentUpdated'
import ImageComponent from '../components/ImageComponent'


const UploadPage = () => {
    const [mode,setMode] = useState('post')
    const [loading,setLoading] = useState(false)
    const [caption,setCaption] = useState("")
    const [mediaType,setMediaType] = useState("")
    const [frontendMedia,setFrontendMedia] = useState("")
    const [backendMedia,setBackendMedia] = useState(null)


const dispatch = useDispatch();
const navigate = useNavigate();
const mediaRef = useRef();

const {userData} = useSelector(state=>state.user);
const {postData} = useSelector(state=>state.post);
const {reelsData} = useSelector(state=>state.reels);
const {userStoryData} = useSelector(state=>state.story);

    
// 1. Add a cleanup effect
  useEffect(() => {
    // Cleanup function that runs when component unmounts or frontendMedia changes
    return () => {
      if (frontendMedia) {
        URL.revokeObjectURL(frontendMedia);
      }
    };
  }, [frontendMedia]);


const uploadFnc = async () =>{
        setLoading(true);
        try {
            if(!backendMedia){
                setLoading(false);
                return console.error("Backend Media required");
            }
            const formData = new FormData();
            formData.append('media',backendMedia);
            if(mode!='reels'){
            formData.append('mediaType',mediaType);
            }
            formData.append('caption',caption);
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/${mode}/upload`,formData,{withCredentials:true});

            if(mode=='post'){
                // postData.push(result.data);
                dispatch(setPostData([...postData,result.data]));
            }else if(mode=='reels'){
                //  reelsData.push(result.data);
                dispatch(setReelsData([...reelsData,result.data]));
            }else if(mode=='story'){
                //  userStoryData.push(result.data);
                dispatch(setUserStoryData([...userStoryData,result.data]));
            }
            navigate(-1);
            setLoading(false)

        } catch (error) {
            console.log(error);
            setLoading(false)
            
        }
}

const setFileFnc = (e)=>{
    
    const file = e.target.files[0];
    console.log(file);
    

if (!file) return;

    // Optional: Validate file size/type here before setting state
    if (file.size > 50 * 1024 * 1024) { // 50MB limit example
        alert("File too large!");
        return;
    }

if(file.type.includes('image')){
    setMediaType('image');
}else if(file.type.includes('video')){
    setMediaType('video');  
}else{
    alert("Select only video or image");
    return;
}


setBackendMedia(file);
setFrontendMedia(URL.createObjectURL(file));
}

//single click and dubble click
const [isFullScreen,setIsFullScreen] = useState(false)

const timerRef = useRef(null);
  const DBL_CLICK_DELAY = 300; // milliseconds

    const handleClick = useCallback(() => {
    // Clear the timer if it's already running (meaning a double click is likely happening)
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    } else {
      // Set a timer to execute the single click logic after a short delay
      timerRef.current = setTimeout(() => {
        setIsFullScreen(true);
        

        timerRef.current = null; // Reset the timer reference
      }, DBL_CLICK_DELAY);
    }
  }, []);

const handleDoubleClick = useCallback(() => {
    // Clear the timer immediately to prevent the single click from running
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    mediaRef?.current.click()
  }, []);

  return (
    <div className='min-h-screen w-screen flex justify-center items-center  bg-gray-950 p-5 pb-12'>
        <div className='sm:w-[500px] relative w-full p-4 flex-col justify-center items-center bg-gray-950'>
           <IoArrowBackSharp onClick={()=> navigate(-1)} className="hover:bg-gray-600 active:scale-90 hover:scale-105 bg-gray-800 absolute text-white size-10 font-semibold top-5 left-5 p-1.5 rounded-3xl cursor-pointer "/>
            <h1 className=' text-center font-bold text-2xl text-white mb-4'>Upload {mode}</h1>

            <div className='h-[10vh] p-2 flex justify-center items-center gap-4'>
                <div onClick={()=>setMode('post')} className={`hover:bg-white hover:text-black flex flex-1 rounded-full justify-center items-center h-full cursor-pointer ${mode=='post'?'bg-gray-200 text-black':''}`}>Post</div>
                <div onClick={()=>setMode('reels')} className={`hover:bg-white hover:text-black flex flex-1 rounded-full justify-center items-center h-full cursor-pointer ${mode=='reels'?'bg-gray-200 text-black':''}`}>Reels</div>
                <div onClick={()=>setMode('story')} className={`hover:bg-white hover:text-black flex flex-1 rounded-full justify-center items-center h-full cursor-pointer ${mode=='story'?'bg-gray-200 text-black':''}`}>Story</div> 
            </div>

            <input type="file" hidden ref={mediaRef} onChange={setFileFnc} accept={mode==='reels'?'video/*':'image/*,video/*'}/>
            <div className=' flex-1 flex justify-center items-center w-full p-4 cursor-pointer'>
            {(!mediaType)&&
            <div onClick={()=>mediaRef.current.click()} className={` ${mode=='post'?'md:max-w-[380px] max-h-[190px]':'md:max-w-[220px] max-h-[380px]'} bg-black/40 w-full border-2 border-white flex justify-center items-center p-16 text-2xl font-bold rounded-2xl`}>
                <MdDriveFolderUpload/>
            </div>
            }

            {(mediaType) &&
                <div onDoubleClick={handleDoubleClick} onClick={handleClick}>
                {(mediaType=='image')&&
            // <img src={frontendMedia} alt="" className='w-full max-h-96 object-cover rounded-xl' />
             <ImageComponent url={frontendMedia} controllers={{isFullScreen,setIsFullScreen}}/>
                }
            {(mediaType=='video')&&
            // <VideoComponent media={frontendMedia}/>
             <VideoComponentUpdated url={frontendMedia} controllers={{isFullScreen,setIsFullScreen}}/>
            }
            </div>
            }
            
            


            </div>

         <div className={` ${caption?'border-[1.5px] border-gray-400 bg-black':'bg-gray-700'} w-full   rounded-lg relative  px-2.5 py-1 my-2`}>
          <h6 className={`${!caption?'hidden':''} text-white absolute top-[-12px]  text-sm  bg-gray-950  px-1`}>Enter caption....</h6>
          <input type="text" value={caption} onChange={(e)=>setCaption(e.target.value)} placeholder='Enter something about this....' className={` ${caption?'bg-black':'bg-gray-700'} outline-none border-none w-full h-full text-white  text-sm`} />
        </div>

            <div className='w-full text-center flex justify-center' ><button disabled={loading} onClick={uploadFnc}  className='w-[70%] text-center flex justify-center rounded-full bg-blue-50 text-black font-bold p-1.5 mt-4 '> {loading?<TailSpin
        height="25"
        width="25"
        color="#111"
        ariaLabel="tail-spin-loading"
        //  visible={!loading}
      />:`Upload ${mode}` }</button>
</div>
        </div>
    </div>
  )
}

export default UploadPage