import React from 'react';

import '../css/results.css'

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            winner: props.location.state.winner,
        };
    }
    render() {
        console.log(this.state);
        return (
            <div>
                { this.state.winner.name }
            </div>
        );
    }
}

export default Results