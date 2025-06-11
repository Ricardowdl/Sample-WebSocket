const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', message => {
    console.log(`Received message => ${message}`);
    // Echo message back to client
    ws.send(`Hello, you sent111 -> ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.send('Hi there, I am a WebSocket server');
});

console.log('WebSocket server started on port 8080');