The Tic-Tac-Toe game is structured as a client-server application using WebSocket communication for real-time interaction between two players. Here's a breakdown of the key entities used:

Client Side (client.ts):

Manages the game UI and user interactions.
Uses WebSocket to communicate with the server.
Tracks game state, current player, and updates UI based on server responses.
Server Side (server.ts):

Handles WebSocket connections and messages.
Manages the game state and logic (e.g., checking moves, determining winners).
Broadcasts game updates (moves, game over conditions) to all connected clients.
Basic Flow
Client Initialization:

Establishes a WebSocket connection with the server (initWebSocket()).
Initializes the game board UI and event listeners (DOMContentLoaded event).
Game Play:

Players click on squares on the game board (handleSquareClick).
Sends move data to the server (sendMove), updates local game state and UI (handlePlayerMove).
Server Handling:

Receives move messages from clients (ws.on('message')).
Updates the game state, checks for win conditions (handleMove).
Broadcasts move updates to all clients (wss.clients.forEach).
Win Condition:

After each move, the server checks for win conditions using predefined win patterns (checkWinCondition).
Notifies clients of game over with the result (handleGameEnd).
Win Condition Check
The win condition is checked after each move using predefined win patterns:
Rows: [0, 1, 2], [3, 4, 5], [6, 7, 8]
Columns: [0, 3, 6], [1, 4, 7], [2, 5, 8]
Diagonals: [0, 4, 8], [2, 4, 6]
If any of these patterns match the current player's moves, the player wins.





simple instructions:
Setup and Run the Server:
Ensure you have Node.js installed on your machine.
Compile TypeScript into JavaScript (if not done already):
bash
Copy code
npm run build
Navigate to the root directory of your project.
Start the server:
bash
Copy code
node dist/server.js
The server will run at http://localhost:3000.

