import React from 'react'

const MessagerUser = () => {
  return (

           <div className='p-1 h-[10vh] flex items-center gap-[6px] border-b-gray-300 border-b-[0.1px]'> 
            <div className='w-[8vh] h-[8vh] rounded-full  bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 p-[0.16rem]   shrink-0 cursor-pointer'>
      <div className='h-full w-full bg-white rounded-full'>
        {/* user dp */}
      </div>
    </div>
            <div>
            <h2 className='font-bold text-sm leading-3 cursor-pointer'>UserName</h2>
            <p className='text-xs cursor-pointer'>Name</p>
            </div>
            </div>
  )
}

export default MessagerUser