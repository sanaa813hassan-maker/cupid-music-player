/**
 * SpotifyEmbed.jsx
 *
 * Renders a Spotify embed iframe that fits perfectly inside the
 * cupid-player window so the whole player can be embedded in another
 * site as a single <iframe>.
 *
 * Activated automatically when the URL contains ?spotify=<id>
 *
 * Supported values for `spotifyId`:
 *   - Bare Track ID:   6dBUzqjtbnIa1TwYbyw5CM
 *   - Spotify URI:     spotify:track:6dBUzqjtbnIa1TwYbyw5CM
 *   - Standard URL:    https://open.spotify.com/track/ID
 *   - Localised URL:   https://open.spotify.com/intl-ar/track/ID?si=xxx
 *   - Embed URL:       https://open.spotify.com/embed/track/ID
 *
 * Usage in your site:
 *   <iframe src="https://cupid-music-player-chi.vercel.app/?spotify=6dBUzqjtbnIa1TwYbyw5CM"
 *           width="100%" height="352" frameBorder="0"
 *           allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
 *           style="border-radius:12px" loading="lazy">
 *   </iframe>
 */

import { useMemo } from 'react';

// Spotify content types we can embed
const SPOTIFY_TYPES = new Set(['track', 'album', 'playlist', 'artist', 'episode', 'show']);

/**
 * Parse any Spotify reference into a clean embed URL.
 * Handles locale segments like /intl-ar/, /intl-en/ etc.
 */
function toEmbedUrl(raw) {
  if (!raw) return null;
  const s = raw.trim();

  // 1. Already an embed URL
  if (s.includes('open.spotify.com/embed/')) {
    try {
      const u = new URL(s);
      return 'https://open.spotify.com/embed' + u.pathname;
    } catch {
      return s;
    }
  }

  // 2. Any open.spotify.com URL — handles /intl-ar/, /intl-en/, bare paths
  if (s.includes('open.spotify.com/')) {
    try {
      const u = new URL(s);
      // Drop locale segments like "intl-ar", "intl-en" from the path
      const parts = u.pathname
        .split('/')
        .filter(function(seg) { return seg.length > 0 && !seg.startsWith('intl-'); });

      // Expecting ['track','ID'] or ['album','ID'] etc.
      if (parts.length >= 2 && SPOTIFY_TYPES.has(parts[0])) {
        return 'https://open.spotify.com/embed/' + parts[0] + '/' + parts[1];
      }
      // Just an ID with no type
      if (parts.length === 1) {
        return 'https://open.spotify.com/embed/track/' + parts[0];
      }
    } catch (e) { /* fall through */ }
  }

  // 3. Spotify URI  →  spotify:track:ID
  if (s.startsWith('spotify:')) {
    const parts = s.split(':');
    if (parts.length >= 3 && SPOTIFY_TYPES.has(parts[1])) {
      return 'https://open.spotify.com/embed/' + parts[1] + '/' + parts[2];
    }
  }

  // 4. Bare ID — no slashes, no colons, looks like a Spotify ID
  if (!s.includes('/') && !s.includes(':') && s.length > 10) {
    return 'https://open.spotify.com/embed/track/' + s;
  }

  return null;
}

export default function SpotifyEmbed({ spotifyId }) {
  const embedUrl = useMemo(function() { return toEmbedUrl(spotifyId); }, [spotifyId]);

  if (!embedUrl) {
    return (
      <div style={styles.error}>
        <p>Could not parse Spotify ID:</p>
        <code style={styles.code}>{spotifyId}</code>
        <p style={styles.hint}>
          Pass a track ID, Spotify URI, or open.spotify.com URL as the{' '}
          <code>?spotify=</code> query parameter.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <iframe
        style={styles.iframe}
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify player"
      />
    </div>
  );
}

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    minHeight: '152px',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    background: '#000',
    borderRadius: 'inherit',
    overflow: 'hidden',
  },
  iframe: {
    border: 'none',
    borderRadius: 'inherit',
    flex: 1,
  },
  error: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#121212',
    color: '#fff',
    fontFamily: 'sans-serif',
    padding: '1rem',
    boxSizing: 'border-box',
    textAlign: 'center',
    gap: '0.5rem',
  },
  code: {
    background: '#282828',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.85em',
    wordBreak: 'break-all',
  },
  hint: {
    color: '#aaa',
    fontSize: '0.85em',
  },
};
