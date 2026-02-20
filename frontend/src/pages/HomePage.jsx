import React from 'react'
import Main from './main'
import PrevMessageUser from '../components/messageComponents/PrevMessageUser'

const HomePage = () => {
  return (
    <div className='flex w-screen h-screen overflow-hidden'>
    <div className='left hidden lg:block w-[30%] overflow-y-auto overflow-x-hidden min-h-screen bg-black'></div>
    <div className='main w-full lg:w-[40%] overflow-y-auto overflow-x-hidden min-h-screen bg-gray-950 flex justify-center'><Main/></div>
    <div className='right hidden lg:block w-[30%] overflow-x-hidden min-h-screen bg-black border-l-[0.3px] border-gray-700 '><PrevMessageUser/></div>
    </div>
  )
}

export default HomePage