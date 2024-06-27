import WebSocket from 'ws';
import http from 'http';
import express from 'express';
import path from 'path';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, 'client')));

// Define a route handler for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Game state and logic
let gameState: (string | null)[] = Array(9).fill(null); // Represents the tic-tac-toe board state

// WebSocket connection handling
wss.on('connection', (ws: WebSocket) => {
    console.log('A user connected');

    // Handle incoming messages from clients
    ws.on('message', (message: string) => {
        console.log(`Received message: ${message}`);

        // Example: Process game move message
        const data = JSON.parse(message);
        if (data.type === 'move') {
            handleMove(ws, data.move);
        }
    });

    // Handle client disconnects
    ws.on('close', () => {
        console.log('User disconnected');
    });
});

// Function to handle a player's move
function handleMove(ws: WebSocket, move: { index: number, player: 'X' | 'O' }) {
    const { index, player } = move;
    if (gameState[index] === null) {
        gameState[index] = player;
        // Broadcast the move to all connected clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'move', data: move }));
            }
        });
        // Check for game over condition (optional)
        if (checkWinCondition(player)) {
            // Broadcast game over message with winner
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'gameover', data: `${player} wins!` }));
                }
            });
            // Reset game state
            gameState = Array(9).fill(null);
        } else if (!gameState.includes(null)) {
            // Broadcast game over message with draw
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'gameover', data: 'Draw!' }));
                }
            });
            // Reset game state
            gameState = Array(9).fill(null);
        }
    }
}

// Function to check win condition
function checkWinCondition(player: 'X' | 'O'): boolean {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameState[a] === player && gameState[b] === player && gameState[c] === player) {
            return true;
        }
    }
    return false;
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
