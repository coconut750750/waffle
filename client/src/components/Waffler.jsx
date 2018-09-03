import React from 'react';

import Restaurant from '../restaurant.js'
import RestaurantCard from './RestaurantCard.jsx'
import RestaurantTools from '../restaurant_tools.js'
import RankingTools from '../ranking_tools.js'

class Waffler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurants: [],
            pair: [],
            ranks: {},
        };
    }

    setInitial(initialData) {
        this.setState({
            restaurants: initialData,
            pair: RestaurantTools.getPair(initialData),
            ranks: initialData.reduce(function(map, obj) {
                        map[obj.id] = 0;
                        return map;
                    }, {}),
        });
    }

    componentDidMount() {
        this.callApi().then(res => {
            console.log(res.data);
            var restData = this.transformData(res.data);
            this.setInitial(restData);
            }).catch(err => console.log(err));
    }

    async callApi() {
        const response = await fetch('/api/yelp');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    transformData(jsonData) {
        var reducedData = []
        jsonData.forEach(function(restaurant) {
            reducedData.push(new Restaurant(restaurant.id, restaurant.name, restaurant.price,
                                            restaurant.rating, restaurant.image_url));
        });
        return reducedData;
    }

    selectRestaurant(restaurant) {
        var otherRest = this.state.pair[0].id != restaurant.id ? this.state.pair[0] : this.state.pair[1];
        var newRanks = Object.assign({}, this.state.ranks);

        var r1 = newRanks[restaurant.id];
        var r2 = newRanks[otherRest.id];
        var r1 = RankingTools.calculateNewR(r1, 1, RankingTools.calculateP(r1, r2));
        var r2 = RankingTools.calculateNewR(r2, 0, RankingTools.calculateP(r2, r1));

        newRanks[restaurant.id] = r1;
        newRanks[otherRest.id] = r2

        this.setState({
            restaurants: this.state.restaurants,
            pair: RestaurantTools.getPair(this.state.restaurants),
            ranks: newRanks,
        });
    }

    removeRestaurant(restaurant) {
        var newRestaurants = Array.from(this.state.restaurants);
        var index = newRestaurants.indexOf(restaurant);
        newRestaurants.splice(index, 1);

        var newRanks = Object.assign({}, this.state.ranks);
        delete newRanks[restaurant.id];

        this.setState({
            restaurants: newRestaurants,
            pair: RestaurantTools.getPair(newRestaurants),
            ranks: newRanks,
        });
    }

    render() {
        console.log(this.state);
        return (
            <div id="waffler" class="container-fluid">
                <div class="row justify-content-center">
                    {
                        this.state.pair.map(r => (
                            <div class="col-5 mb-4">
                                <RestaurantCard restaurant={r} onClick={(rData) => this.selectRestaurant(rData)}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Waffler