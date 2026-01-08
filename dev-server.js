/**
 * Development Server for Local Testing
 * This mimics the Vercel environment locally
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const PORT = 3000;

// Store active rooms and peers (same as Vercel function)
const rooms = new Map();
const peers = new Map();

// Create HTTP server
const server = http.createServer((req, res) => {
    // Serve static files
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 30000,
    maxHttpBufferSize: 1e8,
    perMessageDeflate: false
});

// Socket.IO event handlers (same logic as api/socketio.js)
io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    socket.on('generate-code', (callback) => {
        const code = generateSharingCode();
        rooms.set(code, {
            host: socket.id,
            viewer: null,
            createdAt: Date.now()
        });
        peers.set(socket.id, { code, role: 'host' });
        socket.join(code);
        
        console.log(`📝 Room created: ${code} by ${socket.id}`);
        callback({ success: true, code });
    });

    socket.on('join-room', (code, callback) => {
        const room = rooms.get(code);
        
        if (!room) {
            return callback({ success: false, message: 'Invalid sharing code' });
        }
        
        if (room.viewer) {
            return callback({ success: false, message: 'Room is full' });
        }

        room.viewer = socket.id;
        peers.set(socket.id, { code, role: 'viewer' });
        socket.join(code);
        
        console.log(`👁️ Viewer ${socket.id} joined room ${code}`);
        io.to(room.host).emit('viewer-joined', socket.id);
        callback({ success: true, hostId: room.host });
    });

    socket.on('offer', (data) => {
        console.log(`📤 Offer from ${socket.id} to ${data.to}`);
        io.to(data.to).emit('offer', {
            offer: data.offer,
            from: socket.id
        });
    });

    socket.on('answer', (data) => {
        console.log(`📤 Answer from ${socket.id} to ${data.to}`);
        io.to(data.to).emit('answer', {
            answer: data.answer,
            from: socket.id
        });
    });

    socket.on('ice-candidate', (data) => {
        console.log(`🧊 ICE candidate from ${socket.id} to ${data.to}`);
        io.to(data.to).emit('ice-candidate', {
            candidate: data.candidate,
            from: socket.id
        });
    });

    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
        
        const peer = peers.get(socket.id);
        if (peer) {
            const room = rooms.get(peer.code);
            if (room) {
                if (room.host === socket.id) {
                    if (room.viewer) {
                        io.to(room.viewer).emit('host-disconnected');
                    }
                    rooms.delete(peer.code);
                } else if (room.viewer === socket.id) {
                    room.viewer = null;
                    io.to(room.host).emit('viewer-disconnected');
                }
            }
            peers.delete(socket.id);
        }
    });
});

// Cleanup old rooms every 5 minutes
setInterval(() => {
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;
    
    for (const [code, room] of rooms.entries()) {
        if (now - room.createdAt > ONE_HOUR) {
            rooms.delete(code);
            console.log(`🧹 Cleaned up expired room: ${code}`);
        }
    }
}, 5 * 60 * 1000);

function generateSharingCode() {
    const part1 = Math.floor(Math.random() * 900 + 100);
    const part2 = Math.floor(Math.random() * 900 + 100);
    const part3 = Math.floor(Math.random() * 900 + 100);
    return `${part1}-${part2}-${part3}`;
}

server.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 Skibidi Screen Share - Development Server');
    console.log('='.repeat(60));
    console.log(`📡 Server running at: http://localhost:${PORT}`);
    console.log(`🔌 Socket.IO ready for WebRTC signaling`);
    console.log(`📅 Started at: ${new Date().toISOString()}`);
    console.log('='.repeat(60));
    console.log('');
    console.log('ℹ️  Open http://localhost:3000 in two browser windows to test');
    console.log('');
});
