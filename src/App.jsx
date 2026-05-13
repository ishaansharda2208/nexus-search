import { useSearch } from "./hooks/useSearch";
import { SearchBar } from "./components/SearchBar";
import { ResultsPanel } from "./components/ResultsPanel";
import { TOTAL_COUNT } from "./data/products";
import "./styles.css";

const CREDENTIALS = { provider: "groq", apiKey: "server" };

export default function App() {
  const {
    search, reset, results, appliedFilters, ignoredFilters,
    searchTerm, llmResponse, error, lastQuery,
    isLoading, isIdle, isSuccess, isError,
  } = useSearch(CREDENTIALS);

  return (
    <div className="app">
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
              Powered by Groq
            </div>
            <span className="catalog-pill">{TOTAL_COUNT.toLocaleString()} products</span>
          </div>
        </div>
      </header>

      <section className="search-section">
        {isIdle && (
          <div className="hero-text">
            <h1>Find your next <span className="hero-accent">device</span></h1>
            <p>Describe what you're looking for in plain English.</p>
          </div>
        )}
        <SearchBar onSearch={search} onReset={reset} isLoading={isLoading} isIdle={isIdle} />
      </section>

      <main className="app-main">
        {isIdle && (
          <div className="idle-categories">
            {[
              { icon: "📱", label: "Phones", hint: "400 models", q: "Show me all phones" },
              { icon: "📺", label: "TVs", hint: "300 models", q: "Show me all TVs" },
              { icon: "💻", label: "Laptops", hint: "300 models", q: "Show me all laptops" },
            ].map((c) => (
              <button key={c.label} className="category-card" onClick={() => search(c.q)}>
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
            <span className="loading-hint">Powered by Groq · Llama 3</span>
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
        <p>Catalog processed locally · AI query parsing via Groq · Llama 3</p>
      </footer>
    </div>
  );
}
