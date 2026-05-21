const { createServer } =  require('http'); // we create our own http listener
const { parse } = require('url'); // parsing URL
const next = require('next'); 
const { Server } = require('socket.io'); //web socket server on top of our HTTP server

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({dev,hostname,port}); // builds the app
const handle = app.getRequestHandler(); //  next js default request handler


app.prepare().then( () => {
  const httpServer = createServer((req,res) => {
    const parsedURL = parse(req.url, true);

    handle(req,res,parsedURL);
  })


   //if it is a socket request
  //Socket.io intercepts it or else
  //it goes to Next.js as a standard HTTP request 
  
  const io = new Server(httpServer,{ 
    cors: { // cross-origin resource sharing
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]}})


  io.on('connection', (socket) => {
  console.log(`Client connectedL `,socket.id);
  socket.on('document-update',(newText) => {
    socket.broadcast.emit('document-update',newText);
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected' ,socket.id)
  })})

httpServer.listen(port,() => {
  console.log(`HTTP server running on http://${hostname}:${port}`);})

})


 






