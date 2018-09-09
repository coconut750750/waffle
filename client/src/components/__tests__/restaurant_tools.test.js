import RestaurantTools from '../../restaurant_tools.js'
import Restaurant from '../../restaurant.js'

describe('RestaurantTools', () => {
    let restaurants;
    let wrapper;
    let instance;

    beforeEach(() => {
        restaurants = [
            new Restaurant('0', 'Cravings', 4, 3.5, ''),
            new Restaurant('1', 'Potbelly', 2, 4, ''),
            new Restaurant('2', 'Bangkok Thai', 3, 4.5, ''),
            new Restaurant('3', 'McDonalds', 2, 4, ''),
            new Restaurant('4', 'Starbucks', 3, 4.5, ''),
            new Restaurant('5', 'Cold Stone', 3, 4.5, '')
        ];
    });

    it('get random pair', () => {
        var pair = RestaurantTools.getPair(restaurants)
        expect(pair.length).toBe(2);
        expect(pair[0].id).not.toBe(pair[1].id);
    });

    it('get weighted random', () => {
        restaurants = [
            new Restaurant('0', 'Cravings', 4, 3.5, ''),
            new Restaurant('1', 'Potbelly', 2, 4, ''),
        ];
        restaurants[0].rank = 10;
        restaurants[1].rank = 5;
        var totalIters = 100;
        var restOneCount = 0;
        for (var i = 0; i < totalIters; i++) {
            var randomRest = RestaurantTools.getRandom(restaurants);
            if (randomRest.id == restaurants[0].id) {
                restOneCount++;
            }
        }
        expect(restOneCount).toBeGreaterThan(totalIters / 2);
    });

    it('remove restaurant', () => {
        var toRemove = restaurants[0];
        var newRests = RestaurantTools.removeFromList(restaurants, [toRemove]);
        expect(newRests.indexOf(toRemove)).toBe(-1);
    });

    it('remove restaurant id', () => {
        var toRemoveId = restaurants[0].id;
        var newRests = RestaurantTools.removeIdsFromList(restaurants, [toRemoveId]);
        expect(newRests[0].id).not.toBe(toRemoveId);
    });

    it('get restaurant by id', () => {
        var expected = restaurants[0];
        var actual = RestaurantTools.getRestaurantById(restaurants, expected.id);
        expect(actual.id).toBe(expected.id)
    });

    it('get undefined restaurant by id', () => {
        var actual = RestaurantTools.getRestaurantById(restaurants, '-1');
        expect(actual).toBe(undefined)
    });
});