const { WebSocketServer } = require('ws');

// Set up the server on port 8080 (or whatever cloud hosting provides)
const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

let connectedClients = [];

wss.on('connection', (ws) => {
    console.log('A player joined the private room!');
    connectedClients.push(ws);

    // Listen for messages sent by any player
    ws.on('message', (message) => {
        // Broadcast the message to the OTHER two players
        connectedClients.forEach((client) => {
            if (client !== ws && client.readyState === ws.OPEN) {
                client.send(message);
            }
        });
    });

    // Clean up when someone leaves or closes the app
    ws.on('close', () => {
        console.log('A player left.');
        connectedClients = connectedClients.filter((client) => client !== ws);
    });
});

console.log(`Private WebSocket server running on port ${PORT}`);
