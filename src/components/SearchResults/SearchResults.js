import React from 'react';
import Song from '../Song/Song';


class SearchResults extends React.Component {

  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <div className='TrackList'>
          { this.props.songs.map(song => { return <Song song={song} /> } ) }
        </div>
      </div>
    );
  }
}

export default SearchResults;
