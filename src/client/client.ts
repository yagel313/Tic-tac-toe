// client.ts

const serverUrl: string = 'ws://localhost:3000'; // WebSocket server URL
const gameBoard: HTMLElement | null = document.getElementById('gameBoard');
let currentPlayer: 'X' | 'O' = 'X'; // Start with 'X' player
let socket: WebSocket | null = null;

function initWebSocket(): void {
    socket = new WebSocket(serverUrl);

    socket.addEventListener('open', () => {
        console.log('Connected to WebSocket server');
    });

    socket.addEventListener('message', (event: MessageEvent) => {
        console.log('Received message from server:', event.data);
        const message = JSON.parse(event.data);
        if (message.type === 'move') {
            handleOpponentMove(message.data);
        } else if (message.type === 'gameover') {
            handleGameEnd(message.data);
        }
    });

    socket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
    });

    socket.addEventListener('close', () => {
        console.log('Disconnected from WebSocket server');
    });
}

function sendMove(move: { index: number, player: 'X' | 'O' }): void {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'move', move }));
        handlePlayerMove(move);
    } else {
        console.error('WebSocket is not open yet.');
    }
}

function handleSquareClick(event: MouseEvent): void {
    const square = event.target as HTMLDivElement;
    const index = square.getAttribute('data-index');
    if (index && !square.textContent && socket && socket.readyState === WebSocket.OPEN) {
        const move = { index: parseInt(index), player: currentPlayer };
        sendMove(move);
    } else {
        console.error('WebSocket is not open or still connecting.');
    }
}

function handlePlayerMove(move: { index: number, player: 'X' | 'O' }): void {
    const square = gameBoard?.querySelector(`[data-index="${move.index}"]`) as HTMLDivElement | null;
    if (square) {
        square.textContent = move.player;
        currentPlayer = move.player === 'X' ? 'O' : 'X';
    }
}

function handleOpponentMove(move: { index: number, player: 'X' | 'O' }): void {
    handlePlayerMove(move);
}

function handleGameEnd(result: string): void {
    alert(`Game Over! Result: ${result}`);
}

// Initialize WebSocket connection when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initWebSocket();

    // Example: Create game board squares
    for (let i = 0; i < 9; i++) {
        const square: HTMLDivElement = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('data-index', i.toString());
        square.addEventListener('click', handleSquareClick);
        if (gameBoard) {
            gameBoard.appendChild(square);
        }
    }
});