// server.js
import 'dotenv/config';
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { cache, initCache, matchingConfig } from './src/cache.js';
import { fetchAndUpdateData } from './src/twelve_poll.js';
import { broadcast } from './src/broadcaster.js';

const app = express();
app.use(cors());
app.use(express.json()); // Pour parser JSON

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ==========================
// ROUTES REST POUR FRONT-END
// ==========================

// Récupérer la config actuelle
app.get('/api/matching-config', (req, res) => {
  res.json(matchingConfig);
});

// Mettre à jour la config depuis le front
app.post('/api/matching-config', (req, res) => {
  const { intradayDrop, weekDrop, monthDrop, peMax } = req.body;

  if (
    typeof intradayDrop !== 'number' ||
    typeof weekDrop !== 'number' ||
    typeof monthDrop !== 'number' ||
    typeof peMax !== 'number'
  ) {
    return res.status(400).json({ message: 'Invalid configuration' });
  }

  matchingConfig.intradayDrop = intradayDrop;
  matchingConfig.weekDrop = weekDrop;
  matchingConfig.monthDrop = monthDrop;
  matchingConfig.peMax = peMax;

  console.log('⚡ Matching config updated from front-end:', matchingConfig);

  // Mettre à jour également le filtre PE dans cache
  cache.filters.peMax = peMax;

  res.json({ message: 'Configuration updated', matchingConfig });
});

// ==========================
// WEBSOCKET POUR FRONT-END
// ==========================
wss.on('connection', (ws) => {
  console.log('📡 Client connecté au WS local');

  // Envoi immédiat des données existantes
  if (cache.size > 0) {
    const initialRows = Array.from(cache.entries()).map(([ticker, data]) => ({ ticker, ...data }));
    ws.send(JSON.stringify({ event: 'scan', payload: initialRows }));
  }

  ws.on('close', () => console.log('Client déconnecté'));
});

// ==========================
// POLLING DES DONNÉES ET BROADCAST
// ==========================
initCache();

setInterval(async () => {
  await fetchAndUpdateData();
  broadcast(wss);
}, process.env.POLL_INTERVAL || 1000);

// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 WS local server wss://localhost:${PORT}`));
