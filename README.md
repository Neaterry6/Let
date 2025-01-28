# Chatify

Chatify is a real-time chat application created by **Darrell Mucheri**. This project allows users to log in, send messages, view online users, and interact in a dynamic chat environment. It utilizes Node.js, Express, Socket.IO, and MongoDB for seamless functionality.

---

## Features

- **User Authentication**: Signup and login system with profile picture upload.
- **Real-Time Messaging**: Communicate instantly with other users via Socket.IO.
- **Dark Mode Support**: Easily toggle between light and dark themes.
- **Typing Indicator**: Shows when other users are typing.
- **Chat History**: View previous conversations saved in the database.
- **Responsive Design**: User-friendly layout for various devices.
- **Online Users List**: See who is currently online in the chat room.

---

## Installation

### Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

### Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   cd chatify
   npm install
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/chatify?retryWrites=true&w=majority
   node server.js
   ```

   # Project Structure

```
├── public
│   ├── index.html        # Frontend HTML for the app
│   ├── styles.css        # Custom CSS for the app
│   └── scripts.js        # Client-side JavaScript
├── server.js             # Main Node.js server
├── models
│   └── User.js           # MongoDB schema for users
├── package.json          # Node.js dependencies
├── .env                  # Environment variables (ignored in Git)
├── .gitignore            # Ignored files in the repository
└── README.md             # Project documentation
```
# Usage
Signup and Login:

Users must create an account with a profile picture to access the chat.
Start Chatting:

Enter the chat room after logging in.
Send messages, view online users, and enjoy real-time communication.
Dark Mode:

Click the moon icon to toggle between dark and light modes.
Technologies Used
Backend: Node.js, Express.js, MongoDB
Frontend: HTML, CSS, JavaScript (with FontAwesome and Google Fonts)
Real-Time Communication: Socket.IO
Database: MongoDB Atlas
Environment Management: dotenv
Screenshots
Login and Signup Page
Description: User authentication forms with profile picture upload.

# Chat Room
Description: Real-time messaging interface with typing indicators and online user tracking.

# Future Enhancements
Add user settings for custom avatars and themes.
Introduce private messaging functionality.
Implement notifications for new messages.
Deploy on platforms like Heroku or AWS.
Contributing
Fork the repository.
Create a new branch:
bash
Copy code
git checkout -b feature-name
Commit your changes:
bash
Copy code
git commit -m "Added new feature"
Push to the branch:
bash
Copy code
git push origin feature-name
Submit a pull request.
License
This project is licensed under the MIT License.

# Author
Created with passion by *Darrell Mucheri.* Feel free to reach out for collaboration or feedback!















