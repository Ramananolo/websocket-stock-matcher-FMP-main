export function computeScore({ price, prevClose, week, month, pe }) {
  let score = 0;

  // Critère Intraday : plus forte baisse aujourd'hui (>10%)
  if (prevClose && price && ((price - prevClose) / prevClose) <= -0.10) score++;

  // Critère semaine : baisse >10% sur 5 jours
  if (week && price && ((price - week) / week) <= -0.10) score++;

  // Critère mois : baisse >10% sur 21 jours
  if (month && price && ((price - month) / month) <= -0.10) score++;

  // Critère P/E < 14
  if (pe && pe < 14) score++;

  return score;
}

export function computePercents({ price, prevClose, week, month }) {
  const intraday = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;
  const percWeek = week ? ((price - week) / week) * 100 : 0;
  const percMonth = month ? ((price - month) / month) * 100 : 0;
  return { intraday, percWeek, percMonth };
}
