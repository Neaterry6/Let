const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Connect to MongoDB
mongoose.connect('mongodb+srv://darexmucheri:cMd7EoTwGglJGXwR@cluster0.uwf6z.mongodb.net/chatify?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define ChatMessage schema
const chatMessageSchema = new mongoose.Schema({
  username: String,
  profilePictureUrl: String,
  message: String,
  color: String,
  timestamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Store online users and their colors
const onlineUsers = new Map();

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for username submission
  socket.on('setUsername', async (data) => {
    const { username, profilePictureUrl } = data;
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Generate a random color
    onlineUsers.set(socket.id, { username, profilePictureUrl, color });

    // Load previous chat history
    const messages = await ChatMessage.find().sort({ timestamp: 1 }).limit(100);
    socket.emit('loadChatHistory', messages);

    // Broadcast updated user list
    io.emit('updateOnlineUsers', Array.from(onlineUsers.values()).map(user => user.username));

    // Send welcome message
    socket.emit('welcome', `Welcome, ${username}!`);
  });

  // Listen for incoming messages
  socket.on('message', async (message) => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      const { username, profilePictureUrl, color } = user;
      const chatMessage = new ChatMessage({ username, profilePictureUrl, message, color });
      await chatMessage.save(); // Save message to MongoDB

      // Broadcast the message to all clients
      io.emit('message', { username, profilePictureUrl, message, color });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      onlineUsers.delete(socket.id);
      io.emit('updateOnlineUsers', Array.from(onlineUsers.values()).map(user => user.username));
      console.log(`${user.username} disconnected`);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
