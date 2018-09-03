import React from 'react';

import Restaurant from '../restaurant'
import RestaurantCard from './RestaurantCard.jsx'
import RestaurantTools from '../restaurant_tools.js'

class Waffler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurants: [],
            pair: [],
            scores: {},
        };
    }

    setInitial(initialData) {
        this.setState({
            restaurants: initialData,
            pair: RestaurantTools.getPair(initialData),
            scores: initialData.reduce(function(map, obj) {
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
        var newScores = Object.assign({}, this.state.scores);
        newScores[restaurant.id] += 1;
        this.setState({
            restaurants: this.state.restaurants,
            pair: RestaurantTools.getPair(this.state.restaurants),
            scores: newScores,
        });
    }

    removeRestaurant(restaurant) {
        var newRestaurants = Array.from(this.state.restaurants);
        var index = newRestaurants.indexOf(restaurant);
        newRestaurants.splice(index, 1);

        var newScores = Object.assign({}, this.state.scores);
        delete newScores[restaurant.id];

        this.setState({
            restaurants: newRestaurants,
            pair: RestaurantTools.getPair(newRestaurants),
            scores: newScores,
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