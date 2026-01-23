// src/cache.js
export const cache = new Map();

// Matching config modifiable depuis front-end
export const matchingConfig = {
  intradayDrop: -10,
  weekDrop: -10,
  monthDrop: -10,
  peMax: 14,
};

export function initCache() {
  cache.clear();
  cache.filters = {
    volumeMin: parseInt(process.env.VOLUME_MIN) || 0,
    priceMin: parseFloat(process.env.PRICE_MIN) || 0,
    peMax: matchingConfig.peMax,
  };
  console.log('⚡ Initial matching config:', matchingConfig);
}
