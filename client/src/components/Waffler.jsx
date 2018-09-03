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
        }, function() {
            this.getNewPair();
        });
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

    selectRestaurant(e, restaurant) {
        var other = this.state.pair[0].id === restaurant.id ? this.state.pair[1] : this.state.pair[0];
        
        this.getNewRanks(restaurant.id, other.id);
        this.getNewPair();
    }

    getNewRanks(selectedId, unselectedId) {
        var newRanks = Object.assign({}, this.state.ranks);
        var r1 = newRanks[selectedId];
        var r2 = newRanks[unselectedId];
        newRanks[selectedId] = RankingTools.calculateNewR(r1, 1, RankingTools.calculateP(r1, r2));
        newRanks[unselectedId] = RankingTools.calculateNewR(r2, 0, RankingTools.calculateP(r2, r1));

        this.setState({
            ranks: newRanks,
        });
    }

    getNewPair() {
        var pair;
        if (this.state.unvisited.length === 0) {
            var origPair = this.state.pair;
            var tempVisited = RestaurantTools.removeFromList(Array.from(this.state.visited), origPair);
            this.setState({
                pair: RestaurantTools.getPair(tempVisited),
            });
            return;
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

    removeRestaurant(e, restaurant) {
        e.stopPropagation();
        var newUnvisited = RestaurantTools.removeFromList(Array.from(this.state.unvisited), [restaurant]);
        var newVisited = RestaurantTools.removeFromList(Array.from(this.state.visited), [restaurant]);

        var newRanks = Object.assign({}, this.state.ranks);
        delete newRanks[restaurant.id];

        this.setState({
            unvisited: newUnvisited,
            visited: newVisited,
            ranks: newRanks,
        }, function() {
            this.getNewPair();
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
                                <RestaurantCard 
                                    restaurant={r} 
                                    onClick={(e, restaurant) => this.selectRestaurant(e, restaurant)}
                                    onRemove={(e, restaurant) => this.removeRestaurant(e, restaurant)}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Waffler