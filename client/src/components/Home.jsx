import React from 'react'
import { Link } from 'react-router-dom'
import {geolocated} from 'react-geolocated';

import Geolocator from './Geolocator.jsx'
import Search from './Search.jsx'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
        };

        this.getInnerRef = this.getInnerRef.bind(this);
        this.getLocation = this.getLocation.bind(this);
    }

      innerRef;
      getInnerRef(ref) {
        this.innerRef = ref;
      }

      getLocation() {
        this.innerRef && this.innerRef.getLocation();
      }



    updateQuery(e) {
        this.setState({
            query: e.target.value
        });
    }

    render() {

        console.log(this.props.positionError);
        return (
            <div className="container-fluid">
                <Geolocator ref={this.getInnerRef} />
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

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
        userDecisionTimeout: 5000,
    })(Home);