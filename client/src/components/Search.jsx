import React from 'react';

class Search extends React.Component {
    render() {
        return (
            <div className="input-group mb-3">
                <input onChange={ (e) => this.props.updateQuery(e) } 
                    type="text" className="form-control" placeholder="Search for a city"/>
            </div>
        );
    }
}

export default Search;