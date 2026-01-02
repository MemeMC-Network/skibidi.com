/**
 * Skibidi Screen Share - Frontend Application
 * 
 * This file handles the client-side logic for the screen sharing interface.
 * It manages user interactions, input validation, and connection simulation.
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
let connectionTimeout = null;

// ============================================
// Utility Functions
// ============================================

/**
 * Generates a random 9-digit sharing code
 * @returns {string} Formatted sharing code (XXX-XXX-XXX)
 */
function generateSharingCode() {
    const part1 = Math.floor(Math.random() * 900 + 100);
    const part2 = Math.floor(Math.random() * 900 + 100);
    const part3 = Math.floor(Math.random() * 900 + 100);
    return `${part1}-${part2}-${part3}`;
}

/**
 * Validates the format of a sharing code
 * @param {string} code - The code to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateSharingCode(code) {
    // Remove spaces and check if it matches XXX-XXX-XXX or XXXXXXXXX format
    const cleanCode = code.replace(/\s/g, '');
    const pattern = /^\d{3}-\d{3}-\d{3}$|^\d{9}$/;
    return pattern.test(cleanCode);
}

/**
 * Formats input as user types to match XXX-XXX-XXX pattern
 * @param {string} value - The input value
 * @returns {string} Formatted value
 */
function formatSharingCode(value) {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as XXX-XXX-XXX
    if (digits.length <= 3) {
        return digits;
    } else if (digits.length <= 6) {
        return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}`;
    }
}

/**
 * Displays a status message to the user
 * @param {string} message - The message to display
 * @param {string} type - Message type: 'success', 'error', or 'info'
 */
function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 5000);
}

/**
 * Updates the connection status indicator
 * @param {string} status - Status: 'connected', 'connecting', or 'disconnected'
 * @param {string} text - Status text to display
 */
function updateConnectionStatus(status, text) {
    connectionStatus.className = `connection-status ${status}`;
    statusText.textContent = text;
}

// ============================================
// Connection Functions
// ============================================

/**
 * Simulates connecting to a remote screen
 * @param {string} code - The sharing code to connect with
 */
function connectToRemote(code) {
    if (!validateSharingCode(code)) {
        showStatusMessage('Invalid sharing code format. Please use XXX-XXX-XXX format.', 'error');
        return;
    }

    // Update UI to show connecting state
    updateConnectionStatus('connecting', 'Connecting...');
    showStatusMessage('Establishing connection...', 'info');
    connectBtn.disabled = true;
    connectBtn.textContent = 'Connecting...';

    // Simulate connection delay
    connectionTimeout = setTimeout(() => {
        isConnected = true;
        currentCode = code;
        
        // Update UI to show connected state
        updateConnectionStatus('connected', `Connected to ${code}`);
        showStatusMessage(`Successfully connected to remote screen: ${code}`, 'success');
        
        // Update screen display
        screenDisplay.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #ecf0f1;">
                <div style="font-size: 3rem; margin-bottom: 20px;">🎥</div>
                <h3 style="color: #ecf0f1; margin-bottom: 10px;">Screen Sharing Active</h3>
                <p style="color: #95a5a6; margin-bottom: 15px;">Connected to: ${code}</p>
                <div style="background: rgba(74, 144, 226, 0.2); padding: 15px; border-radius: 8px; border: 2px dashed #4a90e2;">
                    <p style="color: #4a90e2; font-weight: 600;">🚀 Remote screen content would appear here</p>
                    <p style="color: #95a5a6; font-size: 0.9rem; margin-top: 8px;">This is a placeholder for the actual screen stream</p>
                </div>
            </div>
        `;
        
        // Show controls
        screenControls.style.display = 'flex';
        
        // Reset button
        connectBtn.disabled = false;
        connectBtn.innerHTML = '<span class="btn-icon">🔗</span>Connect';
        
    }, 2000); // 2 second connection simulation
}

/**
 * Disconnects from the current remote session
 */
function disconnectFromRemote() {
    if (connectionTimeout) {
        clearTimeout(connectionTimeout);
    }
    
    isConnected = false;
    currentCode = null;
    
    // Update UI
    updateConnectionStatus('disconnected', 'Not Connected');
    showStatusMessage('Disconnected from remote screen', 'info');
    
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
}

/**
 * Handles fullscreen toggle
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
connectBtn.addEventListener('click', () => {
    const code = sharingCodeInput.value.trim();
    
    if (!code) {
        showStatusMessage('Please enter a sharing code', 'error');
        sharingCodeInput.focus();
        return;
    }
    
    if (isConnected) {
        showStatusMessage('Already connected. Disconnect first to connect to a different screen.', 'info');
        return;
    }
    
    connectToRemote(code);
});

// Generate button click handler
generateBtn.addEventListener('click', () => {
    const newCode = generateSharingCode();
    sharingCodeInput.value = newCode;
    showStatusMessage(`Your sharing code: ${newCode} - Share this with others to let them connect to your screen`, 'success');
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
// API Integration (Placeholder)
// ============================================

/**
 * Sends connection request to backend API
 * This is a placeholder for actual API integration
 * 
 * @param {string} code - The sharing code
 * @returns {Promise} Promise resolving to connection result
 */
async function apiConnect(code) {
    // TODO: Replace with actual API endpoint
    // Example implementation:
    try {
        const response = await fetch('/api/connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code })
        });
        
        if (!response.ok) {
            throw new Error('Connection failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Generates a new sharing code via backend API
 * This is a placeholder for actual API integration
 * 
 * @returns {Promise} Promise resolving to new sharing code
 */
async function apiGenerateCode() {
    // TODO: Replace with actual API endpoint
    // Example implementation:
    try {
        const response = await fetch('/api/generate-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error('Code generation failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============================================
// Initialization
// ============================================
console.log('🚀 Skibidi Screen Share initialized');
console.log('📝 Ready to connect...');
