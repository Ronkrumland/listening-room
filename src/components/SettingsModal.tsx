import { X } from "lucide-react";
import { FormEvent, MouseEvent, useState } from "react";
import { validateAndSaveToken } from "../api/trackContextApi";
import {
  BackgroundMotion,
  BackgroundMode,
  CassettePlayerStyle,
  CassetteStyle,
  DisplaySettings,
  TurntableStyle,
  ViewMode,
  VinylStyle,
  backgroundOptions,
} from "../displaySettings";

type SettingsModalProps = {
  displaySettings: DisplaySettings;
  onDisplaySettingsChange: (settings: DisplaySettings) => void;
  onClose: () => void;
};

const viewModeOptions: Array<{ id: ViewMode; label: string }> = [
  { id: "basic", label: "Basic Player" },
  { id: "vinyl", label: "Vinyl Player" },
  { id: "cassette", label: "Cassette Player" },
];

const vinylStyleOptions: Array<{ id: VinylStyle; label: string }> = [
  { id: "pristine", label: "Pristine" },
  { id: "worn-jacket", label: "Worn jacket" },
  { id: "crate-dig", label: "Crate dig" },
];

const turntableOptions: Array<{ id: TurntableStyle; label: string }> = [
  { id: "sl1200", label: "SL-1200" },
  { id: "classic-woodgrain", label: "Classic woodgrain" },
  { id: "none", label: "None" },
];

const cassetteStyleOptions: Array<{ id: CassetteStyle; label: string }> = [
  { id: "clear-shell", label: "Clear shell" },
  { id: "smoked-shell", label: "Smoked shell" },
  { id: "label-maker", label: "Label maker" },
];

const cassettePlayerOptions: Array<{ id: CassettePlayerStyle; label: string }> = [
  { id: "walkman", label: "Walkman" },
  { id: "aiwa", label: "Aiwa" },
  { id: "hifi-deck", label: "Hi-fi deck" },
];

export function SettingsModal({
  displaySettings,
  onDisplaySettingsChange,
  onClose,
}: SettingsModalProps) {
  const [token, setToken] = useState("");
  const [draftSettings, setDraftSettings] = useState(displaySettings);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token.trim() || loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await validateAndSaveToken(token.trim());
      setSuccess(true);
      setToken("");
      setTimeout(onClose, 1200);
    } catch {
      setError("Invalid token — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisplaySubmit = (e: FormEvent) => {
    e.preventDefault();
    onDisplaySettingsChange(draftSettings);
    setSettingsSaved(true);
    window.setTimeout(() => setSettingsSaved(false), 1400);
  };

  const updateDraftSettings = <Key extends keyof DisplaySettings>(
    key: Key,
    value: DisplaySettings[Key],
  ) => {
    setDraftSettings((current) => ({ ...current, [key]: value }));
    setSettingsSaved(false);
  };

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">Settings</h2>
          <button
            className="modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close settings"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
        <p className="modal-description">Tune the room display and replace the access token.</p>

        <form className="settings-panel" onSubmit={handleDisplaySubmit}>
          <fieldset className="settings-fieldset">
            <legend className="settings-legend">View mode</legend>
            <div className="mode-options" role="radiogroup" aria-label="View mode">
              {viewModeOptions.map((option) => (
                <label className="mode-option" key={option.id}>
                  <input
                    type="radio"
                    name="view-mode"
                    value={option.id}
                    checked={draftSettings.viewMode === option.id}
                    onChange={() => updateDraftSettings("viewMode", option.id)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="settings-fieldset">
            <legend className="settings-legend">Background</legend>
            <label className="settings-label" htmlFor="background-mode">
              Image
            </label>
            <select
              className="modal-input"
              id="background-mode"
              value={draftSettings.backgroundMode}
              onChange={(e) =>
                updateDraftSettings("backgroundMode", e.target.value as BackgroundMode)
              }
            >
              {backgroundOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            <label className="settings-label" htmlFor="background-motion">
              Motion
            </label>
            <select
              className="modal-input"
              id="background-motion"
              value={draftSettings.backgroundMotion}
              onChange={(e) =>
                updateDraftSettings("backgroundMotion", e.target.value as BackgroundMotion)
              }
            >
              <option value="static">Static background</option>
              <option value="animated">Animated background</option>
            </select>
          </fieldset>

          {draftSettings.viewMode === "vinyl" && (
            <fieldset className="settings-fieldset">
              <legend className="settings-legend">Vinyl look</legend>
              <label className="settings-label" htmlFor="vinyl-style">
                Vinyl style
              </label>
              <select
                className="modal-input"
                id="vinyl-style"
                value={draftSettings.vinylStyle}
                onChange={(e) => updateDraftSettings("vinylStyle", e.target.value as VinylStyle)}
              >
                {vinylStyleOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>

              <label className="settings-label" htmlFor="turntable-style">
                Turntable
              </label>
              <select
                className="modal-input"
                id="turntable-style"
                value={draftSettings.turntableStyle}
                onChange={(e) =>
                  updateDraftSettings("turntableStyle", e.target.value as TurntableStyle)
                }
              >
                {turntableOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </fieldset>
          )}

          {draftSettings.viewMode === "cassette" && (
            <fieldset className="settings-fieldset">
              <legend className="settings-legend">Cassette look</legend>
              <label className="settings-label" htmlFor="cassette-style">
                Cassette style
              </label>
              <select
                className="modal-input"
                id="cassette-style"
                value={draftSettings.cassetteStyle}
                onChange={(e) =>
                  updateDraftSettings("cassetteStyle", e.target.value as CassetteStyle)
                }
              >
                {cassetteStyleOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>

              <label className="settings-label" htmlFor="cassette-player-style">
                Cassette player
              </label>
              <select
                className="modal-input"
                id="cassette-player-style"
                value={draftSettings.cassettePlayerStyle}
                onChange={(e) =>
                  updateDraftSettings(
                    "cassettePlayerStyle",
                    e.target.value as CassettePlayerStyle,
                  )
                }
              >
                {cassettePlayerOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </fieldset>
          )}

          {draftSettings.viewMode === "basic" && (
            <p className="settings-note">
              Basic Player keeps the current artwork-forward layout with your selected background.
            </p>
          )}

          {settingsSaved && <p className="modal-success">Display settings saved!</p>}
          <button className="modal-submit" type="submit">
            Save Display
          </button>
        </form>

        <form className="modal-form token-form" onSubmit={handleSubmit}>
          <label className="settings-label" htmlFor="access-token">
            Access token
          </label>
          <input
            className="modal-input"
            id="access-token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste new token"
            autoComplete="off"
            spellCheck={false}
          />
          {error && <p className="modal-error" role="alert">{error}</p>}
          {success && <p className="modal-success">Token saved!</p>}
          <button
            className="modal-submit modal-submit-secondary"
            type="submit"
            disabled={!token.trim() || loading}
          >
            {loading ? "Checking..." : "Save Token"}
          </button>
        </form>
      </div>
    </div>
  );
}
