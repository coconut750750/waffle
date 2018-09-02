import React from 'react';

import Restaurant from '../restaurant'
import RestaurantCard from './RestaurantCard.jsx'

class Waffler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurants: [],
            scores: {},
        };
    }

    componentDidMount() {
        this.callApi().then(res => {
            var restData = this.transformData(res.data);
            this.setState({
                restaurants: restData,
                scores: res.data.reduce(function(map, obj) {
                            map[obj.id] = 0;
                            return map;
                        }, {}),
            });
            }).catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/yelp');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    transformData(jsonData) {
        var reducedData = []
        jsonData.forEach(function(restaurant) {
            reducedData.push(new Restaurant(restaurant.id, restaurant.name, restaurant.price, restaurant.rating));
        });
        return reducedData;
    }

    handleClick(restaurant) {
        var newScores = Object.assign({}, this.state.scores);
        newScores[restaurant.id] += 1;
        this.setState({
            restaurants: this.state.restaurants,
            scores: newScores,
        });
    }

    render() {
        return (
            <div id="waffler" class="container-fluid">
                <div class="row justify-content-center">
                    {
                        this.state.restaurants.map(r => (
                            <div class="col-5">
                                <RestaurantCard restaurant={r} onClick={(rName) => this.handleClick(rName)}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Waffler