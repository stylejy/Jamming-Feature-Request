const clientId = '92654c9fd6694712a18bfade3fbdabfe';
const clientSecret = 'c1b714c782cc423a953bc362a5e217de';
const redirectUri = 'http://localhost:3000/';
const scope = 'playlist-modify-public';

let accessToken;

const Spotify = {
  loginStatus() {
    try {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      this.getUserDetails();
      return true;
    } catch(e) {
      return false;
    }
  },
  login() {
    window.location.href = encodeURI(
      `https://accounts.spotify.com/authorize/?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}`
    );
    accessToken = window.location.href.match(/access_token =([^&]*)/)[1];
  },
  getUserDetails() {
    return fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json()).then(jsonResponse => console.log(jsonResponse));
  },
  search(searchWord) {
    return fetch(`https://api.spotify.com/v1/search?q=${encodeURI(searchWord)}&type=track`, {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json()).then(jsonResponse => console.log(jsonResponse));
  }
};

export default Spotify;
