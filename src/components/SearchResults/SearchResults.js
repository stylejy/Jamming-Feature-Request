import React from 'react';

class SearchResults extends React.Component {

  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <div className='TrackList'>
        </div>
        <a className="Track-action">+</a>
      </div>
    );
  }
}

export default SearchResults
