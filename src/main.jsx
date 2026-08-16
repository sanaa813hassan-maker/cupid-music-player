import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import SpotifyEmbed from './SpotifyEmbed.jsx';
import './index.css';

// Check if we're in Spotify embed mode via URL params
// Usage: ?spotify=TRACK_ID  or  ?spotify=SPOTIFY_URI
// e.g.  ?spotify=6dBUzqjtbnIa1TwYbyw5CM
//        ?spotify=spotify:track:6dBUzqjtbnIa1TwYbyw5CM
const params = new URLSearchParams(window.location.search);
const spotifyParam = params.get('spotify');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {spotifyParam ? <SpotifyEmbed spotifyId={spotifyParam} /> : <App />}
  </React.StrictMode>
);
