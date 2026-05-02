export type ViewMode = "basic" | "vinyl" | "cassette";

export type BackgroundMode = "default" | "aurora" | "listening-booth" | "studio-shelf";

export type BackgroundMotion = "static" | "animated";

export type VinylStyle = "pristine" | "worn-jacket" | "crate-dig";

export type TurntableStyle = "sl1200" | "classic-woodgrain" | "none";

export type CassetteStyle = "clear-shell" | "smoked-shell" | "label-maker";

export type CassettePlayerStyle = "walkman" | "aiwa" | "hifi-deck";

export type DisplaySettings = {
  viewMode: ViewMode;
  backgroundMode: BackgroundMode;
  backgroundMotion: BackgroundMotion;
  vinylStyle: VinylStyle;
  turntableStyle: TurntableStyle;
  cassetteStyle: CassetteStyle;
  cassettePlayerStyle: CassettePlayerStyle;
};

export type BackgroundOption = {
  id: BackgroundMode;
  label: string;
  imageUrl: string | null;
};

export const DISPLAY_SETTINGS_STORAGE_KEY = "listening-room-display-settings";

export const defaultDisplaySettings: DisplaySettings = {
  viewMode: "basic",
  backgroundMode: "default",
  backgroundMotion: "static",
  vinylStyle: "pristine",
  turntableStyle: "sl1200",
  cassetteStyle: "clear-shell",
  cassettePlayerStyle: "walkman",
};

export const backgroundOptions: BackgroundOption[] = [
  {
    id: "default",
    label: "Default background",
    imageUrl: null,
  },
  {
    id: "aurora",
    label: "Aurora room",
    imageUrl: "/background-aurora-room.svg",
  },
  {
    id: "listening-booth",
    label: "Listening booth",
    imageUrl: "/background-listening-booth.svg",
  },
  {
    id: "studio-shelf",
    label: "Studio shelf",
    imageUrl: "/background-studio-shelf.svg",
  },
];

const backgroundOptionIds = new Set(backgroundOptions.map((option) => option.id));
const viewModeIds = new Set<ViewMode>(["basic", "vinyl", "cassette"]);
const backgroundMotionIds = new Set<BackgroundMotion>(["static", "animated"]);
const vinylStyleIds = new Set<VinylStyle>(["pristine", "worn-jacket", "crate-dig"]);
const turntableStyleIds = new Set<TurntableStyle>(["sl1200", "classic-woodgrain", "none"]);
const cassetteStyleIds = new Set<CassetteStyle>(["clear-shell", "smoked-shell", "label-maker"]);
const cassettePlayerStyleIds = new Set<CassettePlayerStyle>(["walkman", "aiwa", "hifi-deck"]);

function coerceSetting<T extends string>(value: unknown, allowed: Set<T>, fallback: T) {
  return typeof value === "string" && allowed.has(value as T) ? (value as T) : fallback;
}

export function getStoredDisplaySettings(): DisplaySettings {
  const storedValue = localStorage.getItem(DISPLAY_SETTINGS_STORAGE_KEY);

  if (!storedValue) {
    return defaultDisplaySettings;
  }

  try {
    const parsed = JSON.parse(storedValue) as Partial<DisplaySettings>;

    return {
      viewMode: coerceSetting(parsed.viewMode, viewModeIds, defaultDisplaySettings.viewMode),
      backgroundMode: coerceSetting(
        parsed.backgroundMode,
        backgroundOptionIds,
        defaultDisplaySettings.backgroundMode,
      ),
      backgroundMotion: coerceSetting(
        parsed.backgroundMotion,
        backgroundMotionIds,
        defaultDisplaySettings.backgroundMotion,
      ),
      vinylStyle: coerceSetting(parsed.vinylStyle, vinylStyleIds, defaultDisplaySettings.vinylStyle),
      turntableStyle: coerceSetting(
        parsed.turntableStyle,
        turntableStyleIds,
        defaultDisplaySettings.turntableStyle,
      ),
      cassetteStyle: coerceSetting(
        parsed.cassetteStyle,
        cassetteStyleIds,
        defaultDisplaySettings.cassetteStyle,
      ),
      cassettePlayerStyle: coerceSetting(
        parsed.cassettePlayerStyle,
        cassettePlayerStyleIds,
        defaultDisplaySettings.cassettePlayerStyle,
      ),
    };
  } catch {
    return defaultDisplaySettings;
  }
}

export function saveDisplaySettings(settings: DisplaySettings) {
  localStorage.setItem(DISPLAY_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function getSelectedBackground(settings: DisplaySettings) {
  return (
    backgroundOptions.find((option) => option.id === settings.backgroundMode) ??
    backgroundOptions[0]
  );
}
