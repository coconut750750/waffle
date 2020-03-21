import React from 'react'
import Geolocation from 'react-geolocation'

import Waffler from './Waffler.jsx'

class Start extends React.Component {
    render() {
        var locationQuery = this.props.location.state.query;
        return (
            <div>
                {locationQuery === "" ? (
                    <Geolocation
                        render={({
                            fetchingPosition,
                            position: { coords: { latitude, longitude } = {} } = {},
                            error,
                            getCurrentPosition
                          }) =>
                            <div onLoad={getCurrentPosition}>
                                {error && <div>{error.message}</div>}
                                {latitude ? (
                                    <Waffler coords={ {latitude: latitude, longitude: longitude} }/>
                                    ) : (
                                    <div className="row justify-content-center mb-4">
                                        <h4>Searching for location...</h4>
                                    </div>
                                )}
                            </div>
                        }
                    />
                ) : (
                    <Waffler city={ locationQuery }/>
                )}
            </div>
        );
    }
}

export default Start;
