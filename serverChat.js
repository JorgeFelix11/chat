// const appChat = require("./backendChat/app")
// const http = require("http");
// const serverChat = http.createServer(appChat);

// // let io = require('socket.io').listen(serverChat);

// // require('./backendChat/routes/conversations').ioFn(io)

// const debug = require("debug")("node-angular");

// const normalizePort = val => {
//   var port = parseInt(val, 10);

//   if (isNaN(port)) {
//     // named pipe
//     return val;
//   }

//   if (port >= 0) {
//     // port number
//     return port;
//   }

//   return false;
// };

// const onErrorChat = error => {
//   if (error.syscall !== "listen") {
//     throw error;
//   }
//   const bind = typeof portChat === "string" ? "pipe " + portChat : "port " + portChat;
//   switch (error.code) {
//     case "EACCES":
//       console.error(bind + " requires elevated privileges");
//       process.exit(1);
//       break;
//     case "EADDRINUSE":
//       console.error(bind + " is already in use");
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// };

// const onListeningChat = () => {
//   const addr = serverChat.address();
//   const bind = typeof portChat === "string" ? "pipe " + portChat : "port " + portChat;
//   debug("Listening on " + bind);
// };

// const portChat = normalizePort(process.env.PORT || "4000");

// appChat.set("port", portChat);

// serverChat.on("error", onErrorChat);
// serverChat.on("listening", onListeningChat);
// serverChat.listen(portChat);
// // console.log(serverChat)
// module.exports = serverChat