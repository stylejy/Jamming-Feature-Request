export const clientId = '92654c9fd6694712a18bfade3fbdabfe';
const redirectUri = 'https://stylejy-jamming.surge.sh/';
const scope = 'playlist-modify-public';

let accessToken = '';
let expireIn = '';
let tokenExpiringTime = 0;
let songs = [];
let addedSongs = [];
let user = {};
let playlist = {};

export const Spotify = {
  init() {
    /** If window.location.href equals the redirectUri,
        it means that the url doesn't have any callback.
    */
    if (window.location.href !== redirectUri) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expireIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      const errorCallback = window.location.href.match(/error=([^&]*)/);

      if (errorCallback) {
        console.log(errorCallback[1]);
      }

      this.expiringTimeController('login', expireIn);
      this.saveState(accessToken, 'accessToken');
      this.saveState(expireIn, 'expireIn');
      window.history.pushState({accessToken: accessToken}, null, '/');

      this.getUserDetails().then(userDetails => {
        user = userDetails;
        this.saveState(JSON.stringify(user), 'user');
        //this.getUserName();
      });
    } else if (localStorage[clientId + 'user'] && localStorage[clientId + 'tokenExpiringTime']) {
      user = JSON.parse(localStorage[clientId + 'user']);
      tokenExpiringTime = localStorage[clientId + 'tokenExpiringTime'];
      this.expiringTimeController('current');
    } else {
      this.expiringTimeController('current');
    }

    this.restoreStates();

    return {songs: songs, addedSongs: addedSongs, user: user, playlist: playlist, tokenExpiringTime: tokenExpiringTime};
  },
  getUserName() {
    //If user name is not set by the user, user.display_name will not be returned.
    if (user && user.display_name && this.loginStatus()) {
      return user.display_name;
    }
  },
  restoreStates() {
    if (localStorage[clientId + 'songs']) {
      songs = JSON.parse(localStorage[clientId + 'songs']);

    }

    if (localStorage[clientId + 'addedSongs']) {
      addedSongs = JSON.parse(localStorage[clientId + 'addedSongs']);
    }

    if (localStorage[clientId + 'playlist']) {
      playlist = JSON.parse(localStorage[clientId + 'playlist']);
    }
  },
  saveState(state, name) {
    window.localStorage.setItem(clientId+name,state);
  },
  expiringTimeController(type) {
    const currentTime = new Date().getTime();

    if (type === 'login') {
      tokenExpiringTime = currentTime + (expireIn - 300) * 1000;
      this.saveState(tokenExpiringTime, 'tokenExpiringTime');
    } else {
      tokenExpiringTime = localStorage[clientId + 'tokenExpiringTime'];
      console.log(tokenExpiringTime);
    }

    const leftTime = tokenExpiringTime - currentTime;

    if (leftTime > 0) {
      window.setTimeout(() => window.location.reload(), leftTime);
      window.history.pushState({accessToken: localStorage[clientId + 'accessToken'], expireIn: localStorage[clientId + 'expireIn']}, null, '/');
    } else {
      window.history.pushState({accessToken: undefined}, null, '/');
      localStorage.clear();
    }
  },
  loginStatus() {
    if (window.history.state !== null && window.history.state.accessToken) {
      return true;
    } else {
      return false;
    }
  },
  accessSpotify() {
    window.location.href = encodeURI(
      `https://accounts.spotify.com/authorize/?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}`
    );
  },
  getUserDetails() {
    return fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + window.history.state.accessToken }
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed');
    }, networkError => console.log(networkError.message)).then(jsonResponse => jsonResponse);
  },
  search(searchTerm) {
    return fetch(`https://api.spotify.com/v1/search?q=track:${encodeURI(searchTerm)}&type=track`, {
      headers: { 'Authorization': 'Bearer ' + window.history.state.accessToken }
    }).then(response => response.json()).then(jsonResponse => {
      return jsonResponse.tracks.items.map(item => ({
        id: item.id,
        name: item.name,
        uri: item.uri,
        album: item.album.name,
        artist: item.artists[0].name
      }));
    });
  },
  createPlaylist(id, name) {
    return fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${id}/playlists`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + window.history.state.accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({name: name})
    }).then(response => response.json()).then(jsonResponse => jsonResponse);
  },
  addTracks(id, playlistId, addedSongs) {
    const trackUris = addedSongs.map(song => song.uri);
    return fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${id}/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + window.history.state.accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({uris: trackUris})
    }).then(response => response.json()).then(jsonResponse => console.log(jsonResponse));
  }
};
