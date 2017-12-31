import React from 'react';
import Song from '../Song/Song';

class Playlist extends React.Component {

  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  handleRemove(index) {
    this.props.remove(index);
  }

  savePlaylist(event) {
    this.props.createPlaylist('test')
  }

  render() {
    return (
      <div className="Playlist">
        <input value='New Playlist' />
        <div className='TrackList'>
          { this.props.addedSongs.map((song, index) => {
            return (
              <div className="Track">
                <Song song={song} />
                <a onClick={() => this.handleRemove(index)} className="Track-action">-</a>
              </div>
            )
          })}
        </div>
        <a onClick={this.savePlaylist} className="Playlist-save">SAVE TO SPOTIFY</a>
      </div>
    );
  }
}

export default Playlist;
