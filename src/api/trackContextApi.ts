const API_BASE_URL = import.meta.env.VITE_TRACK_CONTEXT_API_BASE_URL;
const API_BEARER_TOKEN = import.meta.env.VITE_TRACK_CONTEXT_API_BEARER_TOKEN;

type QueuedTrack = {
  trackTitle: string;
  artistName: string;
  albumName: string;
  albumArtUrl: string;
  durationSeconds: number;
  trackUrl: string | null;
};

type NowPlayingResponse = {
  trackTitle: string;
  artistName: string;
  albumName: string;
  albumArtUrl: string | null;
  isPlaying: boolean;
  progressSeconds: number;
  durationSeconds: number;
  source: string;
  isControllable: boolean;
  trackUrl: string | null;
  lastUpdatedAt: string;
  playingNext: QueuedTrack | null;
};

function getRequiredEnvValue(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function request<T>(path: string, init?: RequestInit) {
  const baseUrl = getRequiredEnvValue(
    API_BASE_URL,
    "VITE_TRACK_CONTEXT_API_BASE_URL",
  );
  const bearerToken = getRequiredEnvValue(
    API_BEARER_TOKEN,
    "VITE_TRACK_CONTEXT_API_BEARER_TOKEN",
  );

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(
      `Track Context request failed with status ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export type DisplayNowPlaying = {
  title: string;
  artist: string;
  album: string;
  albumArtUrl: string | null;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
  isControllable: boolean;
  lastUpdatedAt: string;
};

function mapNowPlayingResponse(dto: NowPlayingResponse): DisplayNowPlaying {
  return {
    title: dto.trackTitle,
    artist: dto.artistName,
    album: dto.albumName,
    albumArtUrl: dto.albumArtUrl,
    isPlaying: dto.isPlaying,
    progressMs: Math.max(0, dto.progressSeconds * 1000),
    durationMs: Math.max(0, dto.durationSeconds * 1000),
    isControllable: dto.isControllable,
    lastUpdatedAt: dto.lastUpdatedAt,
  };
}

export const trackContextApi = {
  async getNowPlaying() {
    const response = await request<NowPlayingResponse>("/display/now-playing");
    return mapNowPlayingResponse(response);
  },
  play() {
    return request<void>("/display/play", { method: "POST" });
  },
  pause() {
    return request<void>("/display/pause", { method: "POST" });
  },
  next() {
    return request<void>("/display/next", { method: "POST" });
  },
  previous() {
    return request<void>("/display/previous", { method: "POST" });
  },
};
