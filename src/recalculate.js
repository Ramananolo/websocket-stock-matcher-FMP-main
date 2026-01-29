import { cache } from "./cache.js";
import { computeScore, computePercents } from "./score.js";

export function recalculateAllScores() {
    for (const [symbol, data] of cache.entries()) {
        const score = computeScore({
            price: data.price,
            prevClose: data.prevClose,
            week: data.week,
            month: data.month,
            pe: data.pe
        });

        const { intraday, percWeek, percMonth } = computePercents({
            price: data.price,
            prevClose: data.prevClose,
            week: data.week,
            month: data.month
        });

        cache.set(symbol, {
            ...data,
            score,
            intraday,
            percWeek,
            percMonth
        });
    }

    console.log("⚡ Local score recalculation done");
}
