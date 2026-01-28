import fetch from 'node-fetch';
import { cache } from './cache.js';
import { computeScore, computePercents } from './score.js';
import { fetchPE } from './fmp_pe.js';

const SYMBOLS_US = process.env.SYMBOLS_US?.split(',') || [];
const SYMBOLS_FR = process.env.SYMBOLS_FR?.split(',') || [];
const SYMBOLS = [...SYMBOLS_US, ...SYMBOLS_FR];

export async function fetchAndUpdateData() {
  for (const symbol of SYMBOLS) {
    try {
      const market = SYMBOLS_US.includes(symbol) ? "US" : "UE";

      // 1️⃣ Prix temps réel
      const url = `${process.env.TWELVE_REST_URL}/time_series?symbol=${symbol}&interval=1min&outputsize=2&apikey=${process.env.TWELVE_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.values || data.values.length === 0) continue;

      const price = parseFloat(data.values[0].close);
      const prevClose = parseFloat(data.values[1]?.close) || price;
      const volume = parseInt(data.values[0].volume) || 0;

      // 2️⃣ Série daily pour semaine/mois
      const urlSeries = `${process.env.TWELVE_REST_URL}/time_series?symbol=${symbol}&interval=1day&outputsize=22&apikey=${process.env.TWELVE_KEY}`;
      const resSeries = await fetch(urlSeries);
      const dataSeries = await resSeries.json();

      let weekPrice = price;
      let monthPrice = price;
      if (dataSeries.values && dataSeries.values.length >= 6) weekPrice = parseFloat(dataSeries.values[5].close);
      if (dataSeries.values && dataSeries.values.length >= 22) monthPrice = parseFloat(dataSeries.values[21].close);

      // 3️⃣ PE
      const pe = await fetchPE(symbol);
      if (!pe) console.warn(`⚠️ PE unavailable for ${symbol}`);

      // 4️⃣ Garde-fous
      if (price < parseFloat(process.env.PRICE_MIN || 5)) continue;
      if (volume < parseInt(process.env.VOLUME_MIN || 500000)) continue;

      // 5️⃣ Calcul score et pourcentages
      const score = computeScore({ price, prevClose, week: weekPrice, month: monthPrice, pe });
      const { intraday, percWeek, percMonth } = computePercents({ price, prevClose, week: weekPrice, month: monthPrice });

      // 6️⃣ Stockage dans cache
      cache.set(symbol, {
        ticker: symbol,
        price,
        prevClose,
        week: weekPrice,
        month: monthPrice,
        pe,
        volume,
        score,
        intraday,
        percWeek,
        percMonth,
        market: market,
        history: [price]
      });

      console.log(`📊 ${symbol} | Price: ${price} | Volume: ${volume}  | PE: ${pe ?? 'N/A'} | Score: ${score} | Market: ${market}`);

    } catch (err) {
      console.error(`❌ Error for ${symbol}:`, err.message);
    }
  }
}

