const { Server } = require('socket.io');
const io = new Server(server);// server is 
const passport = require('passport')

io.on('connection', (socket) => {
    //set sate as green
    socket.emit('connected', req.user._id)
    //getmessages from database maybe
    
});

io.on('message', (socket) => {
    //create message save it and send it
})

io.on('dissconnect', () => {
    //set state as grey
})  