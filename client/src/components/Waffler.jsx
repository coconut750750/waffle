import React from 'react';
import { withRouter } from 'react-router'

import Restaurant from '../restaurant.js'
import RestaurantCard from './RestaurantCard.jsx'
import RestaurantTools from '../restaurant_tools.js'
import RankingTools from '../ranking_tools.js'
import { MULTIPLIER } from '../ranking_tools.js'

class Waffler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pair: []
        };
        this.unvisited = [];
        this.visited = [];
        this.removed = [];
        this.rank_threshold = 0;
        this.ranks = {};
    }

    setInitial(initialData) {
        this.unvisited = initialData;
        this.visited = [];
        this.rank_threshold = MULTIPLIER / -2;
        this.ranks = initialData.reduce(function(map, obj) {
                        map[obj.id] = 0;
                        return map;
                    }, {})
        this.updatePair();
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
        this.updatePair();
        this.checkRestaurantRank(other);
        this.checkForWin();
    }

    selectRestaurant(restaurant, reverse=false) {
        var other = this.state.pair[0].id === restaurant.id ? this.state.pair[1] : this.state.pair[0];
        if (!reverse) {
            this.setNewRanks(restaurant, other);
        } else {
            this.setNewRanks(other, restaurant);
        }
        return other;
    }

    setNewRanks(selected, unselected) {
        var r1 = this.ranks[selected.id];
        var r2 = this.ranks[unselected.id];
        this.ranks[selected.id] += RankingTools.calculateRDelta(r1, 1, RankingTools.calculateP(r1, r2));
        this.ranks[unselected.id] += RankingTools.calculateRDelta(r2, 0, RankingTools.calculateP(r2, r1));
    }

    updatePair() {
        var pair;
        if (this.unvisited.length === 0) {
            this.rank_threshold += MULTIPLIER / 2;
            this.unvisited = Array.from(this.visited);
            pair = RestaurantTools.getPair(RestaurantTools.removeFromList(this.unvisited, this.state.pair));
            this.visited = [];
        } else {
            if (this.unvisited.length === 1) {
                pair = [this.unvisited[0], RestaurantTools.getRandom(this.visited)];
            } else {
                pair = RestaurantTools.getPair(this.unvisited);
            }
        }

        this.unvisited = RestaurantTools.removeFromList(this.unvisited, pair);
        this.visited = RestaurantTools.addToList(this.visited, pair);
        this.setState({ pair: pair });
    }

    handleRemove(e, restaurant) {
        e.stopPropagation();
        this.selectRestaurant(restaurant, true)
        this.removeRestaurant(restaurant);
        this.updatePair();
        this.checkForWin();
    }

    removeRestaurant(restaurant) {
        delete this.ranks[restaurant.id];
        this.unvisited = RestaurantTools.removeFromList(Array.from(this.unvisited), [restaurant]);
        this.visited = RestaurantTools.removeFromList(Array.from(this.visited), [restaurant]);
        this.removed = RestaurantTools.addToList(this.removed, [restaurant])
    }

    checkRestaurantRank(restaurant) {
        if (this.ranks[restaurant.id] <= this.rank_threshold) {
            this.removeRestaurant(restaurant);
        }
    }

    checkForWin() {
        if (Object.keys(this.ranks).length < 5) {
            var maxScore = undefined; var maxId = undefined;
            for (var id in this.ranks) {
                if (maxScore === undefined || this.ranks[id] > maxScore) {
                    maxScore = this.ranks[id];
                    maxId = id;
                }
            }
            var allRestaurants = this.visited.concat(this.unvisited);
            var winner = RestaurantTools.getRestaurantById(allRestaurants, maxId);

            this.props.history.push({
                pathname: '/results',
                state: { winner: winner }
            });
        }
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
                            <div className="col-5 mb-4">
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

Waffler = withRouter(Waffler)
export default Waffler