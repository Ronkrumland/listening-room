import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

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
        <SkipBack className="control-icon control-icon-secondary" aria-hidden="true" />
      </button>
      <button
        className="control-button control-button-primary"
        type="button"
        onClick={onTogglePlayback}
        aria-label={isPlaying ? "Pause playback" : "Play playback"}
        disabled={disabled}
      >
        {isPlaying
          ? <Pause className="control-icon control-icon-primary" aria-hidden="true" />
          : <Play className="control-icon control-icon-primary" aria-hidden="true" />}
      </button>
      <button
        className="control-button"
        type="button"
        onClick={onNext}
        aria-label="Next track"
        disabled={disabled}
      >
        <SkipForward className="control-icon control-icon-secondary" aria-hidden="true" />
      </button>
    </div>
  );
}
