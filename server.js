const appUsers = require("./backendUsers/app");

const debug = require("debug")("node-angular");
const http = require("http");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof portUsers === "string" ? "pipe " + portUsers : "port " + portUsers;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = serverUsers.address();
  const bind = typeof portUsers === "string" ? "pipe " + portUsers : "port " + portUsers;
  debug("Listening on " + bind);
};

const portUsers = normalizePort(process.env.PORT || "3000");

appUsers.set("port", portUsers);

const serverUsers = http.createServer(appUsers);

serverUsers.on("error", onError);
serverUsers.on("listening", onListening);
serverUsers.listen(portUsers);

