import React from 'react'

import Waffler from './Waffler.jsx'

class Start extends React.Component {
    render() {
        return (
          <div>
            <Waffler query={ this.props.location.state.query }/>
          </div>
        );
    }
}

export default Start
