import React from 'react'
import { Link } from 'react-router-dom'

import Geolocator from './Geolocator.jsx'
import Search from './Search.jsx'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
        };
    }

    updateQuery(e) {
        this.setState({
            query: e.target.value
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <Geolocator />
                <div className="row justify-content-center">
                    <div className="col-4 text-center">
                        <Search updateQuery={(e) => this.updateQuery(e)}/>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-4 text-center">
                        <Link to={{
                            pathname: '/start',
                            state: { query: this.state.query }
                        }}><button type="button" className="btn btn-primary">Start</button></Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;