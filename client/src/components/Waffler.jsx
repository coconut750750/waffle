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
            num_restaurants: 0,
            unvisited: [],
            visited: [],
            removed: [],
            pair: [],
            ranks: {},
            rank_threshold: 0,
        };
    }

    setInitial(initialData) {
        this.setState({
            num_restaurants: initialData.length,
            unvisited: initialData,
            visited: [],
            ranks: initialData.reduce(function(map, obj) {
                        map[obj.id] = 0;
                        return map;
                    }, {}),
            rank_threshold: MULTIPLIER / -2,            
        });
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

    updatePair() {
        this.setState((prevState) => {
            var pair, prevUnvisited, prevVisited;
            if (prevState.unvisited.length === 0) {
                prevUnvisited = Array.from(prevState.visited);
                prevVisited = [];
                pair = RestaurantTools.getPair(RestaurantTools.removeFromList(prevUnvisited, prevState.pair));
            } else {
                if (prevState.unvisited.length === 1) {
                    pair = [prevState.unvisited[0], RestaurantTools.getRandom(prevState.visited)];
                } else {
                    pair = RestaurantTools.getPair(prevState.unvisited);
                }
                prevUnvisited = prevState.unvisited;
                prevVisited = prevState.visited;
            }
            
            return {
                pair: pair,
                unvisited: RestaurantTools.removeFromList(prevUnvisited, pair),
                visited: RestaurantTools.addToList(prevVisited, pair),
            }
        });
    }

    handleRemove(e, restaurant) {
        e.stopPropagation();
        this.removeRestaurant(restaurant);
        this.updatePair();
    }

    removeRestaurant(restaurant) {
        this.setState((prevState) => {
            var newRanks = Object.assign({}, prevState.ranks);
            delete newRanks[restaurant.id];

            return {
                num_restaurants: prevState.num_restaurants - 1,
                unvisited: RestaurantTools.removeFromList(Array.from(prevState.unvisited), [restaurant]),
                visited: RestaurantTools.removeFromList(Array.from(prevState.visited), [restaurant]),
                removed: RestaurantTools.addToList(prevState.removed, [restaurant]),
                ranks: newRanks
            }
        });
    }

    checkRestaurantRank(restaurant) {
        this.setState((prevState) => {
            if (prevState.ranks[restaurant.id] < prevState.rank_threshold) {
                this.removeRestaurant(restaurant);
                return {
                    rank_threshold: prevState.rank_threshold + MULTIPLIER / 10,
                };
            }
            return {};
        });
    }

    checkForWin() {
        this.setState((prevState) => {
            if (prevState.num_restaurants < 5) {
                var maxScore = undefined; var maxId = undefined;
                for (var id in prevState.ranks) {
                    if (maxScore === undefined || prevState.ranks[id] > maxScore) {
                        maxScore = prevState.ranks[id];
                        maxId = id;
                    }
                }
                var allRestaurants = prevState.visited.concat(prevState.unvisited);
                var winner = RestaurantTools.getRestaurantById(allRestaurants, maxId);

                this.props.history.push({
                    pathname: '/results',
                    state: { winner: winner }
                });
            }
            return {};
        });
    }

    render() {
        console.log(this.state);
        return (
            <div id="waffler" className="container-fluid">
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