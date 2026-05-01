# listening-room

`listening-room` is a fullscreen React display for the music currently playing
through `track-context`. It is designed as a calm room interface: large album
art, readable metadata, lightweight playback controls, and minimal chrome.

The app is intentionally a client, not a Spotify integration on its own. It
talks to the `track-context` display API, stores only the private API bearer
token, and leaves Spotify OAuth and provider tokens on the server.

## Current Features

- Fullscreen now-playing display with album art, track title, artist, and album.
- Blurred artwork backdrop with a focused player surface.
- Playback progress bar with local ticking between API polls.
- Play/pause, previous, and next controls routed through `track-context`.
- Next-track preview when Spotify queue data is available.
- Token gate on first load, plus a settings modal for replacing the saved token.
- Optional build-time bearer token for kiosk-style deployments.
- Graceful fallback state when nothing is currently playing.
- Controls that fade when the display is idle.

## Relationship To `track-context`

`listening-room` consumes these server endpoints:

- `GET /auth/check`
- `GET /display/now-playing`
- `POST /display/play`
- `POST /display/pause`
- `POST /display/next`
- `POST /display/previous`

The server must be running, configured for Spotify, and allow this app's origin
through `ALLOWED_CORS_ORIGINS`.

## Environment

Create a `.env.local` file with:

```bash
VITE_TRACK_CONTEXT_API_BASE_URL=http://127.0.0.1:3000
```

You can also provide the bearer token at build/dev time:

```bash
VITE_TRACK_CONTEXT_API_BEARER_TOKEN=your-existing-bearer-token
```

If `VITE_TRACK_CONTEXT_API_BEARER_TOKEN` is omitted, the app asks for the token
in the browser and saves it in local storage.

## Run

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview a production build:

```bash
npm run preview
```

## Direction

The product direction is a single-user ambient music room rather than a general
music dashboard. The next useful improvements are display quality, resilience,
and a small set of room-friendly modes.

Near-term ideas:

- Better no-track, paused, and Spotify-auth-required states.
- Device and seek controls once the client needs them.
- More polished idle behavior for wall-mounted or always-on screens.
- Display modes such as basic player, record player, and cassette player.
- Real-time updates after the polling version is dependable.

Explicitly deferred for now:

- Multi-user sessions.
- Social or sharing features.
- A broad theme/plugin system.
- Spotify content caching in the client.
