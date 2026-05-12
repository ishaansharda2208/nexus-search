// ─── SetupScreen ─────────────────────────────────────────────────────────────
import { useState } from "react";

export function SetupScreen({ onComplete }) {
  const [provider, setProvider] = useState("claude");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!apiKey.trim()) {
      setError("Please enter your API key.");
      return;
    }
    if (apiKey.trim().length < 20) {
      setError("That doesn't look like a valid API key.");
      return;
    }
    onComplete({ provider, apiKey: apiKey.trim() });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <div className="setup-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Nexus</span>
        </div>

        <div className="setup-header">
          <h1>AI Product Search</h1>
          <p>Connect your LLM to search 1,000+ electronics with natural language.</p>
        </div>

        <div className="form-group">
          <label>LLM Provider</label>
          <div className="provider-tabs">
            {[
              { id: "claude", label: "Claude", hint: "Anthropic" },
              { id: "openai", label: "GPT-4o", hint: "OpenAI" },
            ].map((p) => (
              <button
                key={p.id}
                className={`provider-tab ${provider === p.id ? "active" : ""}`}
                onClick={() => setProvider(p.id)}
              >
                <span className="tab-label">{p.label}</span>
                <span className="tab-hint">{p.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="apikey">
            {provider === "claude" ? "Anthropic" : "OpenAI"} API Key
          </label>
          <div className="input-wrapper">
            <input
              id="apikey"
              type={showKey ? "text" : "password"}
              placeholder={
                provider === "claude"
                  ? "sk-ant-api03-..."
                  : "sk-proj-..."
              }
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck="false"
            />
            <button
              className="toggle-visibility"
              onClick={() => setShowKey(!showKey)}
              aria-label="Toggle key visibility"
            >
              {showKey ? "👁️" : "🙈"}
            </button>
          </div>
          {error && <span className="field-error">{error}</span>}
        </div>

        <div className="security-note">
          <span className="lock-icon">🔒</span>
          Your key is stored only in memory and never sent to our servers.
        </div>

        <button className="btn-connect" onClick={handleSubmit}>
          Connect & Start Searching
          <span className="btn-arrow">→</span>
        </button>

        <div className="catalog-stats">
          <div className="stat">
            <span className="stat-num">400</span>
            <span className="stat-label">Phones</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">300</span>
            <span className="stat-label">TVs</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">300</span>
            <span className="stat-label">Laptops</span>
          </div>
        </div>
      </div>
    </div>
  );
}
