import React, { useEffect } from 'react'

const observerFnc = (videoRef) => {
        const observer = new IntersectionObserver(([entry])=>{
            if(entry.isIntersecting){
                videoRef?.current.play();
            }else{
                videoRef?.current.pause();
            }
        },{ threshold:0.7 })
        if(videoRef.current){
            observer.observe(videoRef.current);
        }
return ()=>{
    if(videoRef.current){
            observer.unobserve(videoRef.current);
        }
}

}





// const observerFnc = (videoRef) => {
//     useEffect(()=>{
//         const observer = new IntersectionObserver(([entry])=>{
//             if(entry.isIntersecting){
//                 videoRef.current.play();
//             }else{
//                 videoRef.current.pause();
//             }
//         },{ threshold:0.8 })
//         if(videoRef.current){
//             observer.observe(videoRef.current);
//         }
// return ()=>{
//     if(videoRef.current){
//             observer.unobserve(videoRef.current);
//         }
// }

//     },[])
// }

export default observerFnc