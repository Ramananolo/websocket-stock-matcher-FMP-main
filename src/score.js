import { matchingConfig } from "./cache.js";

export function computeScore({ price, prevClose, week, month, pe }) {
  let score = 0;

  // Conversion % → ratio
  const intradayLimit = matchingConfig.intradayDrop / 100;
  const weekLimit = matchingConfig.weekDrop / 100;
  const monthLimit = matchingConfig.monthDrop / 100;

  // Critère Intraday
  if (
    prevClose &&
    price &&
    ((price - prevClose) / prevClose) <= intradayLimit
  ) {
    score++;
  }

  // Critère semaine
  if (
    week &&
    price &&
    ((price - week) / week) <= weekLimit
  ) {
    score++;
  }

  // Critère mois
  if (
    month &&
    price &&
    ((price - month) / month) <= monthLimit
  ) {
    score++;
  }

  // Critère P/E
  if (pe && pe <= matchingConfig.peMax) {
    score++;
  }

  return score;
}

export function computePercents({ price, prevClose, week, month }) {
  const intraday = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;
  const percWeek = week ? ((price - week) / week) * 100 : 0;
  const percMonth = month ? ((price - month) / month) * 100 : 0;
  return { intraday, percWeek, percMonth };
}
