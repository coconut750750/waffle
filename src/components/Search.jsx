import React from 'react';

import '../css/search.css';

class Search extends React.Component {
    handleKeyPress(target) {
        if (target.charCode === 13){
            this.props.onEnter();
        } 
    }

    render() {
        return (
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text search_title">Search</span>
                </div>
                <input onChange={ (e) => this.props.updateQuery(e) } 
                       onKeyPress={ (e) => this.handleKeyPress(e) }
                    type="text" className="form-control form-control-lg" placeholder="san francisco, ca"/>
            </div>
        );
    }
}

export default Search;