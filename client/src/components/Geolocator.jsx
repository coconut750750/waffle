import React from 'react';
import Geolocation from 'react-geolocation'

class Geolocator extends React.Component {
  render() {
    return (
        <Geolocation
          render={({
            fetchingPosition,
            position: { coords: { latitude, longitude } = {} } = {},
            error,
            getCurrentPosition
          }) =>
            <div>
              <button onClick={getCurrentPosition}>Get Position</button>
              {error &&
                <div>
                  {error.message}
                </div>}
              <pre>
                latitude: {latitude}
                longitude: {longitude}
              </pre>
            </div>}
        />
    );
  }
}

export default Geolocator;