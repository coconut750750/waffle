import React from 'react';
import RestaurantCard from './RestaurantCard.jsx'

import '../css/results.css'

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            winner: props.location.state.winner,
        };
    }
    render() {
        return (
            <div id="results" className="container-fluid">
                <div className="row justify-content-center mb-4">
                    <h4>Winner!</h4>
                </div>
                <div className="row justify-content-center">
                    <div className="col-6 mb-4">
                        <RestaurantCard restaurant={this.state.winner}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Results