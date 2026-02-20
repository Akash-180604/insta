const http = require('http');
const express=require("express");
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
    origin:'http://localhost:5173',
    methods:['GET', 'POST']
    }
})


const userSocket = {};

const getSocketId = (userId)=>{
   return userSocket[userId]
}

io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocket[userId] = socket.id;        
    }
    io.emit('getOnlineUsers',Object.keys(userSocket));


    socket.on('disconnect',()=>{
        delete userSocket[userId];
        io.emit('getOnlineUsers',Object.keys(userSocket));
    })
})

module.exports = {app, server, io, getSocketId}