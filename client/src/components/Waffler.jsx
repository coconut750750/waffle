import React from 'react';

import Restaurant from '../restaurant.js'
import RestaurantCard from './RestaurantCard.jsx'
import RestaurantTools from '../restaurant_tools.js'
import RankingTools from '../ranking_tools.js'

class Waffler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unvisited: [],
            visited: [],
            removed: [],
            pair: [],
            ranks: {},
        };
    }

    setInitial(initialData) {
        this.setState({
            unvisited: initialData,
            visited: [],
            ranks: initialData.reduce(function(map, obj) {
                        map[obj.id] = 0;
                        return map;
                    }, {}),
        });
        this.setNewPair(this.getNewPair());
    }

    componentDidMount() {
        this.callApi().then(res => {
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

    handleSelect(e, restaurant) {
        var other = this.selectRestaurant(restaurant);
        this.setNewPair(this.getNewPair());
        this.checkRestaurantRank(other);
    }

    selectRestaurant(restaurant) {
        var other = this.state.pair[0].id === restaurant.id ? this.state.pair[1] : this.state.pair[0];
        this.getNewRanks(restaurant, other);
        return other;
    }

    getNewRanks(selected, unselected) {
        var newRanks = Object.assign({}, this.state.ranks);
        var r1 = newRanks[selected.id];
        var r2 = newRanks[unselected.id];
        newRanks[selected.id] = RankingTools.calculateNewR(r1, 1, RankingTools.calculateP(r1, r2));
        newRanks[unselected.id] = RankingTools.calculateNewR(r2, 0, RankingTools.calculateP(r2, r1));

        this.setState({ranks: newRanks});
    }

    getNewPair() {
        if (this.state.unvisited.length === 0) {
            var origPair = this.state.pair;
            var tempVisited = Array.from(this.state.visited);
            if (this.state.visited.length > 4) {
                tempVisited = RestaurantTools.removeFromList(tempVisited, origPair);
            }
            return RestaurantTools.getPair(tempVisited);
        } else if (this.state.unvisited.length === 1) {
            return [this.state.unvisited[0], RestaurantTools.getRandom(this.state.visited)];
        } else {
            return RestaurantTools.getPair(this.state.unvisited);
        }
    }

    setNewPair(pair) {
        this.setState((prevState) => {
            return {
                pair: pair,
                unvisited: this.getNewUnvisited(prevState, pair),
                visited: this.getNewVisited(prevState, pair),
            }
        });
    }

    getNewUnvisited(state, visitedList) {
        var newUnvisited = Array.from(state.unvisited);
        for (var i = newUnvisited.length - 1; i >= 0; i--) {
            if (visitedList.indexOf(newUnvisited[i]) !== -1) {
                newUnvisited.splice(i, 1);
            }
        }
        return newUnvisited;
    }

    getNewVisited(state, visitedList) {
        var newVisited = Array.from(state.visited);
        for (var i = visitedList.length - 1; i >= 0; i--) {
            if (newVisited.indexOf(visitedList[i]) === -1) {
                newVisited.push(visitedList[i]);
            }
        }
        return newVisited
    }

    handleRemove(e, restaurant) {
        e.stopPropagation();
        this.removeRestaurant(restaurant);
        var pair = this.getNewPair();
        this.setNewPair(pair);
    }

    removeRestaurant(restaurant) {
        this.setState((prevState) => {
            var newUnvisited = RestaurantTools.removeFromList(Array.from(prevState.unvisited), [restaurant]);
            var newVisited = RestaurantTools.removeFromList(Array.from(prevState.visited), [restaurant]);

            var newRanks = Object.assign({}, prevState.ranks);
            delete newRanks[restaurant.id];

            var newRemoved = Array.from(prevState.removed);
            if (newRemoved.indexOf(restaurant) === -1) {
                newRemoved.push(restaurant);
            }

            return {
                unvisited: newUnvisited,
                visited: newVisited,
                removed: newRemoved,
                ranks: newRanks
            }
        });
    }

    checkRestaurantRank(restaurant) {
        this.setState((prevState) => {
            if (RankingTools.rankIsTooLow(prevState.ranks[restaurant.id])) {
                this.removeRestaurant(restaurant);
            }
            return {};
        });
    }

    checkComplete() {
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

export default Waffler