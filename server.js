const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://darexmucheri:cMd7EoTwGglJGXwR@cluster0.uwf6z.mongodb.net/chatify?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePictureUrl: String,
});

const User = mongoose.model('User', userSchema);

// ChatMessage Schema
const chatMessageSchema = new mongoose.Schema({
  username: String,
  profilePictureUrl: String,
  message: String,
  color: String,
  timestamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// Store online users and their colors
const onlineUsers = new Map();

// Routes
app.post('/signup', async (req, res) => {
  const { username, password, profilePictureUrl } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, profilePictureUrl });
    await newUser.save();
    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Username already exists.' });
    } else {
      res.status(500).json({ error: 'Something went wrong.' });
    }
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        message: 'Login successful!',
        username: user.username,
        profilePictureUrl: user.profilePictureUrl,
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Socket.IO Handlers
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('setUsername', async (data) => {
    const { username, profilePictureUrl } = data;
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    onlineUsers.set(socket.id, { username, profilePictureUrl, color });

    // Load chat history
    const messages = await ChatMessage.find().sort({ timestamp: 1 }).limit(100);
    socket.emit('loadChatHistory', messages);

    // Update online users
    io.emit('updateOnlineUsers', Array.from(onlineUsers.values()).map((user) => user.username));
    socket.emit('welcome', `Welcome, ${username}!`);
  });

  socket.on('message', async (message) => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      const { username, profilePictureUrl, color } = user;
      const chatMessage = new ChatMessage({ username, profilePictureUrl, message, color });
      await chatMessage.save();

      io.emit('message', { username, profilePictureUrl, message, color });
    }
  });

  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      onlineUsers.delete(socket.id);
      io.emit('updateOnlineUsers', Array.from(onlineUsers.values()).map((user) => user.username));
      console.log(`${user.username} disconnected.`);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




/*const express = require('express');
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
*/
