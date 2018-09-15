import React from 'react';

import '../css/search.css';

class Search extends React.Component {
    render() {
        return (
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text search_title">Search</span>
                </div>
                <input onChange={ (e) => this.props.updateQuery(e) } 
                    type="text" className="form-control form-control-lg" placeholder="san francisco, ca"/>
            </div>
        );
    }
}

export default Search;