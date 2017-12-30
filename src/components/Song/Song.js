import React from 'react';

class Song extends React.Component {
  render() {
    return (
      <div id={this.props.song.id} className="Track-information">
        <h3>{this.props.song.name}</h3>
        <p>{this.props.song.artist} | {this.props.song.album}</p>
      </div>
    );
  }
}

export default Song;
