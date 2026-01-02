/**
 * Skibidi Screen Share - Backend Server (Node.js/Express)
 * 
 * This is a placeholder backend implementation for the screen sharing service.
 * It provides API endpoints for connection management and code generation.
 * 
 * SETUP INSTRUCTIONS:
 * -------------------
 * 1. Install Node.js (v14 or higher) from https://nodejs.org
 * 2. Initialize the project: npm init -y
 * 3. Install dependencies: npm install express cors body-parser ws
 * 4. Run the server: node server.js
 * 5. Access the app at: http://localhost:3000
 * 
 * REQUIRED DEPENDENCIES:
 * ----------------------
 * - express: Web framework for Node.js
 * - cors: Enable Cross-Origin Resource Sharing
 * - body-parser: Parse JSON request bodies
 * - ws: WebSocket library for real-time communication
 */

// ============================================
// Dependencies (uncomment after npm install)
// ============================================
/*
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const path = require('path');
*/

// ============================================
// Configuration
// ============================================
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// ============================================
// Server Setup (uncomment after npm install)
// ============================================
/*
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// WebSocket server for real-time screen sharing
const wss = new WebSocket.Server({ noServer: true });
*/

// ============================================
// In-Memory Storage (replace with database in production)
// ============================================
/*
const activeSessions = new Map(); // Store active screen sharing sessions
const pendingConnections = new Map(); // Store pending connection requests

// Session structure:
// {
//   code: string,           // Sharing code
//   hostId: string,         // Host connection ID
//   viewerId: string,       // Viewer connection ID (if connected)
//   createdAt: timestamp,   // Session creation time
//   status: string          // 'waiting', 'active', 'closed'
// }
*/

// ============================================
// Utility Functions
// ============================================

/**
 * Generates a unique 9-digit sharing code
 * @returns {string} Formatted sharing code (XXX-XXX-XXX)
 */
function generateSharingCode() {
    const part1 = Math.floor(Math.random() * 900 + 100);
    const part2 = Math.floor(Math.random() * 900 + 100);
    const part3 = Math.floor(Math.random() * 900 + 100);
    return `${part1}-${part2}-${part3}`;
}

/**
 * Validates sharing code format
 * @param {string} code - The code to validate
 * @returns {boolean} True if valid
 */
function validateCode(code) {
    const pattern = /^\d{3}-\d{3}-\d{3}$/;
    return pattern.test(code);
}

/**
 * Cleans up expired sessions (older than 1 hour)
 */
/*
function cleanupExpiredSessions() {
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;
    
    for (const [code, session] of activeSessions.entries()) {
        if (now - session.createdAt > ONE_HOUR) {
            activeSessions.delete(code);
            console.log(`Cleaned up expired session: ${code}`);
        }
    }
}

// Run cleanup every 10 minutes
setInterval(cleanupExpiredSessions, 10 * 60 * 1000);
*/

// ============================================
// API Endpoints
// ============================================

/**
 * POST /api/generate-code
 * 
 * Generates a new sharing code for the host to share
 * 
 * Response:
 * {
 *   success: boolean,
 *   code: string,
 *   message: string
 * }
 */
/*
app.post('/api/generate-code', (req, res) => {
    try {
        const code = generateSharingCode();
        
        // Create new session
        activeSessions.set(code, {
            code: code,
            hostId: null,
            viewerId: null,
            createdAt: Date.now(),
            status: 'waiting'
        });
        
        console.log(`Generated new sharing code: ${code}`);
        
        res.json({
            success: true,
            code: code,
            message: 'Sharing code generated successfully'
        });
    } catch (error) {
        console.error('Error generating code:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate sharing code'
        });
    }
});
*/

/**
 * POST /api/connect
 * 
 * Attempts to connect to a remote screen using a sharing code
 * 
 * Request Body:
 * {
 *   code: string  // The sharing code to connect with
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   message: string,
 *   sessionId: string (if successful)
 * }
 */
/*
app.post('/api/connect', (req, res) => {
    try {
        const { code } = req.body;
        
        if (!code || !validateCode(code)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid sharing code format'
            });
        }
        
        const session = activeSessions.get(code);
        
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Sharing code not found or expired'
            });
        }
        
        if (session.status === 'active') {
            return res.status(409).json({
                success: false,
                message: 'Session already has an active viewer'
            });
        }
        
        console.log(`Connection request for code: ${code}`);
        
        res.json({
            success: true,
            message: 'Connection request accepted',
            sessionId: code
        });
    } catch (error) {
        console.error('Error connecting:', error);
        res.status(500).json({
            success: false,
            message: 'Connection failed'
        });
    }
});
*/

/**
 * POST /api/disconnect
 * 
 * Disconnects from an active screen sharing session
 * 
 * Request Body:
 * {
 *   sessionId: string  // The session to disconnect from
 * }
 */
