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
            unvisited: [],
            visited: [],
            pair: [],
            ranks: {},
        };
    }

    setInitial(initialData) {
        this.setState({
            restaurants: initialData,
            unvisited: Array.apply(null, {length: initialData.length}).map(Number.call, Number),
            visited: [],
            ranks: initialData.reduce(function(map, obj) {
                        map[obj.id] = 0;
                        return map;
                    }, {}),
        });
        this.getNewPair();
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

    selectRestaurant(index) {
        var otherIndex = this.state.pair[0] === index ? this.state.pair[1] : this.state.pair[0];
        var restaurant = this.state.restaurants[index];
        var otherRest = this.state.restaurants[otherIndex];
        var newRanks = Object.assign({}, this.state.ranks);
        
        var r1 = newRanks[restaurant.id];
        var r2 = newRanks[otherRest.id];
        newRanks[restaurant.id] = RankingTools.calculateNewR(r1, 1, RankingTools.calculateP(r1, r2));
        newRanks[otherRest.id] = RankingTools.calculateNewR(r2, 0, RankingTools.calculateP(r2, r1));

        this.setState({
            restaurants: this.state.restaurants,
            ranks: newRanks,
        });
        this.getNewPair();
    }

    getNewPair() {
        var pair;
        if (this.state.unvisited.length === 0) {
            var origPair = this.state.pair;
            var tempVisited = Array.from(this.state.visited);
            tempVisited.splice(tempVisited.indexOf(origPair[0]), 1);
            tempVisited.splice(tempVisited.indexOf(origPair[1]), 1);
            pair = RestaurantTools.getPair(tempVisited);
        } else if (this.state.unvisited.length === 1) {
            pair = [this.state.unvisited[0], RestaurantTools.getRandom(this.state.visited)];
        } else {
            pair = RestaurantTools.getPair(this.state.unvisited);
        }
        this.setState({
            pair: pair,
            unvisited: this.getNewUnvisited(pair),
            visited: this.getNewVisited(pair),
        });
    }

    getNewUnvisited(visitedList) {
        var newUnvisited = Array.from(this.state.unvisited);
        for (var i = newUnvisited.length - 1; i >= 0; i--) {
            if (visitedList.indexOf(newUnvisited[i]) !== -1) {
                newUnvisited.splice(i, 1);
            }
        }
        return newUnvisited;
    }

    getNewVisited(visitedList) {
        var newVisited = Array.from(this.state.visited);
        for (var i = visitedList.length - 1; i >= 0; i--) {
            if (newVisited.indexOf(visitedList[i]) === -1) {
                newVisited.push(visitedList[i]);
            }
        }
        return newVisited
    }

    render() {
        console.log(this.state);
        return (
            <div id="waffler" class="container-fluid">
                <div class="row justify-content-center">
                    {
                        this.state.pair.map(r => (
                            <div class="col-5 mb-4">
                                <RestaurantCard 
                                    restaurant={this.state.restaurants[r]} 
                                    pos={r} 
                                    onClick={(rIndex) => this.selectRestaurant(rIndex)}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Waffler