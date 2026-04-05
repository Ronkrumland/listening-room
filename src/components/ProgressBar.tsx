type ProgressBarProps = {
  value: number;
  max: number;
};

export function ProgressBar({ value, max }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className="progress-track" aria-hidden="true">
      <div className="progress-fill" style={{ width: `${percentage}%` }} />
    </div>
  );
}
