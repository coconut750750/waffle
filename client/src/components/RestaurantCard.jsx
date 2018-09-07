import React from 'react';

import '../css/restaurant_card.css'

class RestaurantCard extends React.Component {
    render() {
        return (
            <div className="rest-card card border-light mb-4" 
                onClick={this.props.onClick ? (e) => this.props.onClick(e, this.props.restaurant) : null}>
                <img className="card-img-top" src={ this.props.restaurant.image_url } alt="restaurant"/>

                <div className="card-body">
                    <h5 className="card-title mb-2">{ this.props.restaurant.name }</h5>
                    <div className="row">
                        <h6 className="col-auto card-subtitle text-muted">{ this.props.restaurant.rating }</h6>
                        <h6 className="col-auto card-subtitle text-muted">{ this.props.restaurant.price }</h6>
                        {this.props.onRemove ? 
                            <div className="col">
                                <button type="button" className="btn btn-danger float-right"
                                onClick={(e) => this.props.onRemove(e, this.props.restaurant)}>Remove</button>
                            </div> : <div/>
                        }
                        
                    </div>
                </div>
            </div>
        );
    }
}

export default RestaurantCard