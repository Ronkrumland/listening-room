import { Settings } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "./components/AuthModal";
import { PlaybackControls } from "./components/PlaybackControls";
import { ProgressBar } from "./components/ProgressBar";
import { SettingsModal } from "./components/SettingsModal";
import { useControlsVisible } from "./hooks/useControlsVisible";
import { getStoredToken } from "./api/trackContextApi";
import { useNowPlaying } from "./now-playing/useNowPlaying";

const FALLBACK_ALBUM_ART_URL = "/mock-album-art.svg";

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function Player() {
  const {
    nowPlaying,
    loading,
    error,
    transportPending,
    togglePlayback,
    previousTrack,
    nextTrack,
  } = useNowPlaying();
  const controlsVisible = useControlsVisible();
  const [showSettings, setShowSettings] = useState(false);
  const albumArtUrl = nowPlaying.albumArtUrl ?? FALLBACK_ALBUM_ART_URL;
  const fadeClass = controlsVisible ? "controls-wrap" : "controls-wrap controls-wrap--hidden";

  return (
    <main className="app-shell">
      <div
        className="backdrop"
        style={{ "--backdrop-image": `url("${albumArtUrl}")` } as React.CSSProperties}
        aria-hidden="true"
      />

      <section className="player-card" aria-label="Now playing">
        <div className="artwork-wrap">
          <img
            className="artwork"
            src={albumArtUrl}
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

          {nowPlaying.playingNext && (
            <p className="playing-next">
              Next: {nowPlaying.playingNext.title} — {nowPlaying.playingNext.artist}
            </p>
          )}

          <div className={fadeClass}>
            <PlaybackControls
              isPlaying={nowPlaying.isPlaying}
              disabled={!nowPlaying.isControllable || transportPending}
              onPrevious={previousTrack}
              onTogglePlayback={togglePlayback}
              onNext={nextTrack}
            />
            <button
              className="settings-button"
              type="button"
              onClick={() => setShowSettings(true)}
              aria-label="Settings"
            >
              <Settings size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </main>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getStoredToken() !== null);

  if (!isAuthenticated) {
    return <AuthModal onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return <Player />;
}
