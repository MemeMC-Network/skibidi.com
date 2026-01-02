/**
 * Skibidi Screen Share - Real WebRTC Implementation
 * 
 * This file handles real-time screen sharing using WebRTC with optimizations
 * for low latency suitable for gaming and high-performance applications.
 */

// ============================================
// DOM Elements
// ============================================
const sharingCodeInput = document.getElementById('sharingCode');
const connectBtn = document.getElementById('connectBtn');
const generateBtn = document.getElementById('generateBtn');
const statusMessage = document.getElementById('statusMessage');
const connectionStatus = document.getElementById('connectionStatus');
const statusText = document.getElementById('statusText');
const screenDisplay = document.getElementById('screenDisplay');
const screenControls = document.getElementById('screenControls');
const disconnectBtn = document.getElementById('disconnectBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const settingsBtn = document.getElementById('settingsBtn');

// ============================================
// State Management
// ============================================
let isConnected = false;
let currentCode = null;
let socket = null;
let peerConnection = null;
let localStream = null;
let remoteStream = null;
let role = null; // 'host' or 'viewer'
let remotePeerId = null;
let statsInterval = null;

// ============================================
// WebRTC Configuration (Optimized for Low Latency)
// ============================================
const rtcConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 10
};

// Optimized constraints for low-latency, high-quality screen sharing
const screenConstraints = {
    video: {
        cursor: 'always',
        displaySurface: 'monitor',
        frameRate: { ideal: 60, max: 60 },
        width: { ideal: 1920, max: 2560 },
        height: { ideal: 1080, max: 1440 }
    },
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    }
};

// ============================================
// Socket.IO Connection
// ============================================
function initializeSocket() {
    // Connect to Socket.IO server (works for both local and Vercel)
    const socketURL = window.location.origin;
    socket = io(socketURL, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
    });

    socket.on('connect', () => {
        console.log('✅ Connected to signaling server');
    });

    socket.on('disconnect', () => {
        console.log('❌ Disconnected from signaling server');
        if (isConnected) {
            showStatusMessage('Connection to server lost', 'error');
        }
    });

    socket.on('viewer-joined', async (viewerId) => {
        console.log(`👁️ Viewer joined: ${viewerId}`);
        remotePeerId = viewerId;
        showStatusMessage('Viewer connected! Creating peer connection...', 'info');
        await createOffer(viewerId);
    });

    socket.on('offer', async (data) => {
        console.log(`📨 Received offer from ${data.from}`);
        remotePeerId = data.from;
        await handleOffer(data.offer, data.from);
    });

    socket.on('answer', async (data) => {
        console.log(`📨 Received answer from ${data.from}`);
        await handleAnswer(data.answer);
    });

    socket.on('ice-candidate', async (data) => {
        console.log(`🧊 Received ICE candidate from ${data.from}`);
        await handleIceCandidate(data.candidate);
    });

    socket.on('host-disconnected', () => {
        showStatusMessage('Host disconnected', 'error');
        disconnectFromRemote();
    });

    socket.on('viewer-disconnected', () => {
        showStatusMessage('Viewer disconnected', 'info');
        if (peerConnection) {
            peerConnection.close();
            peerConnection = null;
        }
        remotePeerId = null;
    });
}

// ============================================
// WebRTC Functions
// ============================================

/**
 * Create peer connection with optimized settings
 */
