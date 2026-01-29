import { cache } from './cache.js';

export function broadcast(wss) {
  const rows = Array.from(cache.entries())
    .map(([ticker, data]) => ({
      ticker: data.ticker,
      price: data.price,
      prevClose: data.prevClose,
      week: data.week,
      month: data.month,
      pe: data.pe,
      volume: data.volume,
      score: data.score,
      intraday: data.intraday,
      percWeek: data.percWeek,
      percMonth: data.percMonth,
      market: data.market
    }))


    .sort((a, b) => b.score - a.score || a.intraday - b.intraday);


  const packet = JSON.stringify({ event: "scan", payload: rows });

  wss.clients.forEach(ws => {
    if (ws.readyState === ws.OPEN) ws.send(packet);
  });

  console.log("Broadcast rows :", rows.length, "symbols");
}
