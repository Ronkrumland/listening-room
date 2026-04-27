const API_BASE_URL = import.meta.env.VITE_TRACK_CONTEXT_API_BASE_URL;
const API_BEARER_TOKEN = import.meta.env.VITE_TRACK_CONTEXT_API_BEARER_TOKEN;
const TOKEN_STORAGE_KEY = "listening-room-token";

export function getStoredToken(): string | null {
  return API_BEARER_TOKEN || localStorage.getItem(TOKEN_STORAGE_KEY);
}

function saveToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export async function validateAndSaveToken(token: string): Promise<void> {
  // Validate before persisting - only saves if the request succeeds.
  await request<{ status: string }>("/auth/check", undefined, token);
  saveToken(token);
}

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

async function request<T>(path: string, init?: RequestInit, tokenOverride?: string) {
  const baseUrl = getRequiredEnvValue(
    API_BASE_URL,
    "VITE_TRACK_CONTEXT_API_BASE_URL",
  );
  const token = tokenOverride ?? getStoredToken();

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    ...init,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Track Context request failed with status ${response.status}`;

    try {
      const body = (await response.json()) as { error?: unknown };
      if (typeof body.error === "string") {
        message = body.error;
      }
    } catch {
      // Fall back to the status-based message when the server has no JSON body.
    }

    throw new Error(message);
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
  playingNext: { title: string; artist: string } | null;
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
    playingNext: dto.playingNext
      ? { title: dto.playingNext.trackTitle, artist: dto.playingNext.artistName }
      : null,
  };
}

export const trackContextApi = {
  async getNowPlaying() {
    const response = await request<NowPlayingResponse | undefined>(
      "/display/now-playing",
    );
    if (!response) {
      return null;
    }

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
