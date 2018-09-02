import React from 'react';

import '../css/restaurant_card.css'

class RestaurantCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurant : props.restaurant,
        };
    }

    render() {
        return (
            <div class="card border-light mb-4 shadow-md" onClick={() => this.props.onClick(this.state.restaurant)}>
                <img class="card-img-top" src="/images/restaurant.jpg" alt="restaurant"/>
                <div class="card-body">
                    <h5 class="card-title mb-2">{ this.state.restaurant.name }</h5>
                </div>
            </div>
        );
    }
}

export default RestaurantCard