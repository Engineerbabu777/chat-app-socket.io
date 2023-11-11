const express = require('express')
const app = express()
const PORT = 4000

//New imports
const http = require('http').Server(app)
const cors = require('cors')

app.use(cors())

const socketIO = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

let users = []

//Add this before the app.get() block
socketIO.on('connection', socket => {
  console.log(`⚡: ${socket.id} user just connected!`)

  socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

  //Listens and logs the message to the console
  socket.on('message', data => {
    console.log(data)
  })

  //Listens when a new user joins the server
  socket.on('newUser', data => {
    //Adds the new user to the list of users
    users.push(data)
    console.log('NEW USER ADDED: ', { users })
    //Sends the list of users to the client
    socketIO.emit('newUserResponse', users)
  })

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected')
  })
})

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world'
  })
})

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
