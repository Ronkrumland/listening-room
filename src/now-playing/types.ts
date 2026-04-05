export type NowPlayingTrack = {
  title: string;
  artist: string;
  album: string;
  albumArtUrl: string | null;
  isPlaying: boolean;
  isControllable: boolean;
  lastUpdatedAt: string;
  progressMs: number;
  durationMs: number;
  playingNext: { title: string; artist: string } | null;
};
