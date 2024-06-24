import express from 'express'
import { Server } from 'socket.io';
import { createServer } from "http";
import cors from "cors"
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const port=3000;
const secret_key="anik108"

const app=express()
const server=createServer(app)
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true
    }
})

app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials:true
}))
app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.get("/login",(req,res)=>{
    const token=jwt.sign({_id:"ajhbfejhwbgiryg"},secret_key)
    res.cookie("token",{httpOnly:true,secure:true,sameSite:"none"})
    .json({message:"login success"})
})

io.use((socket,next)=>{
    cookieParser()(socket.request,socket.request.res,(err)=>{
        if(err) return next(err);

        const token=socket.request.cookies.token;
        if(!token) return next(new Error("Authentication Error"))

        const decode=jwt.verify(token,secret_key)
        
    })
    // after next connect get established-> we can check authentication
    next()
})

io.on("connection",(socket)=>{
    console.log("User Connected")
    console.log("Id ",socket.id)
    // only a particuler socket get message
    // socket.emit("Bokachoda",`Welcome to server ${socket.id}`)
    // all socket get message except the particular socket
    // socket.broadcast.emit("Bokachoda",`${socket.id} joined the server`)

    socket.on("message",(data)=>{
        console.log(data)
        // message send to entire ckt
        // io.emit('receive-message',data)
        // socket.broadcast.emit('receive-message',data.message)
        // io.to(data.room).emit('receive-message',data.message)
        // same
        socket.to(data.room).emit('receive-message',data.message)
    })
    socket.on("disconnect",()=>{
        console.log("User Disconnected",socket.id)
    })

    socket.on("join-room",(room)=>{
        socket.join(room)
    })
})


server.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})