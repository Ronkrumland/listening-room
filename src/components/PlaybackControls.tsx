type PlaybackControlsProps = {
  isPlaying: boolean;
  disabled?: boolean;
  onPrevious: () => void;
  onTogglePlayback: () => void;
  onNext: () => void;
};

export function PlaybackControls({
  isPlaying,
  disabled = false,
  onPrevious,
  onTogglePlayback,
  onNext,
}: PlaybackControlsProps) {
  return (
    <div className="controls" aria-label="Playback controls">
      <button
        className="control-button"
        type="button"
        onClick={onPrevious}
        aria-label="Previous track"
        disabled={disabled}
      >
        <span aria-hidden="true">|&lt;</span>
      </button>
      <button
        className="control-button control-button-primary"
        type="button"
        onClick={onTogglePlayback}
        aria-label={isPlaying ? "Pause playback" : "Play playback"}
        disabled={disabled}
      >
        <span aria-hidden="true">{isPlaying ? "||" : ">"}</span>
      </button>
      <button
        className="control-button"
        type="button"
        onClick={onNext}
        aria-label="Next track"
        disabled={disabled}
      >
        <span aria-hidden="true">&gt;|</span>
      </button>
    </div>
  );
}
