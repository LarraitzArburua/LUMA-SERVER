const server = require("../../index");
const io = server.socketIO;
// const jwt = require('jsonwebtoken');

const socketEvents = require("./socketEvents").socketEvents;

// io.use(function(socket, next){
//   if (socket.handshake.query && socket.handshake.query.token){
//     jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function(err, decoded) {
//       if (err) return next(new Error('Authentication error'));
//       socket.decoded = decoded;
//       next();
//     });
//   }
//   else {
//     next(new Error('Authentication error'));
//   }    
// }).

io.on("connection", socketEvents)

module.exports = io;