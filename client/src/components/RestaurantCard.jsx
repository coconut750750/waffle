import React from 'react';

import '../css/restaurant_card.css'

class RestaurantCard extends React.Component {
    render() {
        return (
            <div class="rest-card card border-light mb-4 shadow" onClick={() => this.props.onClick(this.props.pos)}>
                <img class="card-img-top" src={ this.props.restaurant.image_url } alt="restaurant"/>
                <div class="card-body">
                    <h5 class="card-title mb-2">{ this.props.restaurant.name }</h5>
                    <div class="row">
                        <h6 class="col-2 card-subtitle mb-2 text-muted">{  this.props.restaurant.rating }</h6>
                        <h6 class="col-2 card-subtitle mb-2 text-muted">{  this.props.restaurant.price }</h6>
                    </div>
                </div>
            </div>
        );
    }
}

export default RestaurantCard