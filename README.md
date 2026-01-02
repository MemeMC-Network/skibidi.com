# 🖥️ Skibidi Screen Share

A foundational web-based screen-sharing interface inspired by AnyDesk, built for remote desktop and screen sharing capabilities.

## 📋 Features

- **Sharing Code System**: Enter or generate 9-digit codes for secure connections
- **Modern UI**: Clean, responsive interface with smooth animations
- **Real-time Status**: Visual indicators for connection status
- **Screen Sharing Area**: Placeholder for actual screen stream display
- **Control Panel**: Fullscreen, disconnect, and settings controls
- **Backend Ready**: Commented backend template with WebSocket support

## 🚀 Quick Start

### Option 1: Static Demo (No Backend Required)

Simply open `index.html` in a web browser to see the interface in demo mode:

```bash
# Using Python's built-in server
python3 -m http.server 8000

# Or using Node.js http-server
npx http-server -p 8000
```

Then visit: `http://localhost:8000`

### Option 2: Full Setup (With Backend)

#### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

#### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MemeMC-Network/skibidi.com.git
   cd skibidi.com
   ```

2. **Install dependencies**
   ```bash
   npm init -y
   npm install express cors body-parser ws
   ```

3. **Configure the backend**
   - Open `server.js`
   - Uncomment all the code sections (they're currently commented out as placeholders)

4. **Start the server**
   ```bash
   node server.js
   ```

5. **Access the application**
   - Open your browser to: `http://localhost:3000`

## 📁 Project Structure

```
skibidi.com/
├── index.html          # Main HTML interface
├── styles.css          # Stylesheet with responsive design
├── app.js             # Frontend JavaScript logic
├── server.js          # Backend API (Node.js/Express)
└── README.md          # This file
```

## 🎯 How It Works

### Frontend (Client-Side)

1. **Sharing Code Input**: Users enter or generate a 9-digit sharing code
2. **Code Validation**: Format validation ensures codes match XXX-XXX-XXX pattern
3. **Connection Simulation**: Demo mode simulates connecting to remote screens
4. **Visual Feedback**: Status indicators show connection state

### Backend (Server-Side)

The backend provides:

- **REST API Endpoints**:
  - `POST /api/generate-code` - Generate new sharing codes
  - `POST /api/connect` - Connect to a remote screen
  - `POST /api/disconnect` - End active session
  - `GET /api/sessions` - List active sessions (admin)

- **WebSocket Server**:
  - Real-time bidirectional communication
  - Screen data streaming from host to viewer
  - Control commands from viewer to host

## 🔧 API Documentation

### Generate Sharing Code

```javascript
POST /api/generate-code

Response:
{
  "success": true,
  "code": "123-456-789",
  "message": "Sharing code generated successfully"
}
```

### Connect to Remote Screen

```javascript
POST /api/connect

Request:
{
  "code": "123-456-789"
}

Response:
{
  "success": true,
  "message": "Connection request accepted",
  "sessionId": "123-456-789"
}
```

### Disconnect Session

```javascript
POST /api/disconnect

Request:
{
  "sessionId": "123-456-789"
}

Response:
{
  "success": true,
  "message": "Disconnected successfully"
}
```

## 🎨 Customization

### Modify Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #4a90e2;      /* Main theme color */
    --secondary-color: #50c878;    /* Success/connect color */
    --bg-color: #f5f7fa;          /* Background color */
    /* ... more variables ... */
}
```

### Adjust Connection Timeout

In `app.js`, modify the connection simulation delay:

```javascript
// Change from 2000ms (2 seconds) to your preferred delay
setTimeout(() => {
    // Connection logic...
}, 2000);
```

## 🔒 Security Considerations

**Important**: This is a foundational implementation. For production use, implement:

- ✅ Authentication and authorization
- ✅ Encrypted connections (WSS/HTTPS)
- ✅ Rate limiting on API endpoints
- ✅ Session expiration and cleanup
- ✅ Input sanitization
- ✅ CORS configuration
- ✅ Database for persistent storage
- ✅ Logging and monitoring

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Real-time**: WebSocket (ws library)
- **Styling**: Custom CSS with animations

## 📱 Browser Support

- ✅ Chrome/Edge (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Opera (v76+)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by AnyDesk's user interface
- Built for the MemeMC Network community

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: MemeMC Network

## 🗺️ Roadmap

- [ ] Implement actual screen capture API
- [ ] Add peer-to-peer WebRTC connections
- [ ] User authentication system
- [ ] File transfer capabilities
- [ ] Chat functionality
- [ ] Session recording
- [ ] Mobile responsive improvements
- [ ] Multi-platform desktop apps (Electron)

---

**Made with ❤️ by MemeMC Network**

*Version 1.0.0 - Initial Release*
