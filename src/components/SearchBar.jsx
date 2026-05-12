// ─── SearchBar ────────────────────────────────────────────────────────────────
import { useState } from "react";

const SUGGESTIONS = [
  "I want a phone under $500",
  "Show me black laptops over $1000",
  "TVs under $800",
  "White phones between $300 and $700",
  "Gaming laptops over $1500",
  "55 inch TV under $600",
];

export function SearchBar({ onSearch, onReset, isLoading, isIdle }) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = () => {
    if (!query.trim() || isLoading) return;
    setShowSuggestions(false);
    onSearch(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") setShowSuggestions(false);
  };

  const handleSuggestion = (s) => {
    setQuery(s);
    setShowSuggestions(false);
    onSearch(s);
  };

  const handleClear = () => {
    setQuery("");
    onReset();
  };

  return (
    <div className="search-container">
      <div className="search-bar-wrapper">
        <div className={`search-bar ${isLoading ? "searching" : ""}`}>
          <span className="search-icon">
            {isLoading ? (
              <span className="spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            )}
          </span>

          <input
            type="text"
            placeholder="Try: phones under $500, black laptops, TVs over $1000..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            disabled={isLoading}
          />

          {query && !isLoading && (
            <button className="clear-btn" onClick={handleClear} aria-label="Clear search">
              ✕
            </button>
          )}

          <button
            className="search-btn"
            onClick={handleSubmit}
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>

        {showSuggestions && isIdle && (
          <div className="suggestions-dropdown">
            <div className="suggestions-label">Try these searches</div>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="suggestion-item"
                onMouseDown={() => handleSuggestion(s)}
              >
                <span className="suggestion-icon">→</span>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
