import React from 'react';
import Song from '../Song/Song';
import './Playlist.css'

class Playlist extends React.Component {

  constructor(props) {
    super(props);

    this.isNameFieldClicked = false;

    this.handleRemove = this.handleRemove.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.clearPlaylistField = this.clearPlaylistField.bind(this);
    this.revertPlaylistField = this.revertPlaylistField.bind(this);
    this.createSaveButtonElement = this.createSaveButtonElement.bind(this);
    this.playlistClickHandler = this.playlistClickHandler.bind(this);
  }

  handleRemove(index) {
    this.props.remove(index);
  }

  savePlaylist(event) {
    const playListInput = document.getElementById('playListName');
    if (this.props.addedSongs.length > 0) {
      this.props.createPlaylist(playListInput.value);
      playListInput.value = 'New Playlist';
    }
  }

  clearPlaylistField(event) {
    const playListInput = document.getElementById('playListName');
    if (playListInput.value === 'New Playlist') {
      playListInput.value = '';
    }
  }

  revertPlaylistField(event) {
    const playListInput = document.getElementById('playListName');
    if (playListInput.value === '' && this.isNameFieldClicked === false) {
      playListInput.value = 'New Playlist';
    } else if (event.type === 'blur') {
      playListInput.value = 'New Playlist';
    }
  }

  playlistClickHandler(event) {
    this.isNameFieldClicked = true;
  }

  createSaveButtonElement() {
    if (this.props.loginStatus()) {
      return (
        <a onClick={this.savePlaylist} className="Playlist-save">SAVE TO SPOTIFY</a>
      );
    } else {
      return (
        <div className="Playlist-save-unclickable">SAVE TO SPOTIFY<br/><br/> ( Login Required )</div>
      );
    }
  }

  render() {
    return (
      <div className="Playlist">
        <input id='playListName' onMouseEnter={this.clearPlaylistField} onClick={this.playlistClickHandler} onMouseLeave={this.revertPlaylistField} onBlur={this.revertPlaylistField} type='text' defaultValue='New Playlist' />
        <div className='TrackList' id='TrackList'>
          { this.props.addedSongs.map((song, index) => {
            return (
              <div className="Track" key={index}>
                <Song song={song} />
                <a onClick={() => this.handleRemove(index)} className="Track-action">-</a>
              </div>
            )
          })}
        </div>
        {this.createSaveButtonElement()}
      </div>
    );
  }
}

export default Playlist;
