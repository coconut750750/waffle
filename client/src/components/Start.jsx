import React from 'react'
import {geolocated} from 'react-geolocated';

import Waffler from './Waffler.jsx'

class Start extends React.Component {
    render() {
        var coords = this.props.coords;
        var locationQuery = this.props.location.state.query;
        if (coords !== null) {
            return (
              <div>
                <Waffler coords={ coords }/>
              </div>
            );
        } else if (locationQuery !== "") {
            return (
              <div>
                <Waffler city={ locationQuery }/>
              </div>
            );
        } else {
            return (
                <div>
                    <div className="row justify-content-center mb-4">
                        <h4>Searching for location</h4>
                    </div>
                </div>
            );
        }
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
        userDecisionTimeout: 5000,
    })(Start);
