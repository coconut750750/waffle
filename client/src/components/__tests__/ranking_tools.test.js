import RankingTools from '../../ranking_tools.js'

describe('RankingTools', () => {
  it('simple ranking', () => {
    var r1 = 0; var r2 = 0;

    var p1 = RankingTools.calculateP(r1, r2);
    var p2 = RankingTools.calculateP(r2, r1);

    var r1 = RankingTools.calculateNewR(r1, 1, p1);
    var r2 = RankingTools.calculateNewR(r2, 0, p2);

    expect(p1).toBe(p2);
    expect(r1).toBeGreaterThan(r2);
  });
});