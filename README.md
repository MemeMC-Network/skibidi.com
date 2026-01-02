# 🖥️ Skibidi Screen Share

A real-time web-based screen-sharing application using WebRTC, optimized for low-latency streaming suitable for gaming and high-performance applications.

## 📋 Features

- **Real WebRTC Screen Sharing**: Actual peer-to-peer screen streaming (not a demo!)
- **Low Latency**: Optimized for gaming with up to 60 FPS support
- **Sharing Code System**: Easy 9-digit codes for secure connections
- **Modern UI**: Clean, responsive interface with smooth animations
- **Real-time Statistics**: FPS, bitrate, and packet loss monitoring
- **Vercel Deployable**: Serverless architecture ready for instant deployment
- **Auto-Scaling**: Socket.IO based signaling works seamlessly on Vercel

## 🚀 Quick Start

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MemeMC-Network/skibidi.com)

1. Click the button above or visit [Vercel](https://vercel.com)
2. Import your repository
3. Vercel will automatically detect the configuration
4. Deploy! 🎉

Your app will be live with a URL like `https://your-app.vercel.app`

### Local Development

#### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

#### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MemeMC-Network/skibidi.com.git
   cd skibidi.com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser to: `http://localhost:3000`

## 🎯 How It Works

### For Screen Sharing (Host)

1. Click "Generate My Code" button
2. Allow screen capture when prompted by your browser
3. Share the generated code with someone
4. They enter your code and instantly see your screen!

### For Viewing (Viewer)

1. Get a sharing code from someone
2. Enter the code in the input field
3. Click "Connect"
4. Watch their screen in real-time!

## 📁 Project Structure

```
skibidi.com/
├── index.html          # Main HTML interface
├── styles.css          # Stylesheet with responsive design
├── app.js             # WebRTC client logic
├── api/
│   └── socketio.js    # Serverless Socket.IO handler for Vercel
├── package.json       # Dependencies and scripts
├── vercel.json        # Vercel configuration
└── README.md          # This file
```

## 🔧 Technical Details

### WebRTC Configuration

The application uses optimized WebRTC settings for low latency:

- **Frame Rate**: Up to 60 FPS
- **Resolution**: Up to 2560x1440
- **Bitrate**: Adaptive (2-10 Mbps)
- **Codec**: H.264 with hardware acceleration
- **Transport**: DTLS-SRTP for secure streaming

### Architecture

- **Frontend**: Vanilla JavaScript with WebRTC APIs
- **Signaling**: Socket.IO for peer discovery and ICE exchange
- **Backend**: Vercel Serverless Functions
- **Connection**: Peer-to-peer (P2P) after initial signaling

## 🎮 Performance Features

- ✅ **60 FPS Support**: Smooth streaming for gaming
- ✅ **Hardware Acceleration**: Uses GPU encoding when available
- ✅ **Adaptive Bitrate**: Automatically adjusts to network conditions
- ✅ **Low Latency SDP**: Optimized Session Description Protocol
- ✅ **Real-time Stats**: Monitor connection quality
- ✅ **No Compression**: Disabled to reduce latency

## 🔒 Security Considerations

**Current Implementation**:
- Peer-to-peer encryption via DTLS-SRTP
- Temporary sharing codes (expire after 1 hour)
- STUN servers for NAT traversal

**For Production**:
- ✅ Add authentication and user accounts
- ✅ Implement TURN servers for firewall bypass
- ✅ Add session recording with consent
- ✅ Implement rate limiting
- ✅ Add end-to-end encryption for signaling
- ✅ GDPR compliance for EU users

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **WebRTC**: Native browser APIs (getUserMedia, RTCPeerConnection)
- **Signaling**: Socket.IO (WebSocket + polling fallback)
- **Backend**: Vercel Serverless Functions (Node.js)
- **Deployment**: Vercel Edge Network

## 📱 Browser Support

- ✅ Chrome/Edge (v90+) - **Recommended**
- ✅ Firefox (v88+)
- ✅ Safari (v14+) - macOS only
- ✅ Opera (v76+)
- ❌ Mobile browsers (limited screen capture support)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### "Failed to start screen sharing"
- Ensure you're using HTTPS (required for screen capture API)
- Allow screen capture permission in your browser
- Try using Chrome/Edge for best compatibility

### "Connection failed"
- Check if both users are online
- Ensure the sharing code is correct
- Try refreshing the page and generating a new code

### High Latency / Lag
- Close other bandwidth-intensive applications
- Use a wired internet connection instead of WiFi
- Check the real-time stats display for network issues

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- WebRTC standards by W3C
- Socket.IO for real-time communication
- Vercel for serverless hosting
- Built for the MemeMC Network community

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: MemeMC Network

## 🗺️ Roadmap

- [x] Real WebRTC screen sharing
- [x] Low-latency optimization for gaming
- [x] Vercel deployment support
- [x] Real-time statistics display
- [ ] Audio sharing toggle
- [ ] Quality settings (resolution, framerate)
- [ ] Multiple viewers support
- [ ] Session recording
- [ ] Remote control capabilities
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)

---

**Made with ❤️ by MemeMC Network**

*Version 2.0.0 - Real WebRTC Implementation*



## 📁 Project Structure

```
skibidi.com/
├── index.html          # Main HTML interface
├── styles.css          # Stylesheet with responsive design
├── app.js             # WebRTC client logic
├── api/
│   └── socketio.js    # Serverless Socket.IO handler for Vercel
├── package.json       # Dependencies and scripts
├── vercel.json        # Vercel configuration
└── README.md          # This file
```
