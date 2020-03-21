import React from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router';

import Search from './Search.jsx'
import '../css/home.css'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            redirect: false
        };
    }

    updateQuery(e) {
        this.setState({
            query: e.target.value
        });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={{ pathname: '/start',
                                        state: { query: this.state.query }
                                        }}/>;
        }
        return (
            <div id="home" className="container-fluid back-image">
                <div className="row justify-content-center mb-4">
                    <div className="col text-center">
                        <Link to='/'><img style={{width: '30%'}} src="/static/waffle_logo.png" alt="logo"/></Link>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-6 text-center">
                        <Search updateQuery={(e) => this.updateQuery(e)}
                                onEnter={() => this.setState({redirect: true})}/>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-4 text-center">
                        <Link to={{
                            pathname: '/start',
                            state: { query: this.state.query }
                        }}>
                            <button type="submit" id="start" className="btn btn-primary btn-lg">Start</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;