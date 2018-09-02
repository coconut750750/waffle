import RestaurantTools from '../../restaurant_tools'

describe('RestaurantTools', () => {
  it('get random pair', () => {
    var tools = new RestaurantTools();
    var restaurants = ['mcdees', 'potbelly', 'pizza hut', 'bangkok thai'];
    var pair = tools.getPair(restaurants)
    expect(pair.length).toBe(2);
    expect(pair[0]).not.toBe(pair[1]);
  });
});