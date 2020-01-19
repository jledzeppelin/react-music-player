import React from 'react';
import logo from './logo.svg';
import './App.css';

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

/**
 * -- state --
 * token: API token for Spotify API
 * deviceId: represents this web browser as a spotify player
 * loggedIn: check if logged in, if not provide error message
 * trackName, artistName, albumName: song info
 * playing: whether player is playing a track or paused
 * position, duration: track progress of the song
 */
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      deviceId: "",
      loggedIn: false,
      error: "",
      trackName: "Track Name",
      artistName: "Artist Name",
      albumName: "Album Name",
      playing: false,
      position: 0,
      duration: 0,
    };
  }

  handleLogin() {
    if (this.state.token !== "") {
      this.setState({ loggedIn: true });
    }
  }

  render() {
    const {
      token,
      loggedIn,
      error,
      artistName,
      trackName,
      albumName,
      playing,
      position,
      duration,
    } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h3>Now Playing</h3>
        </div>

        {error && <p>Error: {error}</p>}

        {
          /**
           * check if user is logged into Spotify, if yes main screen will display
           * the current song's info (TODO: add features). if user is not logged in prompt
           * user to enter access token
           */
        }
        {loggedIn ? 
        (<div>
          <p>Artist: {artistName}</p>
          <p>Track: {trackName}</p>
          <p>Album: {albumName}</p>
        </div>) :
        (<div>
          <p className="App-intro">
            Enter Spotify access token. Get token  
            <a href="https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/#authenticating-with-spotify">
              here
            </a>
          </p>

          <p>
            <input type="text" value={token} onChange={e => this.setState({ token: e.target.value })} />
          </p>

          <p>
            <button onClick={() => this.handleLogin()}>GO</button>
          </p>
        </div>)
        }

      </div>
    );
  }
}

export default App;
