// ─── App ──────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { SetupScreen } from "./components/SetupScreen";
import { SearchBar } from "./components/SearchBar";
import { ResultsPanel } from "./components/ResultsPanel";
import { useSearch } from "./hooks/useSearch";
import { TOTAL_COUNT } from "./data/products";
import "./styles.css";

export default function App() {
  const [credentials, setCredentials] = useState(null);

  const {
    search,
    reset,
    status,
    results,
    appliedFilters,
    ignoredFilters,
    searchTerm,
    llmResponse,
    error,
    lastQuery,
    isLoading,
    isIdle,
    isSuccess,
    isError,
  } = useSearch(credentials || {});

  const handleDisconnect = () => {
    setCredentials(null);
    reset();
  };

  if (!credentials) {
    return <SetupScreen onComplete={setCredentials} />;
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Nexus</span>
            <span className="header-tagline">AI Product Search</span>
          </div>

          <div className="header-right">
            <div className="provider-pill">
              <span className="provider-dot" />
              {credentials.provider === "claude" ? "Claude" : "GPT-4o"}
            </div>
            <span className="catalog-pill">{TOTAL_COUNT.toLocaleString()} products</span>
            <button className="disconnect-btn" onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        </div>
      </header>

      {/* Hero + Search */}
      <section className="search-section">
        {isIdle && (
          <div className="hero-text">
            <h1>Find your next <span className="hero-accent">device</span></h1>
            <p>Describe what you're looking for in plain English.</p>
          </div>
        )}

        <SearchBar
          onSearch={search}
          onReset={reset}
          isLoading={isLoading}
          isIdle={isIdle}
        />
      </section>

      {/* Main content */}
      <main className="app-main">
        {isIdle && (
          <div className="idle-categories">
            {[
              { icon: "📱", label: "Phones", hint: "400 models", q: "Show me all phones" },
              { icon: "📺", label: "TVs", hint: "300 models", q: "Show me all TVs" },
              { icon: "💻", label: "Laptops", hint: "300 models", q: "Show me all laptops" },
            ].map((c) => (
              <button
                key={c.label}
                className="category-card"
                onClick={() => search(c.q)}
              >
                <span className="category-icon">{c.icon}</span>
                <span className="category-label">{c.label}</span>
                <span className="category-hint">{c.hint}</span>
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="loading-state">
            <div className="loading-orb" />
            <p>Analysing your query with AI...</p>
            <span className="loading-hint">Catalog stays local — only your query is sent</span>
          </div>
        )}

        {isError && (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {isSuccess && (
          <ResultsPanel
            results={results}
            appliedFilters={appliedFilters}
            ignoredFilters={ignoredFilters}
            searchTerm={searchTerm}
            llmResponse={llmResponse}
            lastQuery={lastQuery}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Catalog processed locally · AI query parsing via {credentials.provider === "claude" ? "Anthropic Claude" : "OpenAI GPT-4o"}</p>
      </footer>
    </div>
  );
}
