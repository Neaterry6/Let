const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Store online users
const onlineUsers = new Map();

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for username submission
  socket.on('setUsername', (username) => {
    onlineUsers.set(socket.id, username); // Add user to the online list
    io.emit('updateOnlineUsers', Array.from(onlineUsers.values())); // Broadcast updated user list
    socket.emit('welcome', `Welcome, ${username}!`); // Send a welcome message to the user
  });

  // Listen for incoming messages
  socket.on('message', (message) => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      const fullMessage = { username, message };
      io.emit('message', fullMessage); // Broadcast the message to all clients
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      onlineUsers.delete(socket.id); // Remove user from the online list
      io.emit('updateOnlineUsers', Array.from(onlineUsers.values())); // Broadcast updated user list
      console.log(`${username} disconnected`);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
