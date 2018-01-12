export const clientId = '92654c9fd6694712a18bfade3fbdabfe';
const redirectUri = 'http://localhost:3000/';
const scope = 'playlist-modify-public';

export const Spotify = {
  processAuthValues() {
    const tokenCallback = window.location.href.match(/access_token=([^&]*)/);
    const expireInCallBack = window.location.href.match(/expires_in=([^&]*)/);
    const errorCallback = window.location.href.match(/error=([^&]*)/);

    if (tokenCallback != null) {
      return {accessToken: tokenCallback[1], expireIn: expireInCallBack[1]};
    } else {
      if (errorCallback != null) {
        console.log(errorCallback[1]);
      }
      return false;
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
