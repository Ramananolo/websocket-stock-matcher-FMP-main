import fetch from 'node-fetch';

export async function fetchPE(symbol) {
  try {
    const url = `https://financialmodelingprep.com/stable/key-metrics?symbol=${symbol}&apikey=${process.env.FMP_KEY}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Stock-Matcher/1.0"
      }
    });

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error(`FMP response for ${symbol}:`, data);
      return null;
    }

    if (data.length === 0) {
      console.warn(`Empty metrics for ${symbol}`);
      return null;
    }

    const earningsYield = data[0].earningsYield;

    if (!earningsYield || earningsYield <= 0) {
      console.warn(`No earningsYield for ${symbol}`);
      return null;
    }

    return Number((1 / earningsYield).toFixed(2));

  } catch (err) {
    console.error(`FMP fetch error for ${symbol}:`, err.message);
    return null;
  }
}


