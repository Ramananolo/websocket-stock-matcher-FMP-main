// test-client.js
import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => console.log('Client connecté au WS server'));
ws.on('message', (data) => {
    const msg = JSON.parse(data);
    console.log('📝 Tick reçu :', msg);
});
