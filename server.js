const { createServer } =  require('http'); // we create our own http listener
const { parse } = require('url'); // parsing URL
const next = require('next'); 
const { Server } = require('socket.io'); //web socket server on top of our HTTP server
const { PrismaClient } = require('./lib/generated/prisma');

const prisma = new PrismaClient();
const pendingWrites = new Map();

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({dev,hostname,port}); // builds the app
const handle = app.getRequestHandler(); //  next js default request handler

//initialising the engine
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

//listens for new socket connection
  io.on('connection', (socket) => {
  console.log(`Client connectedL `,socket.id);
 

  //JOINING ROOM
  socket.on('join-room',async (roomId) => {
    socket.join(roomId);
    socket.roomId = roomId;

    //RANDOM NAMES
     const adjectives = ['Anonymous', 'Curious', 'Happy', 'Clever', 'Wild', 'Quick', 'Friendly'];
    const animals = ['Panda', 'Koala', 'Fox', 'Rabbit', 'Tiger', 'Beaver', 'Penguin', 'Owl'];
    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#6366f1', '#3b82f6', '#0ea5e9', '#10b981', '#f97316'];

    socket.username = `${adjectives[Math.floor(Math.random()*adjectives.length)]} ${animals[Math.floor(Math.random()*animals.length)]}`;
    socket.color = colors[Math.floor(Math.random()*colors.length)];

    const sockets = await io.in(roomId).fetchSockets(); //FETCH SOCKET DATA
   console.log(`socket ${socket.id} joined room ${roomId}`);

  //FILTER SOCKET DATA
  const users = sockets.map(s => ({
    id: s.id,
    name: s.username || 'Guest',
    color: s.color || '#ccc'
  }))

    io.to(roomId).emit('room-users',users); //BROADCAST TO ALL CONNECTED USERS THAT A USER CONNECTED

    // Fetch or create document in SQLite and sync state to the newly joined user
    try {
      let doc = await prisma.document.findUnique({
        where: { id: roomId }
      });
      if (!doc) {
        doc = await prisma.document.create({
          data: { id: roomId, content: "" }
        });
      }
      socket.emit('document-update', doc.content);
    } catch (err) {
      console.error("Error loading document from DB:", err);
    }
  })

   
  // BROADCASTING to the room
   socket.on('document-update', (newText) => {
    if(socket.roomId){
      socket.to(socket.roomId).emit('document-update',newText)
      
      // Clear previous timeout for this room to debounce writes
      if (pendingWrites.has(socket.roomId)) {
        clearTimeout(pendingWrites.get(socket.roomId));
      }

      // Schedule the write after 1.5 seconds of inactivity
      const timeout = setTimeout(async () => {
        try {
          await prisma.document.update({
            where: { id: socket.roomId },
            data: { content: newText }
          });
          pendingWrites.delete(socket.roomId);
        } catch (err) {
          console.error("Error saving document to DB:", err);
        }
      }, 1500);

      pendingWrites.set(socket.roomId, timeout);
 }})


  //

  socket.on('cursor-move',(data) => {
    if(socket.roomId){
      socket.to(socket.roomId).emit('cursor-update',{
        userId: socket.id,
        line: data.line,
        col: data.col,
      })
    }
  })

 //DISCONNECT
  socket.on('disconnect', async () => {
    console.log('Client disconnected' ,socket.id)

    if(socket.roomId){
      const sockets = await io.in(socket.roomId).fetchSockets();
      const users = sockets.map(s => ({
        id: s.id,
        name: s.username || 'guest',
        color: s.color || "#ccc",
      }))
       io.to(socket.roomId).emit('room-users',users) // BROADCAST TO ALL USERS THAT A USER DISCONNECTED
    }
   
;  })})


httpServer.listen(port,() => {
  console.log(`HTTP server running on http://${hostname}:${port}`);})

})


 






