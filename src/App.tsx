import { PlaybackControls } from "./components/PlaybackControls";
import { ProgressBar } from "./components/ProgressBar";
import { useNowPlaying } from "./now-playing/useNowPlaying";

const FALLBACK_ALBUM_ART_URL = "/mock-album-art.svg";

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function App() {
  const {
    nowPlaying,
    loading,
    error,
    transportPending,
    togglePlayback,
    previousTrack,
    nextTrack,
  } = useNowPlaying();

  return (
    <main className="app-shell">
      <div className="backdrop" aria-hidden="true" />

      <section className="player-card" aria-label="Now playing">
        <div className="artwork-wrap">
          <img
            className="artwork"
            src={nowPlaying.albumArtUrl ?? FALLBACK_ALBUM_ART_URL}
            alt={`${nowPlaying.album} album artwork`}
          />
        </div>

        <div className="player-content">
          <p className="eyebrow">Now Playing</p>
          <h1 className="track-title">{nowPlaying.title}</h1>
          <p className="artist-name">{nowPlaying.artist}</p>
          <p className="album-name">{nowPlaying.album}</p>
          {(loading || error) && (
            <p className="status-message" role={error ? "alert" : "status"}>
              {loading ? "Connecting to track-context..." : error}
            </p>
          )}

          <div className="progress-section">
            <ProgressBar value={nowPlaying.progressMs} max={nowPlaying.durationMs} />
            <div className="time-row" aria-label="Playback timing">
              <span>{formatTime(nowPlaying.progressMs)}</span>
              <span>{formatTime(nowPlaying.durationMs)}</span>
            </div>
          </div>

          <PlaybackControls
            isPlaying={nowPlaying.isPlaying}
            disabled={!nowPlaying.isControllable || transportPending}
            onPrevious={previousTrack}
            onTogglePlayback={togglePlayback}
            onNext={nextTrack}
          />
        </div>
      </section>
    </main>
  );
}
