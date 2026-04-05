import { FormEvent, useState } from "react";
import { validateAndSaveToken } from "../api/trackContextApi";

type AuthModalProps = {
  onAuthenticated: () => void;
};

export function AuthModal({ onAuthenticated }: AuthModalProps) {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      await validateAndSaveToken(token.trim());
      onAuthenticated();
    } catch {
      setError("Invalid token — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">Access Token Required</h2>
        <p className="modal-description">Enter your token to use this player.</p>
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            className="modal-input"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your token"
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
          {error && <p className="modal-error" role="alert">{error}</p>}
          <button
            className="modal-submit"
            type="submit"
            disabled={!token.trim() || loading}
          >
            {loading ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}
