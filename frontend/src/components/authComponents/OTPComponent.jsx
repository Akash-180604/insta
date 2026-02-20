import React, { useEffect, useRef, useState } from 'react'

const OTPComponent = ({setOtp, setShowResendOtp}) => {
    const otpRef1 = useRef();
    const otpRef2 = useRef();
    const otpRef3 = useRef();
    const otpRef4 = useRef();

    const [otp1,setOtp1] = useState('');
    const [otp2,setOtp2] = useState('');
    const [otp3,setOtp3] = useState('');
    const [otp4,setOtp4] = useState('');

    const [timer,setTimer] = useState(90);



    useEffect(()=>{
        if (otp1.length==1 && otp2.length==1 && otp3.length==1 && otp4.length==1) {
            console.log('all input filld');
            const finalOtp = String(String(otp1) + String(otp2) + String(otp3) + String(otp4))
            setOtp(finalOtp);
            
        }

    },[otp1,otp2,otp3,otp4])
    useEffect(()=>{
        if (otp1) {
        otpRef2.current.focus();
       }
       if (otp1.length>1) {
        setOtp1(otp1%10);
       }
        
       

    },[otp1])
    useEffect(()=>{
        if (otp2) {
        otpRef3.current.focus();
       }
       if (otp2.length>1) {
        setOtp2(otp2%10);
       }
       

    },[otp2])
    useEffect(()=>{
        if (otp3) {
        otpRef4.current.focus();
       }
       if (otp3.length>1) {
        setOtp3(otp3%10);
       } 
       

    },[otp3])
    useEffect(()=>{
       if (otp4.length>1) {
        setOtp4(otp4%10);
       }

    },[otp4])

    const keyDownFnc = (e)=>{
        if (e.key == "Backspace") {
            if(!e.target.value){
                if (e.target.id == 'input2') {                
                    otpRef1.current.focus()  
                }
                if (e.target.id == 'input3') {                
                otpRef2.current.focus()  
                }
                if (e.target.id == 'input4') {                
                otpRef3.current.focus()  
                }
            }
            }       
    }

    useEffect(()=>{
    const interval = setInterval(()=>{
       
        setTimer(prev => {
        const updatedTimer = prev - 1; 
         if (updatedTimer===80) {
            setShowResendOtp(true);
        }
        if (updatedTimer <= 0) {
          setShowResendOtp(true);
          clearInterval(interval); // Clear the interval when the target is reached
          return 0; // Return the final state
        }
        return updatedTimer; // Return the decremented value
      });
    },1000);

          
    return ()=> {
        setShowResendOtp(true);
        clearInterval(interval);
    }
    },[])

  return (
  <div className='mt-7 mb-5 flex-col gap-4'>
        <div onKeyDown={keyDownFnc} className='flex justify-evenly items-center'>
                <input type="number" id='input1' autoFocus ref={otpRef1} value={otp1} onChange={(e)=>setOtp1(e.target.value)} className='size-10 outline-none focus:ring-white focus:ring-2 rounded bg-black text-center font-normal text-lg' />
                <input type="number" id='input2' ref={otpRef2} value={otp2} onChange={(e)=>setOtp2(e.target.value)} className='size-10 outline-none focus:ring-white focus:ring-1 rounded bg-black  text-center font-normal text-lg' />
                <input type="number" id='input3' ref={otpRef3} value={otp3} onChange={(e)=>setOtp3(e.target.value)} className='size-10 outline-none focus:ring-white focus:ring-1 rounded bg-black text-center font-normal text-lg' />
                <input type="number" id='input4' ref={otpRef4} value={otp4} onChange={(e)=>setOtp4(e.target.value)} className='size-10 outline-none focus:ring-white focus:ring-1 rounded bg-black text-center font-normal text-lg' />
        </div>
        <div className='mt-4 ml-5 rounded-xl bg-gray-900 w-fit px-2 py-1'>
            <h3 className={` ${timer<=10? 'text-red-600':'text-white'} text-sm   `}>00:{timer>=10? timer :'0' + timer}</h3>
        </div>
</div>
  )
}


export default OTPComponent