import React from 'react'
import { Link } from 'react-router-dom'

import Search from './Search.jsx'

class Home extends React.Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-4 text-center">
                        <Link to='/start'><button type="button" className="btn btn-primary">Start</button></Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home
