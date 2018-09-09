function getRankSum(restaurants) {
    var rankSum = 0;
    restaurants.forEach(function(restaurant) {
        rankSum += restaurant.rank;
    });
    return rankSum;
}

function getIndexAtRankSum(restaurants, rankSum) {
    var curRankSum = 0;
    for (var i = 0; i < restaurants.length; i++) {
        curRankSum += restaurants[i].rank;
        if (curRankSum >= rankSum) {
            return i;
        }
    }
}

function getWeightedRandom(restaurants, n) {
    if (n > restaurants.length) {
        throw new RangeError("getRandom(): more elements taken than available");
    }

    var result = [];
    var untaken = Array.from(restaurants);

    while (n--) {
        var rankSum = getRankSum(untaken);
        var x = Math.floor(Math.random() * rankSum);
        var index = getIndexAtRankSum(untaken, x);
        result.push(untaken[index]);
        untaken.splice(index, 1);
    }

    return result;
}

class RestaurantTools {
    static addToList(list, restaurantsToAdd) {
        list = Array.from(list);
        for (var i = restaurantsToAdd.length - 1; i >= 0; i--) {
            if (list.indexOf(restaurantsToAdd[i]) === -1) {
                list.push(restaurantsToAdd[i]);
            }
        }
        return list;
    }

    static removeFromList(list, restaurantsToRemove) {
        list = Array.from(list);
        for (var i = restaurantsToRemove.length - 1; i >= 0; i--) {
            var index = list.indexOf(restaurantsToRemove[i]);
            if (index > -1) {
                list.splice(index, 1);
            }
        }
        return list;
    }

    static getRestaurantById(list, id) {
        for (var i = list.length - 1; i >= 0; i--) {
            if (list[i].id === id) {
                return list[i];
            }
        }
        return undefined;
    }

    static removeIdsFromList(list, idsToRemove) {
        list = Array.from(list);
        for (var i = list.length - 1; i >= 0; i--) {
            var index = idsToRemove.indexOf(list[i].id);
            if (index > -1) {
                list.splice(i, 1);
            }
        }
        return list;
    }

    static getPair(restaurants) {
        return getWeightedRandom(restaurants, 2);
    }

    static getRandom(restaurants) {
        return getWeightedRandom(restaurants, 1)[0];
    }
}

export default RestaurantTools