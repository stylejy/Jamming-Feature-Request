import React from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import {clientId, Spotify} from './util/Spotify';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      songs: [],
      addedSongs: [],
      user: {},
      playlist: {},
    };



    this.init();
    console.log(window.history);
    //Spotify.processAuthValues();

    /*if (window.history.state.accessToken) {
      Spotify.getUserDetails().then(user => {
        this.state.user = user;
        this.saveState(this.state.user, 'user');
      });
    } else {
      window.localStorage.clear();
    }*/

    /**
    I don't use setState in a constructor becuase it cuases the error below:
     "Warning: setState(...): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the App component."
    **/
    //this.setState({user: Spotify.getUserDetails()});

    this.searchSpotify = this.searchSpotify.bind(this);
    this.loginStatus = this.loginStatus.bind(this);
    this.login = this.login.bind(this);
    this.addToList = this.addToList.bind(this);
    this.removeFromAddedSongs = this.removeFromAddedSongs.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
  }

  init() {
    const callback = Spotify.processAuthValues();

    //window.history.pushState({accessToken: localStorage[clientId + 'accessToken'], expireIn: localStorage[clientId + 'expireIn']}, null, '/');
    if (callback) {
      window.history.pushState({accessToken: callback.accessToken, expireIn: callback.expireIn}, null, '/');
      this.saveState(callback.accessToken, 'accessToken');
      this.saveState(callback.expireIn, 'expireIn');
      /*if (window.history.state.accessToken) {
        Spotify.getUserDetails().then(user => {
          this.saveState(this.state.user, 'user');
        });
      }*/
    }
  }

  saveState(state, name) {
    window.localStorage.setItem(clientId+name,state);
    console.log(window.localStorage);
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
    window.localStorage.clear();
    Spotify.accessSpotify();
  }

  createPlaylist(name) {
    const addedSongs = this.state.addedSongs;
    this.setState({addedSongs: []});
    Spotify.createPlaylist(this.state.user.id, name).then(playlist => this.setState({playlist: playlist}, () => {
      console.log(this.state.playlist);
      Spotify.addTracks(this.state.user.id, this.state.playlist.id, addedSongs);
    }));
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar loginStatus={this.loginStatus} searchSpotify={this.searchSpotify} login={this.login} />
          <div className="App-playlist">
            <SearchResults add={this.addToList} songs={this.state.songs} />
            <Playlist addedSongs={this.state.addedSongs} remove={this.removeFromAddedSongs} createPlaylist={this.createPlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
