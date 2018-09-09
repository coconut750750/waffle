import React from 'react';
import { withRouter } from 'react-router'

import Restaurant from '../restaurant.js'
import RestaurantCard from './RestaurantCard.jsx'
import RestaurantTools from '../restaurant_tools.js'
import RankingTools from '../ranking_tools.js'

class Waffler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pair: [],
        };
        this.numRestaurants = 0;
        this.unvisited = [];
        this.visited = [];
        this.removed = [];
        this.numPairPerc = 0.5;
        this.numPairDecay = 0.75;
        this.curPair = 0;
    }

    setInitial(initialData) {
        this.numRestaurants = initialData.length;
        this.unvisited = initialData;
        this.visited = [];
        this.updatePair();
    }

    componentDidMount() {
        if (this.props.city !== undefined) {
            this.requestApi(`city=${this.props.city}`);
        } else {
            var coords = this.props.coords;
            this.requestApi(`lat=${coords.latitude}&long=${coords.longitude}`);
        }
    }

    requestApi(query) {
        this.callApi(query).then(res => {
            var restData = this.transformData(res.data);
            this.setInitial(restData);
            }).catch(err => console.log(err));
    }

    async callApi(query) {
        var response = await fetch(`/api/yelp?${query}`);
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

    handleSelect(e, restaurant) {
        this.selectRestaurant(restaurant);
        this.updatePair();
    }

    selectRestaurant(restaurant, reverse=false) {
        var other = this.state.pair[0].id === restaurant.id ? this.state.pair[1] : this.state.pair[0];
        if (!reverse) {
            this.setNewRanks(restaurant, other);
        } else {
            this.setNewRanks(other, restaurant);
        }
    }

    setNewRanks(selected, unselected) {
        var r1 = selected.rank;
        var r2 = unselected.rank;
        selected.rank += RankingTools.calculateRDelta(r1, 1, RankingTools.calculateP(r1, r2));
        unselected.rank += RankingTools.calculateRDelta(r2, 0, RankingTools.calculateP(r2, r1));
    }

    updatePair() {
        var pair;
        if (this.curPair === Math.floor(this.numPairPerc * this.numRestaurants)) {
            this.unvisited = this.unvisited.concat(this.visited);
            pair = RestaurantTools.getPair(RestaurantTools.removeFromList(this.unvisited, this.state.pair));
            this.visited = [];
            this.numPairPerc = this.numPairPerc * this.numPairDecay;
            this.curPair = 1;
            if (Math.floor(this.numPairPerc * this.numRestaurants) === 0) {
                this.getResults();
                return;
            }
        } else {
            this.curPair++;
            pair = RestaurantTools.getPair(this.unvisited);
        }
        console.log(pair[0].rank + " " + pair[1].rank);

        this.unvisited = RestaurantTools.removeFromList(this.unvisited, pair);
        this.visited = RestaurantTools.addToList(this.visited, pair);
        this.setState({ pair: pair });
    }

    handleRemove(e, restaurant) {
        e.stopPropagation();
        this.selectRestaurant(restaurant, true)
        this.removeRestaurant(restaurant);
        this.updatePair();
    }

    removeRestaurant(restaurant) {
        this.numRestaurants--;
        this.unvisited = RestaurantTools.removeFromList(Array.from(this.unvisited), [restaurant]);
        this.visited = RestaurantTools.removeFromList(Array.from(this.visited), [restaurant]);
        this.removed = RestaurantTools.addToList(this.removed, [restaurant]);
    }

    getResults() {
        var bestRestaurant = undefined;
        var allRestaurants = this.visited.concat(this.unvisited);
        allRestaurants.forEach(function(restaurant) {
            console.log("final: " + restaurant.rank);
            if (bestRestaurant === undefined || restaurant.rank > bestRestaurant.rank) {
                bestRestaurant = restaurant;
            }
        });

        this.props.history.push({
            pathname: '/results',
            state: { winner: bestRestaurant }
        });
    }

    render() {
        return (
            <div id="waffler" className="container-fluid">
                <div className="row justify-content-center mb-4">
                    <h4>Choose One!</h4>
                </div>
                <div className="row justify-content-center">
                    {
                        this.state.pair.map(r => (
                            <div className="col-6 mb-4">
                                <RestaurantCard 
                                    restaurant={r} 
                                    onClick={(e, restaurant) => this.handleSelect(e, restaurant)}
                                    onRemove={(e, restaurant) => this.handleRemove(e, restaurant)}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(Waffler);