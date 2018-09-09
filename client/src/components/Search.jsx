import React from 'react';

class Search extends React.Component {
    render() {
        return (
            <div className="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Search for restaurants in</span>
                </div>
                <input onChange={ (e) => this.props.updateQuery(e) } 
                    type="text" className="form-control" placeholder="City"/>
            </div>
        );
    }
}

export default Search;