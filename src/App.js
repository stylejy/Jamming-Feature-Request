import React from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import Spotify from './util/Spotify';

class App extends React.Component {

  constructor(props) {
    console.log('constructor');
    super(props);

    const init = Spotify.init();

    this.state = {
      songs: init.songs,
      addedSongs: init.addedSongs,
      user: init.user,
      playlist: init.playlist,
      tokenExpiringTime: init.tokenExpiringTime
    };

    this.searchSpotify = this.searchSpotify.bind(this);
    this.loginStatus = this.loginStatus.bind(this);
    this.login = this.login.bind(this);
    this.addToList = this.addToList.bind(this);
    this.removeFromAddedSongs = this.removeFromAddedSongs.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
  }

  componentDidMount() {
    if (Object.keys(this.state.user).length === 0 && Spotify.loginStatus()) {
      Spotify.getUserDetails().then(userDetails => {
        this.setState({user: userDetails}, () => {
          Spotify.saveState(JSON.stringify(this.state.user), 'user');
          console.log('setState done');
        });
      });
    } else if(!Spotify.loginStatus() && Object.keys(this.state.user).length !== 0) {
      this.setState({user: {}});
    }
  }

  searchSpotify(searchTerm) {
    Spotify.search(searchTerm).then(songs => {
      this.setState({songs: songs}, () => Spotify.saveState(JSON.stringify(songs), 'songs'));
    });
  }

  addToList(index) {
    console.log(this.state.addedSongs);
    this.state.addedSongs.push(this.state.songs[index]);
    this.setState({addedSongs: this.state.addedSongs}, () => Spotify.saveState(JSON.stringify(this.state.addedSongs), 'addedSongs'));
  }

  removeFromAddedSongs(index) {
    console.log(index);
    this.state.addedSongs.splice(index, 1);
    this.setState({addedSongs: this.state.addedSongs}, () => Spotify.saveState(JSON.stringify(this.state.addedSongs), 'addedSongs'));
  }

  loginStatus() {
    return Spotify.loginStatus();
  }

  login() {
    Spotify.accessSpotify();
  }

  createPlaylist(name) {
    //if this.state.playlist is empty, it takes a playlist detail from Spotify.
    if (Object.keys(this.state.playlist).length === 0 || name !== this.state.playlist.name) {
      Spotify.createPlaylist(this.state.user.id, name).then(playlist => this.setState({playlist: playlist}, () => {
        console.log('createPlaylist');
        Spotify.saveState(JSON.stringify(playlist), 'playlist');
        Spotify.addTracks(this.state.user.id, this.state.playlist.id, this.state.addedSongs);
        this.setState({addedSongs: []}, () => Spotify.saveState(JSON.stringify(this.state.addedSongs), 'addedSongs'));
      }));
    } else {
      Spotify.addTracks(this.state.user.id, this.state.playlist.id, this.state.addedSongs);
      this.setState({addedSongs: []}, () => Spotify.saveState(JSON.stringify(this.state.addedSongs), 'addedSongs'));
    }
  }

  render() {
    console.log('render');
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <h2 className="user" id="user">Hi! {this.state.user.display_name}</h2>
          <SearchBar loginStatus={this.loginStatus} searchSpotify={this.searchSpotify} login={this.login} />
          <div className="App-playlist">
            <SearchResults add={this.addToList} songs={this.state.songs} />
            <Playlist loginStatus={this.loginStatus} addedSongs={this.state.addedSongs} remove={this.removeFromAddedSongs} createPlaylist={this.createPlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