/*
app.post('/api/disconnect', (req, res) => {
    try {
        const { sessionId } = req.body;
        
        const session = activeSessions.get(sessionId);
        
        if (session) {
            session.status = 'closed';
            activeSessions.delete(sessionId);
            console.log(`Disconnected session: ${sessionId}`);
        }
        
        res.json({
            success: true,
            message: 'Disconnected successfully'
        });
    } catch (error) {
        console.error('Error disconnecting:', error);
        res.status(500).json({
            success: false,
            message: 'Disconnect failed'
        });
    }
});
*/

/**
 * GET /api/sessions
 * 
 * Returns list of active sessions (for debugging/admin)
 */
/*
app.get('/api/sessions', (req, res) => {
    const sessions = Array.from(activeSessions.values());
    res.json({
        success: true,
        count: sessions.length,
        sessions: sessions
    });
});
*/

// ============================================
// WebSocket Handling for Real-Time Screen Sharing
// ============================================

/**
 * WebSocket connection handler
 * 
 * This handles real-time bidirectional communication for screen sharing.
 * The host sends screen data, and the viewer receives it.
 */
/*
wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established');
    
    let sessionCode = null;
    let role = null; // 'host' or 'viewer'
    
    // Handle incoming messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            switch (data.type) {
                case 'join':
                    // Client joining a session
                    sessionCode = data.code;
                    role = data.role;
                    
                    const session = activeSessions.get(sessionCode);
                    if (session) {
                        if (role === 'host') {
                            session.hostId = ws;
                        } else if (role === 'viewer') {
                            session.viewerId = ws;
                            session.status = 'active';
                        }
                        
                        ws.send(JSON.stringify({
                            type: 'joined',
                            success: true,
                            code: sessionCode
                        }));
                        
                        console.log(`${role} joined session: ${sessionCode}`);
                    }
                    break;
                
                case 'screen-data':
                    // Host sending screen data to viewer
                    if (role === 'host' && sessionCode) {
                        const session = activeSessions.get(sessionCode);
                        if (session && session.viewerId) {
                            session.viewerId.send(JSON.stringify({
                                type: 'screen-data',
                                data: data.data
                            }));
                        }
                    }
                    break;
                
                case 'control':
                    // Viewer sending control commands (mouse, keyboard)
                    if (role === 'viewer' && sessionCode) {
                        const session = activeSessions.get(sessionCode);
                        if (session && session.hostId) {
                            session.hostId.send(JSON.stringify({
                                type: 'control',
                                action: data.action,
                                data: data.data
                            }));
                        }
                    }
                    break;
            }
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    });
    
    // Handle disconnection
    ws.on('close', () => {
        console.log(`WebSocket disconnected: ${role} from session ${sessionCode}`);
        
        if (sessionCode) {
            const session = activeSessions.get(sessionCode);
            if (session) {
                if (role === 'host') {
                    // If host disconnects, close the session
                    activeSessions.delete(sessionCode);
                    if (session.viewerId) {
                        session.viewerId.send(JSON.stringify({
                            type: 'host-disconnected'
                        }));
                    }
                } else if (role === 'viewer') {
                    // If viewer disconnects, mark session as waiting
                    session.viewerId = null;
                    session.status = 'waiting';
                }
            }
        }
    });
});
*/

// ============================================
// Server Startup
// ============================================

/**
 * Start the HTTP and WebSocket servers
 */
/*
const server = app.listen(PORT, HOST, () => {
    console.log('='.repeat(50));
    console.log('🚀 Skibidi Screen Share Server');
    console.log('='.repeat(50));
    console.log(`📡 Server running at: http://${HOST}:${PORT}`);
    console.log(`🌐 Access the app at: http://localhost:${PORT}`);
    console.log(`📅 Started at: ${new Date().toISOString()}`);
    console.log('='.repeat(50));
});

// Upgrade HTTP connection to WebSocket
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
*/

// ============================================
// Exports (for testing)
// ============================================
/*
module.exports = {
    generateSharingCode,
    validateCode
};
*/

// ============================================
// PLACEHOLDER NOTICE
// ============================================
console.log('='.repeat(60));
console.log('⚠️  BACKEND PLACEHOLDER - NOT YET CONFIGURED');
console.log('='.repeat(60));
console.log('This is a template backend server for Skibidi Screen Share.');
console.log('');
console.log('TO GET STARTED:');
console.log('1. Install Node.js from https://nodejs.org');
console.log('2. Run: npm init -y');
console.log('3. Run: npm install express cors body-parser ws');
console.log('4. Uncomment the code sections in this file');
console.log('5. Run: node server.js');
console.log('');
console.log('The frontend currently works in demo mode without a backend.');
console.log('='.repeat(60));
