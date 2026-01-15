// server.js
import 'dotenv/config';
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { cache, initCache } from './src/cache.js';
import { fetchAndUpdateData } from './src/twelve_poll.js';
import { broadcast } from './src/broadcaster.js';

const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Initialise cache
initCache();

// WS interne pour clients front-end
wss.on('connection', (ws) => {
  console.log('📡 Client connecté au WS local');

  // Envoi immédiat des données existantes si disponibles
  if (cache.size > 0) {
    const initialRows = Array.from(cache.entries()).map(([ticker, data]) => ({ ticker, ...data }));
    ws.send(JSON.stringify({ event: 'scan', payload: initialRows }));
  }

  ws.on('close', () => console.log('Client déconnecté'));
});

// Polling REST et broadcast toutes les X secondes
setInterval(async () => {
  await fetchAndUpdateData();
  broadcast(wss);
}, process.env.POLL_INTERVAL || 5000); // toutes les 5 secondes par défaut

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 WS local server wss://localhost:${PORT}`));
