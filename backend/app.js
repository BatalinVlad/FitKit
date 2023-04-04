require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// routes
const reviewsRoutes = require('./routes/reviews-routes');
const usersRoutes = require('./routes/users-routes');
const mainChatRoutes = require('./routes/mainchat-routes');
const openAiRoutes = require('./routes/openai-routes');

const HttpError = require('./models/http-error');

// sockets
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();

app.use(cors());

app.use(bodyParser.json());

//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers',
//     'Origin, X-requested-With, Content-Type, Accept, Authorization');
//   res.setHeader('Access-Control-Allow-Methods', 'GET ,POST, PATCH, DELETE');


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['https://reviewsapp-bv.web.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("add_review", (data) => {
    socket.to("reviews_room").emit("receive_review", data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.chat).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});


app.use('/api/reviews', reviewsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/mainchat', mainChatRoutes);
app.use('/api/openai', openAiRoutes);


app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});


mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.0qc0rdq.mongodb.net/${process.env.MONGO_NAME}?retryWrites=true&w=majority`)
  .then(() => {
    server.listen(process.env.PORT || 3001, () => {
      console.log('SERVER IS RUNNING');
    });
  })
  .catch(err => console.log(err));