function createPeerConnection() {
    peerConnection = new RTCPeerConnection(rtcConfig);

    // Add tracks from local stream (for host)
    if (localStream && role === 'host') {
        localStream.getTracks().forEach(track => {
            const sender = peerConnection.addTrack(track, localStream);
            
            // Optimize encoding parameters for low latency
            if (track.kind === 'video') {
                const parameters = sender.getParameters();
                if (!parameters.encodings) {
                    parameters.encodings = [{}];
                }
                // Set parameters for low latency
                parameters.encodings[0].maxBitrate = 10000000; // 10 Mbps
                parameters.encodings[0].priority = 'high';
                sender.setParameters(parameters);
            }
        });
    }

    // Handle incoming tracks (for viewer)
    peerConnection.ontrack = (event) => {
        console.log('📺 Received remote track');
        if (!remoteStream) {
            remoteStream = new MediaStream();
        }
        remoteStream.addTrack(event.track);
        displayRemoteStream();
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log('🧊 Sending ICE candidate');
            socket.emit('ice-candidate', {
                candidate: event.candidate,
                to: remotePeerId
            });
        }
    };

    // Connection state monitoring
    peerConnection.onconnectionstatechange = () => {
        console.log(`🔌 Connection state: ${peerConnection.connectionState}`);
        
        if (peerConnection.connectionState === 'connected') {
            isConnected = true;
            updateConnectionStatus('connected', `Connected to ${currentCode}`);
            showStatusMessage('Successfully connected!', 'success');
            startStatsMonitoring();
        } else if (peerConnection.connectionState === 'disconnected' || 
                   peerConnection.connectionState === 'failed') {
            showStatusMessage('Connection lost', 'error');
            disconnectFromRemote();
        }
    };

    return peerConnection;
}

/**
 * Create and send offer to viewer
 */
async function createOffer(viewerId) {
    try {
        createPeerConnection();
        
        const offer = await peerConnection.createOffer({
            offerToReceiveAudio: false,
            offerToReceiveVideo: false
        });

        // Modify SDP for lower latency
        offer.sdp = optimizeSDPForLatency(offer.sdp);
        
        await peerConnection.setLocalDescription(offer);
        
        socket.emit('offer', {
            offer: offer,
            to: viewerId
        });
        
        console.log('📤 Offer sent to viewer');
    } catch (error) {
        console.error('Error creating offer:', error);
        showStatusMessage('Failed to create connection', 'error');
    }
}

/**
 * Handle incoming offer and create answer
 */
async function handleOffer(offer, from) {
    try {
        createPeerConnection();
        
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        
        const answer = await peerConnection.createAnswer();
        
        // Modify SDP for lower latency
        answer.sdp = optimizeSDPForLatency(answer.sdp);
        
        await peerConnection.setLocalDescription(answer);
        
        socket.emit('answer', {
            answer: answer,
            to: from
        });
        
        console.log('📤 Answer sent to host');
    } catch (error) {
        console.error('Error handling offer:', error);
        showStatusMessage('Failed to establish connection', 'error');
    }
}

/**
 * Handle incoming answer
 */
async function handleAnswer(answer) {
    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('✅ Answer received and processed');
    } catch (error) {
        console.error('Error handling answer:', error);
    }
}

/**
 * Handle incoming ICE candidate
 */
async function handleIceCandidate(candidate) {
    try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('✅ ICE candidate added');
    } catch (error) {
        console.error('Error adding ICE candidate:', error);
    }
}

/**
 * Optimize SDP for low latency
 */
function optimizeSDPForLatency(sdp) {
    // Set maximum bitrate
    sdp = sdp.replace(/a=fmtp:(\d+) /g, 'a=fmtp:$1 x-google-max-bitrate=10000;x-google-min-bitrate=2000;x-google-start-bitrate=5000;');
    
    // Enable hardware acceleration hints
    sdp = sdp.replace(/a=rtpmap:(\d+) H264/g, 'a=rtpmap:$1 H264\r\na=fmtp:$1 profile-level-id=42e01f;level-asymmetry-allowed=1;packetization-mode=1');
    
    return sdp;
}

/**
 * Display remote stream in video element
 */
function displayRemoteStream() {
    screenDisplay.innerHTML = `
        <video id="remoteVideo" autoplay playsinline style="width: 100%; height: 100%; object-fit: contain; background: #000;"></video>
        <div id="streamStats" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: #0f0; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px;"></div>
    `;
    
    const videoElement = document.getElementById('remoteVideo');
    videoElement.srcObject = remoteStream;
    
    screenControls.style.display = 'flex';
}

