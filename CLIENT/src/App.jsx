import { useEffect, useMemo, useState } from "react"
import {io} from "socket.io-client"

function App() {
  const socket=useMemo(()=>io('http://localhost:3000',{
    withCredentials:true
  }),[])

  const [message,setMessage]=useState("")
  const [room,setRoom]=useState("")
  const [roomName,setRoomName]=useState("")
  const [socketId,setSocketId]=useState("")
  const [personal,setPersonal]=useState([])

  useEffect(()=>{
    socket.on('connect',()=>{
      console.log('connected',socket.id)
      setSocketId(socket.id)
    })
    socket.on("Bokachoda",(s)=>console.log(s))
    socket.on("receive-message",(s)=>setPersonal(personal=>[...personal,s]))
    console.log(personal)
    return ()=>{
      socket.disconnect()
    }
  },[]);

  const handleSubmit=(e)=>{
    e.preventDefault();
    socket.emit('message',{message,room})
    setMessage('')
    setRoom('')
  }

  const joinRoomHandler=(e)=>{
    e.preventDefault();
    socket.emit("join-room",roomName)
    setRoomName("")
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="space-y-6 flex flex-col justify-center p-6">
      <h1 className="text-2xl ">Welcome to Socket.Io</h1>
      <h2 className="text-2xl ">id {socketId}</h2>

      <form onSubmit={joinRoomHandler}>
        <h1 className="text-lg font-semibold">Join Room</h1>
        <input
         type="text" 
         value={roomName}
         onChange={(e)=>setRoomName(e.target.value)}
         placeholder="Room Name"
         className="p-2 rounded-sm bg-gray-50 border border-gray-400 mr-3"/>

        <button className="p-2 bg-blue-600 text-center w-fit text-white font-semibold rounded-md">
          Join</button>
      </form>
      
      <form 
      onSubmit={handleSubmit}
      className="flex w-64 gap-3 items-center">
        <input
         type="text" 
         value={message}
         onChange={(e)=>setMessage(e.target.value)}
         placeholder="type message..."
         className="p-2 rounded-sm bg-gray-50 border border-gray-400"/>
        <input
         type="text" 
         value={room}
         onChange={(e)=>setRoom(e.target.value)}
         placeholder="Room..."
         className="p-2 rounded-sm bg-gray-50 border border-gray-400"/>
        <button className="p-2 bg-blue-600 text-center w-fit text-white font-semibold rounded-md">Send</button>
      </form>
      {personal.map((m,i)=><p key={i}>{m}</p>)}
    </div>
    </div>
  )
}

export default App
