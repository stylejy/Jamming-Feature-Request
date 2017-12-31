import React from 'react';
import './style.css';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import Spotify from './util/Spotify';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      songs: [],
      addedSongs: [],
      user: {},
      playlist: {}
    };

    Spotify.getUserDetails().then(user => this.setState({user: user}));

    this.searchSpotify = this.searchSpotify.bind(this);
    this.loginStatus = this.loginStatus.bind(this);
    this.login = this.login.bind(this);
    this.addToList = this.addToList.bind(this);
    this.removeFromAddedSongs = this.removeFromAddedSongs.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
  }

  searchSpotify(searchTerm) {
    Spotify.search(searchTerm).then(songs => this.setState({songs: songs}, () => {console.log(this.state.songs);}));
  }

  addToList(index) {
    console.log(this.state.addedSongs);
    this.state.addedSongs.push(this.state.songs[index]);
    this.setState({addedSongs: this.state.addedSongs});
  }

  removeFromAddedSongs(index) {
    console.log(index);
    this.state.addedSongs.splice(index, 1);
    this.setState({addedSongs: this.state.addedSongs});
  }

  loginStatus() {
    return Spotify.loginStatus();
  }

  login() {
    return Spotify.login();
  }

  createPlaylist(name) {
    Spotify.createPlaylist(this.state.user.id, name).then(playlist => this.setState({playlist: playlist}, () => {
      console.log(this.state.playlist);
      Spotify.addTracks(this.state.user.id, this.state.playlist.id, this.state.addedSongs);
    }))
    ;

  }



  render() {
    return (
      <div className="App">
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <SearchBar loginStatus={this.loginStatus} searchSpotify={this.searchSpotify} login={this.login} />
        <div className="App-playlist">
          <SearchResults add={this.addToList} songs={this.state.songs} />
          <Playlist addedSongs={this.state.addedSongs} remove={this.removeFromAddedSongs} createPlaylist={this.createPlaylist} />
        </div>
      </div>
    );
  }
}

export default App;
