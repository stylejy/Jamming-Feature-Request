import React from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import {clientId, Spotify} from './util/Spotify';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.songs = [];
    this.addedSongs = [];
    this.user = {};
    this.playlist = {};
    this.tokenExpiringTime = 0;

    this.init();
    //console.log(window.history);
    //console.log(localStorage);

    this.state = {
      songs: this.songs,
      addedSongs: this.addedSongs,
      user: this.user,
      playlist: this.playlist,
      tokenExpiringTime: this.tokenExpiringTime
    };

    this.searchSpotify = this.searchSpotify.bind(this);
    this.loginStatus = this.loginStatus.bind(this);
    this.login = this.login.bind(this);
    this.addToList = this.addToList.bind(this);
    this.removeFromAddedSongs = this.removeFromAddedSongs.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
  }

  init() {
    const callback = Spotify.processAuthValues();

    if (callback) {
      const loginTime = new Date().getTime();
      this.tokenExpiringTime = loginTime + (callback.expireIn - 300) * 10000;
      this.tokenExpiringController(loginTime);

      this.saveState(this.tokenExpiringTime, 'tokenExpiringTime');
      this.saveState(callback.accessToken, 'accessToken');
      this.saveState(callback.expireIn, 'expireIn');

      window.history.pushState({accessToken: callback.accessToken}, null, '/');
      Spotify.getUserDetails().then(user => {
        this.user = user;
        this.saveState(JSON.stringify(user), 'user');
        this.getUserName();
      });
    } else {
      this.user = JSON.parse(localStorage[clientId + 'user']);
      this.tokenExpiringTime = localStorage[clientId + 'tokenExpiringTime'];

      const currentTime = new Date().getTime();
      this.tokenExpiringController(currentTime);
      this.getUserName();
    }

    if (localStorage[clientId + 'songs']) {
      this.songs = JSON.parse(localStorage[clientId + 'songs']);
    }

    if (localStorage[clientId + 'addedSongs']) {
      this.addedSongs = JSON.parse(localStorage[clientId + 'addedSongs']);
    }

    if (localStorage[clientId + 'playlist']) {
      this.playlist = JSON.parse(localStorage[clientId + 'playlist']);
    }
  }

  tokenExpiringController(time) {
    const leftTime = this.tokenExpiringTime - time;

    if (leftTime > 0) {
      window.setTimeout(() => window.location.reload(), leftTime);
      window.history.pushState({accessToken: localStorage[clientId + 'accessToken'], expireIn: localStorage[clientId + 'expireIn']}, null, '/');
    } else {
      window.history.pushState({accessToken: undefined}, null, '/');
    }
  }

  saveState(state, name) {
    window.localStorage.setItem(clientId+name,state);
  }

  searchSpotify(searchTerm) {
    Spotify.search(searchTerm).then(songs => {
      this.setState({songs: songs}, () => console.log(this.state.songs));
      this.saveState(JSON.stringify(songs), 'songs');
    });
  }

  addToList(index) {
    console.log(this.state.addedSongs);
    this.state.addedSongs.push(this.state.songs[index]);
    this.setState({addedSongs: this.state.addedSongs});
    this.saveState(JSON.stringify(this.state.addedSongs), 'addedSongs');
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
    Spotify.accessSpotify();
  }

  createPlaylist(name) {
    console.log(this.state.playlist);
    //if this.state.playlist is empty, it takes a playlist detail from Spotify.
    if (Object.keys(this.state.playlist).length === 0) {
      Spotify.createPlaylist(this.state.user.id, name).then(playlist => this.setState({playlist: playlist}, () => {
        console.log('createPlaylist');
        this.saveState(JSON.stringify(playlist), 'playlist');
        Spotify.addTracks(this.state.user.id, this.state.playlist.id, this.state.addedSongs);
        this.setState({addedSongs: []});
        this.saveState(JSON.stringify(this.state.addedSongs), 'addedSongs');
      }));
    } else {
      Spotify.addTracks(this.state.user.id, this.state.playlist.id, this.state.addedSongs);
      this.setState({addedSongs: []});
      this.saveState(JSON.stringify(this.state.addedSongs), 'addedSongs');
    }
  }

  getUserName() {
    const user = document.getElementById('user');
    if (user && Object.keys(this.user).length !== 0 && this.loginStatus()) {
      user.outerHTML='<h2 class="user" id="user">Hi! ' + this.user.display_name + '</h2>';
    } else if (this.loginStatus()) {
      return this.user.display_name;
    }
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <h2 className="user" id="user">Hi! {this.getUserName()}</h2>
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
