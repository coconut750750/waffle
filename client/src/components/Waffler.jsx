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
        this.winners = [];
        this.losers = [];

        this.numPairPerc = 0.5;
        this.numPairDecay = 2.0 / 3.0;
    }

    setInitial(initialData) {
        this.numRestaurants = initialData.length;
        this.unvisited = initialData;
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

    handleSelect(restaurant) {
        this.selectRestaurant(restaurant);
        this.updatePair();
    }

    selectRestaurant(restaurant) {
        var other = this.state.pair[0].id === restaurant.id ? this.state.pair[1] : this.state.pair[0];
        this.winners.push(restaurant);
        this.losers.push(other);
        this.setNewRanks(restaurant, other);
    }

    setNewRanks(selected, unselected) {
        var r1 = selected.rank;
        var r2 = unselected.rank;
        selected.rank += RankingTools.calculateRDelta(r1, 1, RankingTools.calculateP(r1, r2));
        unselected.rank += RankingTools.calculateRDelta(r2, 0, RankingTools.calculateP(r2, r1));
    }

    updatePair() {
        var pair;
        if (this.unvisited.length <= 0) {
            if (this.winners.length === 1) {
                this.displayResults();
                return;
            }
            this.numPairPerc = this.numPairPerc * this.numPairDecay;
            var numRestNeeded = Math.floor(this.numPairPerc * this.numRestaurants) * 2;

            var neededLosers = numRestNeeded - this.winners.length;
            var randomLosers = RestaurantTools.getN(this.losers, neededLosers);
            this.unvisited = this.winners.concat(randomLosers);

            if (this.unvisited.length > 3) {
                pair = RestaurantTools.getPair(RestaurantTools.removeFromList(this.unvisited, this.state.pair));
            } else {
                pair = RestaurantTools.getPair(this.unvisited);
            }

            this.winners = [];
            this.losers = RestaurantTools.removeFromList(this.losers, randomLosers);
        } else {
            pair = RestaurantTools.getPair(this.unvisited);
        }

        this.unvisited = RestaurantTools.removeFromList(this.unvisited, pair);
        this.setState({ pair: pair });
    }

    displayResults() {
        var bestRestaurant = undefined;
        var allRestaurants = this.unvisited.concat(this.winners).concat(this.losers);
        allRestaurants.forEach(function(restaurant) {
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
                    { this.state.pair.map(r => (
                            <div className="col-6 mb-4">
                                <RestaurantCard 
                                    restaurant={r} 
                                    onClick={(restaurant) => this.handleSelect(restaurant)}/>
                            </div>
                        )) }
                </div>
            </div>
        );
    }
}

export default withRouter(Waffler);