class RankingTools {
    static calculateP(r1, r2) {
        return 1.0 / (1.0 + Math.pow(10, ((r2 - r1) / 400)));
    }

    static calculateNewR(r, actual, expected) {
        return r + 30 * (actual - expected);
    }
}

export default RankingTools