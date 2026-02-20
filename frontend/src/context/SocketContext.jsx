import React, { createContext, useMemo, useState } from 'react'

export const SocketDataContext = createContext();

const SocketContext = ({children}) => {
    const [socket, setSocket] = useState(null);
    const socketData = useMemo(()=>({
        socket,setSocket
    }),[socket, setSocket])
    
    
  return (
    <div>
        <SocketDataContext.Provider value={socketData}>
        {children}
        </SocketDataContext.Provider>
    </div>
  )
}

export default SocketContext