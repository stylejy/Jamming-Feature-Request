const clientId = '92654c9fd6694712a18bfade3fbdabfe';
const redirectUri = 'http://localhost:3000/';
const scope = 'playlist-modify-public';

let accessToken;
let id;

const Spotify = {
  loginStatus() {
    try {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      return true;
    } catch(e) {
      return false;
    }
  },
  login() {
    window.location.href = encodeURI(
      `https://accounts.spotify.com/authorize/?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}`
    );
    accessToken = window.location.href.match(/access_token =([^&]*)/)[1];
  },
  getUserDetails() {
    accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
    return fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json()).then(jsonResponse => jsonResponse);
  },
  search(searchTerm) {
    return fetch(`https://api.spotify.com/v1/search?q=track:${encodeURI(searchTerm)}&type=track`, {
      headers: { 'Authorization': 'Bearer ' + accessToken }
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
      headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({name: name})
    }).then(response => response.json()).then(jsonResponse => jsonResponse);
  },
  addTracks(id, playlistId, addedSongs) {
    const trackUris = addedSongs.map(song => song.uri);
    return fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${id}/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({uris: trackUris})
    }).then(response => response.json()).then(jsonResponse => console.log(jsonResponse));
  }
};

export default Spotify;
