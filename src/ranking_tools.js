export const MULTIPLIER = 500;

class RankingTools {
    static calculateP(r1, r2) {
        return 1.0 / (1.0 + Math.pow(10, ((r2 - r1) / 400)));
    }

    static calculateRDelta(r, actual, expected) {
        return Math.round(MULTIPLIER * (actual - expected));
    }
}

export default RankingTools