/**
 * Start monitoring connection statistics
 */
async function startStatsMonitoring() {
    if (statsInterval) {
        clearInterval(statsInterval);
    }
    
    statsInterval = setInterval(async () => {
        if (!peerConnection) return;
        
        try {
            const stats = await peerConnection.getStats();
            let statsText = '';
            let videoStats = null;
            
            stats.forEach(report => {
                if (report.type === 'inbound-rtp' && report.kind === 'video') {
                    videoStats = report;
                }
            });
            
            if (videoStats) {
                const bitrate = Math.round((videoStats.bytesReceived * 8) / 1000); // kbps
                const fps = videoStats.framesPerSecond || 0;
                const packetsLost = videoStats.packetsLost || 0;
                
                statsText = `
                    📊 FPS: ${fps}
                    📈 Bitrate: ${bitrate} kbps
                    📦 Packets Lost: ${packetsLost}
                `;
                
                const statsEl = document.getElementById('streamStats');
                if (statsEl) {
                    statsEl.textContent = statsText.trim();
                }
            }
        } catch (error) {
            console.error('Error getting stats:', error);
        }
    }, 1000);
}

// ============================================
// Utility Functions
// ============================================

/**
 * Validates the format of a sharing code
 * @param {string} code - The code to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateSharingCode(code) {
    const cleanCode = code.replace(/\s/g, '');
    const pattern = /^\d{3}-\d{3}-\d{3}$|^\d{9}$/;
    return pattern.test(cleanCode);
}

/**
 * Formats input as user types to match XXX-XXX-XXX pattern
 */
