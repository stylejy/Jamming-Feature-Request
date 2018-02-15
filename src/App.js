import React from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import {clientId, Spotify} from './util/Spotify';

class App extends React.Component {

  constructor(props) {
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

  /*init() {
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
    } else if (localStorage[clientId + 'user'] && localStorage[clientId + 'tokenExpiringTime']) {
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
      localStorage.clear();
    }


  saveState(state, name) {
    window.localStorage.setItem(clientId+name,state);
  }*/

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
    if (Object.keys(this.state.playlist).length === 0) {
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

  setUserName() {
    const user = document.getElementById('user');
    //It only returns if display_name is not null.
    if (this.state.user) {
      user.outerHTML='<h2 class="user" id="user">Hi! ' + this.state.user.display_name + '</h2>';
      /*if (user && Object.keys(this.user).length !== 0 && this.loginStatus()) {
        //It is used if the page is already rendered.
        user.outerHTML='<h2 class="user" id="user">Hi! ' + this.state.user.display_name + '</h2>';
      } else if (this.loginStatus()) {
        return this.state.user.display_name;
      }*/
    }
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <h2 className="user" id="user">Hi! {Spotify.getUserName()}</h2>
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
