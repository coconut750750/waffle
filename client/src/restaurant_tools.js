/*
Taken from: https://stackoverflow.com/questions/19269545/how-to-get-n-no-elements-randomly-from-an-array
*/
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

class RestaurantTools {
    static removeFromList(list, restaurantsToRemove) {
        for (var i = restaurantsToRemove.length - 1; i >= 0; i--) {
            var index = list.indexOf(restaurantsToRemove[i]);
            if (index > -1) {
                list.splice(index, 1);
            }
        }
        return list;
    }

    static getPair(restaurants) {
        return getRandom(restaurants, 2);
    }

    static getRandom(restaurants) {
        return getRandom(restaurants, 1);
    }
}

export default RestaurantTools