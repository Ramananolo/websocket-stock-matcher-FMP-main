// src/cache.js
export const cache = new Map();

export function initCache() {
  cache.clear();
  cache.filters = {
    volumeMin: parseInt(process.env.VOLUME_MIN) || 0,
    priceMin: parseFloat(process.env.PRICE_MIN) || 0,
    peMax: parseFloat(process.env.PE_MAX) || 100,
  };
}
