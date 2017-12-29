import React from 'react';


class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLoggedIn: this.props.loginStatus()
    };

    this.createSearchElements = this.createSearchElements.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleLogin(event) {
    this.props.login();
  }

  handleSearch(event) {
    const searchTerm = document.getElementById('search').value;
    this.props.searchSpotify(searchTerm);
  }

  createSearchElements() {
    if (this.state.isUserLoggedIn) {
      return (
        <div className="SearchBar">
          <input id="search" placeholder="Enter A Song Title" />
          <a onClick={this.handleSearch}>SEARCH</a>
        </div>
      );
    } else {
      return (
        <div className="SearchBar">
          <input placeholder="Spotify Login Required" disabled />
          <a onClick={this.handleLogin}>Login</a>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        {this.createSearchElements()}
      </div>
    );
  }
}

export default SearchBar;
