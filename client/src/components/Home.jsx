import React from 'react'
import { Link } from 'react-router-dom'

import Search from './Search.jsx'
import '../css/home.css'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: ""
        };
    }

    updateQuery(e) {
        this.setState({
            query: e.target.value
        });
    }

    render() {
        return (
            <div id="home" className="container-fluid back-image">
                <div className="row justify-content-center mb-4">
                    <div className="col text-center">
                        <Link to='/' id='logo'><h3>Waffle</h3></Link>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-8 text-center">
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