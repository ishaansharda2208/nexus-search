import { useState } from "react";
const PROVIDERS = [
  { id: "groq",   label: "Groq",   hint: "Free",      badge: "FREE", placeholder: "gsk_...",          url: "console.groq.com" },
  { id: "gemini", label: "Gemini", hint: "Google AI", badge: "FREE", placeholder: "AIza...",          url: "aistudio.google.com" },
  { id: "claude", label: "Claude", hint: "Anthropic", badge: null,   placeholder: "sk-ant-api03-...", url: "console.anthropic.com" },
  { id: "openai", label: "GPT-4o", hint: "OpenAI",   badge: null,   placeholder: "sk-proj-...",      url: "platform.openai.com" },
];
export function SetupScreen({ onComplete }) {
  const [provider, setProvider] = useState("groq");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");
  const current = PROVIDERS.find((p) => p.id === provider);
  const handleSubmit = () => {
    if (!apiKey.trim()) { setError("Please enter your API key."); return; }
    if (apiKey.trim().length < 10) { setError("That doesn't look like a valid API key."); return; }
    onComplete({ provider, apiKey: apiKey.trim() });
  };
  return (
    <div className="setup-screen">
      <div className="setup-card">
        <div className="setup-logo"><span className="logo-icon">⚡</span><span className="logo-text">Nexus</span></div>
        <div className="setup-header"><h1>AI Product Search</h1><p>Connect your LLM to search 1,000+ electronics with natural language.</p></div>
        <div className="form-group">
          <label>Choose your LLM Provider</label>
          <div className="provider-tabs" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
            {PROVIDERS.map((p) => (
              <button key={p.id} className={`provider-tab ${provider === p.id ? "active" : ""}`} onClick={() => { setProvider(p.id); setApiKey(""); setError(""); }}>
                <span className="tab-label">{p.label}</span>
                {p.badge ? <span style={{ fontSize: 9, background: "rgba(0,229,255,0.2)", color: "#00e5ff", border: "1px solid rgba(0,229,255,0.4)", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>{p.badge}</span> : <span className="tab-hint">{p.hint}</span>}
              </button>
            ))}
          </div>
        </div>
        {(provider === "groq" || provider === "gemini") && (
          <div className="security-note" style={{ marginBottom: 16, borderColor: "rgba(0,229,255,0.3)", background: "rgba(0,229,255,0.05)" }}>
            <span>🎉</span><span><strong>{current.label} is 100% free</strong> — no credit card! Get your key at <strong>{current.url}</strong></span>
          </div>
        )}
        <div className="form-group">
          <label>{current.label} API Key <a href={`https://${current.url}`} target="_blank" rel="noreferrer" style={{ marginLeft: 8, fontSize: 11, color: "var(--accent-2)", textDecoration: "none" }}>Get key →</a></label>
          <div className="input-wrapper">
            <input type={showKey ? "text" : "password"} placeholder={current.placeholder} value={apiKey} onChange={(e) => { setApiKey(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} autoComplete="off" spellCheck="false" />
            <button className="toggle-visibility" onClick={() => setShowKey(!showKey)}>{showKey ? "👁️" : "🙈"}</button>
          </div>
          {error && <span className="field-error">{error}</span>}
        </div>
        <div className="security-note"><span className="lock-icon">🔒</span>Your key is stored only in memory — never saved or sent to our servers.</div>
        <button className="btn-connect" onClick={handleSubmit}>Connect & Start Searching <span className="btn-arrow">→</span></button>
        <div className="catalog-stats">
          <div className="stat"><span className="stat-num">400</span><span className="stat-label">Phones</span></div>
          <div className="stat-divider" />
          <div className="stat"><span className="stat-num">300</span><span className="stat-label">TVs</span></div>
          <div className="stat-divider" />
          <div className="stat"><span className="stat-num">300</span><span className="stat-label">Laptops</span></div>
        </div>
      </div>
    </div>
  );
}
