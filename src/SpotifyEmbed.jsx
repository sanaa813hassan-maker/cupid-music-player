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
 *   - Track ID:   6dBUzqjtbnIa1TwYbyw5CM
 *   - Full URI:   spotify:track:6dBUzqjtbnIa1TwYbyw5CM
 *   - Short URL:  https://open.spotify.com/track/6dBUzqjtbnIa1TwYbyw5CM
 *   - Embed URL:  https://open.spotify.com/embed/track/6dBUzqjtbnIa1TwYbyw5CM
 *
 * Usage in your site:
 *   <iframe src="https://your-cupid-deployment.vercel.app/?spotify=6dBUzqjtbnIa1TwYbyw5CM"
 *           width="100%" height="352" frameBorder="0"
 *           allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
 *           style="border-radius:12px" loading="lazy">
 *   </iframe>
 */

import { useMemo } from 'react';

/**
 * Parse any Spotify reference into an embed URL.
 * Returns null if we can't figure it out.
 */
function toEmbedUrl(raw) {
  if (!raw) return null;
  const s = raw.trim();

  // Already a full embed URL — use as-is (strip extra query params to keep it clean)
  if (s.includes('open.spotify.com/embed/')) {
    try {
      const u = new URL(s);
      // Keep the si param if present, strip everything else
      const si = u.searchParams.get('si');
      return `https://open.spotify.com/embed${u.pathname}${si ? `?si=${si}` : ''}`;
    } catch {
      return s;
    }
  }

  // Full open.spotify.com URL  →  extract type + id
  if (s.includes('open.spotify.com/')) {
    try {
      const u = new URL(s);
      // pathname looks like /track/ID or /album/ID etc.
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        return `https://open.spotify.com/embed/${parts[0]}/${parts[1]}`;
      }
    } catch { /* fall through */ }
  }

  // URI  →  spotify:track:ID  or  spotify:album:ID etc.
  if (s.startsWith('spotify:')) {
    const parts = s.split(':');
    if (parts.length >= 3) {
      return `https://open.spotify.com/embed/${parts[1]}/${parts[2]}`;
    }
  }

  // Bare ID — assume it's a track (most common embed use-case)
  // A Spotify ID is 22 alphanumeric chars, but we'll accept anything
  // that doesn't look like a URL/URI and forward it as a track id.
  if (!s.includes('/') && !s.includes(':')) {
    return `https://open.spotify.com/embed/track/${s}`;
  }

  return null;
}

export default function SpotifyEmbed({ spotifyId }) {
  const embedUrl = useMemo(() => toEmbedUrl(spotifyId), [spotifyId]);

  if (!embedUrl) {
    return (
      <div style={styles.error}>
        <p>⚠️ Couldn't parse Spotify ID:</p>
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
    minHeight: '152px',   // Spotify compact embed minimum
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    background: '#000',   // Spotify's own bg — prevents white flash
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
