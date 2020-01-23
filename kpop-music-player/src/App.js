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

    this.playerCheckInterval = null;
  }

  handleLogin() {
    if (this.state.token !== "") {
      this.setState({ loggedIn: true });

      // check every second for spotify player
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }
  }

  /**
   * check for the Spotify variable (index.html), if it exists create a Player obj.
   * method is constantly called until SDK is ready
   */
  checkForPlayer() {
    const { token } = this.state;

    if (window.Spotify !== null) {
      // once player is created cancel the playerCheckInterval
      clearInterval(this.playerCheckInterval);
      
      this.player = new window.Spotify.Player({
        name: "K-popped",
        getOAuthToken: cb => { cb(token); },
      });

      this.createEventHandlers();

      this.player.connect();
    }
  }

  // update app when data is received from spotify API
  createEventHandlers() {
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false});
    });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });

    this.player.on('player_state_changed', state => this.onStateChanged(state));

    this.player.on('ready', data => {
      let { device_id } = data;
      console.log("Listen now");
      this.setState({ deviceId: device_id });
    });
  }

  /**
   * update this.state using Spotify's player state
   */
  onStateChanged(state) {
    if (state !== null) {

      // song info
      const {
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      // convert artist objects to strings for names
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(", ");
      const playing = !state.paused;

      // update component's state with data received from player state object
      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        playing,
      });
    }
  }

  //=========================== Player Controls ===============================
  onPrevClick() {
    this.player.previousTrack();
  }

  onPlayClick() {
    this.player.togglePlay();
  }

  onNextClick() {
    this.player.nextTrack();
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
          <h3>K-popped</h3>
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

          <p>
            <button onClick={() => this.onPrevClick()}>Previous</button>
            <button onClick={() => this.onPlayClick()}>{playing ? "Pause" : "Play"}</button>
            <button onClick={() => this.onNextClick()}>Next</button>
          </p>
        </div>) :
        (<div>
          <p className="App-intro">
            Enter Spotify access token. Get token {" "}
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
