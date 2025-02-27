const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", async (message) => {
    console.log("Received message:", message);

    // Handle AI Requests
    if (message.startsWith("Ai: ")) {
      const query = message.substring(4);
      try {
        const response = await axios.get(`https://yt-video-production.up.railway.app/gemini-1.5-pro?ask=${encodeURIComponent(query)}`);
        socket.emit("message", { username: "AI", message: response.data.reply || "AI response error." });
      } catch (error) {
        socket.emit("message", { username: "AI", message: "Error fetching AI response." });
      }
    }

    // Handle Lyrics Search
    else if (message.startsWith("lyrics: ")) {
      const songTitle = message.substring(7);
      try {
        const response = await axios.get(`https://kaiz-apis.gleeze.com/api/lyrics?title=${encodeURIComponent(songTitle)}`);
        socket.emit("message", { username: "Lyrics", message: response.data.lyrics || "Lyrics not found." });
      } catch (error) {
        socket.emit("message", { username: "Lyrics", message: "Error fetching lyrics." });
      }
    }

    // Handle FluxPro Image Generation
    else if (message.startsWith("fluxpro: ")) {
      const prompt = message.substring(9);
      try {
        const response = await axios.get(`https://lance-frank-asta.onrender.com/api/FLUX-pro?prompt=${encodeURIComponent(prompt)}`);
        socket.emit("message", { username: "FluxPro", message: response.data.image_url ? `<img src="${response.data.image_url}" style="max-width: 100%; border-radius: 10px;">` : "Image generation failed." });
      } catch (error) {
        socket.emit("message", { username: "FluxPro", message: "Error generating image." });
      }
    }

    // Handle SDXL Image Generation
    else if (message.startsWith("sdxl: ")) {
      const prompt = message.substring(5);
      try {
        const response = await axios.get(`https://kaiz-apis.gleeze.com/api/sdxl?prompt=${encodeURIComponent(prompt)}`);
        socket.emit("message", { username: "SDXL", message: response.data.image_url ? `<img src="${response.data.image_url}" style="max-width: 100%; border-radius: 10px;">` : "Image generation failed." });
      } catch (error) {
        socket.emit("message", { username: "SDXL", message: "Error generating image." });
      }
    }

    // Handle Normal Messages
    else {
      io.emit("message", { username: "User", message });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