function formatSharingCode(value) {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 3) {
        return digits;
    } else if (digits.length <= 6) {
        return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}`;
    }
}

/**
 * Display status message to user
 */
function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 5000);
}

/**
 * Update connection status indicator
 */
function updateConnectionStatus(status, text) {
    connectionStatus.className = `connection-status ${status}`;
    statusText.textContent = text;
}

// ============================================
// Screen Sharing Functions
// ============================================

/**
 * Start screen sharing (host)
 */
async function startScreenSharing(code) {
    try {
        updateConnectionStatus('connecting', 'Starting screen capture...');
        
        // Request screen capture with optimized settings
        localStream = await navigator.mediaDevices.getDisplayMedia(screenConstraints);
        
        currentCode = code;
        role = 'host';
        
        // Display local preview
        screenDisplay.innerHTML = `
            <video id="localVideo" autoplay muted playsinline style="width: 100%; height: 100%; object-fit: contain; background: #000;"></video>
            <div style="position: absolute; top: 10px; left: 10px; background: rgba(80, 200, 120, 0.9); color: white; padding: 8px 15px; border-radius: 5px; font-weight: 600;">
                🔴 Sharing - Code: ${code}
            </div>
        `;
        
        const videoElement = document.getElementById('localVideo');
        videoElement.srcObject = localStream;
        
        screenControls.style.display = 'flex';
        updateConnectionStatus('connected', `Sharing as ${code} - Waiting for viewer...`);
        showStatusMessage(`Your screen is being shared. Code: ${code}`, 'success');
        
        // Handle stream ending (user stops sharing)
        localStream.getVideoTracks()[0].onended = () => {
            showStatusMessage('Screen sharing stopped', 'info');
            disconnectFromRemote();
        };
        
    } catch (error) {
        console.error('Error starting screen share:', error);
        showStatusMessage('Failed to start screen sharing. Please allow screen access.', 'error');
        disconnectFromRemote();
    }
}

/**
 * Connect as viewer
 */
async function connectAsViewer(code) {
    try {
        currentCode = code;
        role = 'viewer';
        
        updateConnectionStatus('connecting', 'Connecting to host...');
        showStatusMessage('Connecting to remote screen...', 'info');
        
        socket.emit('join-room', code, (response) => {
            if (response.success) {
                console.log(`✅ Joined room ${code}, waiting for stream...`);
                remotePeerId = response.hostId;
                // Wait for host to send offer
            } else {
                showStatusMessage(response.message, 'error');
                disconnectFromRemote();
            }
        });
        
    } catch (error) {
        console.error('Error connecting:', error);
        showStatusMessage('Connection failed', 'error');
        disconnectFromRemote();
    }
}

/**
 * Disconnect from remote session and cleanup
 */
function disconnectFromRemote() {
    // Stop stats monitoring
    if (statsInterval) {
        clearInterval(statsInterval);
        statsInterval = null;
    }
    
    // Close peer connection
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    
    // Stop local stream
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    
    // Clear remote stream
    remoteStream = null;
    
    isConnected = false;
    currentCode = null;
    role = null;
    remotePeerId = null;
    
    // Update UI
    updateConnectionStatus('disconnected', 'Not Connected');
    
    // Reset screen display
    screenDisplay.innerHTML = `
        <div class="placeholder-content">
            <div class="placeholder-icon">🖥️</div>
            <h3>No Active Connection</h3>
            <p>Enter a sharing code above to connect to a remote desktop</p>
        </div>
    `;
    
    // Hide controls
    screenControls.style.display = 'none';
    
    // Clear input
    sharingCodeInput.value = '';
    
    // Reset button
    connectBtn.disabled = false;
    connectBtn.innerHTML = '<span class="btn-icon">🔗</span>Connect';
}

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        screenDisplay.requestFullscreen().catch(err => {
            showStatusMessage(`Fullscreen error: ${err.message}`, 'error');
        });
    } else {
        document.exitFullscreen();
    }
}

// ============================================
// Event Listeners
// ============================================

// Format sharing code input as user types
sharingCodeInput.addEventListener('input', (e) => {
    e.target.value = formatSharingCode(e.target.value);
});

// Allow Enter key to connect
sharingCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        connectBtn.click();
    }
});

// Connect button click handler
connectBtn.addEventListener('click', async () => {
    const code = sharingCodeInput.value.trim();
    
    if (!code) {
        showStatusMessage('Please enter a sharing code', 'error');
        sharingCodeInput.focus();
        return;
    }
    
    if (!validateSharingCode(code)) {
        showStatusMessage('Invalid sharing code format. Please use XXX-XXX-XXX format.', 'error');
        return;
    }
    
    if (isConnected) {
        showStatusMessage('Already connected. Disconnect first to connect to a different screen.', 'info');
        return;
    }
    
    connectBtn.disabled = true;
    connectBtn.textContent = 'Connecting...';
    
    // Connect as viewer
    await connectAsViewer(code);
});

// Generate button click handler - Start screen sharing as host
generateBtn.addEventListener('click', async () => {
    if (isConnected) {
        showStatusMessage('Already sharing or connected.', 'info');
        return;
    }
    
    generateBtn.disabled = true;
    generateBtn.textContent = 'Starting...';
    
    socket.emit('generate-code', async (response) => {
        if (response.success) {
            const code = response.code;
            sharingCodeInput.value = code;
            await startScreenSharing(code);
        } else {
            showStatusMessage('Failed to generate code', 'error');
        }
        
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<span class="btn-icon">🔑</span>Generate My Code';
    });
});

// Disconnect button click handler
disconnectBtn.addEventListener('click', () => {
    disconnectFromRemote();
});

// Fullscreen button click handler
fullscreenBtn.addEventListener('click', () => {
    toggleFullscreen();
});

// Settings button click handler (placeholder)
settingsBtn.addEventListener('click', () => {
    showStatusMessage('Settings panel coming soon!', 'info');
});

// ============================================
// Initialization
// ============================================
console.log('🚀 Skibidi Screen Share - Real WebRTC Implementation');
console.log('📝 Initializing...');

// Initialize Socket.IO connection
initializeSocket();

