import React from 'react';

class Song extends React.Component {
  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.song.name}</h3>
          <p>{this.props.song.artist} | {this.props.song.album}</p>
        </div>
        <a className="Track-action">+</a>
      </div>
    );
  }
}

export default Song;
