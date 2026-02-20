import React from 'react'
import { TailSpin } from 'react-loader-spinner'

const LoadingComponent = () => {
  return (
    <div className='w-screen h-screen fixed left-0 top-0 bg-gray-950 flex justify-center items-center'>
        <TailSpin
        height="65"
        width="65"
        color="#36f7e4"
        ariaLabel="tail-spin-loading"
      />
    </div>
  )
}

export default LoadingComponent