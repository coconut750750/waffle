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
    static getPair(restaurants) {
        return getRandom(restaurants, 2);
    }
}

export default RestaurantTools