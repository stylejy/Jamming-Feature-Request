import React, { Component } from 'react';
import './style.css';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import Spotify from './util/Spotify'

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <SearchBar Spotify={Spotify} />
        <div className="App-playlist">
          <SearchResults />
          <Playlist />
        </div>
      </div>
    );
  }
}

export default App;
