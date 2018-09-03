import React from 'react';

import '../css/restaurant_card.css'

class RestaurantCard extends React.Component {
    render() {
        return (
            <div class="rest-card card border-light mb-4 shadow" onClick={(e) => this.props.onClick(e, this.props.restaurant)}>
                <img class="card-img-top" src={ this.props.restaurant.image_url } alt="restaurant"/>

                <div class="card-body">
                    <h5 class="card-title mb-2">{ this.props.restaurant.name }</h5>
                    <div class="row">
                        <h6 class="col-auto card-subtitle text-muted">{ this.props.restaurant.rating }</h6>
                        <h6 class="col-auto card-subtitle text-muted">{ this.props.restaurant.price }</h6>
                        <div class="col">
                            <button type="button" class="btn btn-danger float-right"
                            onClick={(e) => this.props.onRemove(e, this.props.restaurant)}>Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RestaurantCard