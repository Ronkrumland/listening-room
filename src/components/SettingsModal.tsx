import { X } from "lucide-react";
import { FormEvent, useState } from "react";
import { validateAndSaveToken } from "../api/trackContextApi";

type SettingsModalProps = {
  onClose: () => void;
};

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [token, setToken] = useState("");
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

  const handleOverlayClick = (e: React.MouseEvent) => {
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
        <p className="modal-description">Replace the current access token.</p>
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            className="modal-input"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste new token"
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
          {error && <p className="modal-error" role="alert">{error}</p>}
          {success && <p className="modal-success">Token saved!</p>}
          <button
            className="modal-submit"
            type="submit"
            disabled={!token.trim() || loading}
          >
            {loading ? "Checking…" : "Save Token"}
          </button>
        </form>
      </div>
    </div>
  );
}
