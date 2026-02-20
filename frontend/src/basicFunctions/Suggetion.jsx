import React from 'react'

const Suggetion = ({text,direction = 'top'}) => {
  return (
    <div className={`absolute z-50 text-nowrap ${direction== 'top'?'-top-8 ':'-bottom-9 -translate-x-[50%]'} rounded-2xl bg-gray-700/50 text-gray-50 font-medium text-sm px-3 py-1 cursor-default group-hover:block hidden` }>
        {text}
    </div>
  )
}

export default Suggetion