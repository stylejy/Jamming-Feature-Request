import React from 'react';
import Song from '../Song/Song';
import './SearchResults.css'


class SearchResults extends React.Component {

  constructor(props) {
    super(props);
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAdd(index) {
    this.props.add(index);
  }

  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <div className='TrackList'>
          { this.props.songs.map((song, index) => {
            return (
              <div className="Track" key={index}>
                <Song song={song} />
                <a onClick={() => this.handleAdd(index)} className="Track-action">+</a>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default SearchResults;
