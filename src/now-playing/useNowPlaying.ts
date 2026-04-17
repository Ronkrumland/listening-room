import { useEffect, useState } from "react";
import {
  SPOTIFY_AUTH_REQUIRED_CODE,
  TrackContextApiError,
  trackContextApi,
} from "../api/trackContextApi";
import { NowPlayingTrack } from "./types";

const POLL_INTERVAL_MS = 5000;
const PROGRESS_TICK_MS = 1000;
const FALLBACK_NOW_PLAYING: NowPlayingTrack = {
  title: "Nothing Playing",
  artist: "Listening Room",
  album: "Waiting for track-context",
  albumArtUrl: null,
  isPlaying: false,
  isControllable: false,
  lastUpdatedAt: "",
  progressMs: 0,
  durationMs: 0,
  playingNext: null,
};

export function useNowPlaying() {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spotifyAuthRequired, setSpotifyAuthRequired] = useState(false);
  const [spotifyAuthPending, setSpotifyAuthPending] = useState(false);
  const [transportPending, setTransportPending] = useState(false);

  function handleRequestError(nextError: unknown, fallbackMessage: string) {
    if (
      nextError instanceof TrackContextApiError &&
      nextError.code === SPOTIFY_AUTH_REQUIRED_CODE
    ) {
      setSpotifyAuthRequired(true);
      setError("Spotify needs to be connected.");
      return;
    }

    setError(nextError instanceof Error ? nextError.message : fallbackMessage);
  }

  const refreshNowPlaying = async () => {
    const nextNowPlaying = await trackContextApi.getNowPlaying();
    setNowPlaying(nextNowPlaying);
    setError(null);
    setSpotifyAuthRequired(false);
  };

  const connectSpotify = async () => {
    if (spotifyAuthPending) {
      return;
    }

    setSpotifyAuthPending(true);
    setError(null);

    try {
      const url = await trackContextApi.getSpotifyLoginUrl();
      window.location.assign(url);
    } catch (nextError) {
      handleRequestError(nextError, "Failed to start Spotify login");
      setSpotifyAuthPending(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const nextNowPlaying = await trackContextApi.getNowPlaying();

        if (cancelled) {
          return;
        }

        setNowPlaying(nextNowPlaying);
        setError(null);
        setSpotifyAuthRequired(false);
      } catch (nextError) {
        if (cancelled) {
          return;
        }

        handleRequestError(nextError, "Failed to load now playing");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const intervalId = window.setInterval(() => {
      void (async () => {
        try {
          const nextNowPlaying = await trackContextApi.getNowPlaying();

          if (cancelled) {
            return;
          }

          setNowPlaying(nextNowPlaying);
          setError(null);
          setSpotifyAuthRequired(false);
        } catch (nextError) {
          if (!cancelled) {
            handleRequestError(nextError, "Failed to refresh now playing");
          }
        }
      })();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!nowPlaying?.isPlaying) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNowPlaying((currentNowPlaying) => {
        if (!currentNowPlaying || !currentNowPlaying.isPlaying) {
          return currentNowPlaying;
        }

        return {
          ...currentNowPlaying,
          progressMs: Math.min(
            currentNowPlaying.progressMs + PROGRESS_TICK_MS,
            currentNowPlaying.durationMs,
          ),
        };
      });
    }, PROGRESS_TICK_MS);

    return () => window.clearInterval(intervalId);
  }, [nowPlaying?.isPlaying]);

  const runTransportAction = async (action: () => Promise<void>) => {
    if (transportPending) {
      return;
    }

    setTransportPending(true);

    try {
      await action();
      await refreshNowPlaying();
    } catch (nextError) {
      handleRequestError(nextError, "Transport request failed");
    } finally {
      setTransportPending(false);
    }
  };

  const togglePlayback = async () => {
    if (!nowPlaying?.isControllable) {
      return;
    }

    await runTransportAction(() =>
      nowPlaying.isPlaying ? trackContextApi.pause() : trackContextApi.play(),
    );
  };

  const previousTrack = async () => {
    if (!nowPlaying?.isControllable) {
      return;
    }

    await runTransportAction(() => trackContextApi.previous());
  };

  const nextTrack = async () => {
    if (!nowPlaying?.isControllable) {
      return;
    }

    await runTransportAction(() => trackContextApi.next());
  };

  return {
    nowPlaying: nowPlaying ?? FALLBACK_NOW_PLAYING,
    loading,
    error,
    spotifyAuthRequired,
    spotifyAuthPending,
    transportPending,
    connectSpotify,
    togglePlayback,
    previousTrack,
    nextTrack,
  };
}
