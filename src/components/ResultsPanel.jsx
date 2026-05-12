// ─── ResultsPanel ─────────────────────────────────────────────────────────────
import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { formatFilter } from "../lib/filterEngine";

const PAGE_SIZE = 24;

const CATEGORY_LABELS = {
  phone: "📱 Phones",
  tv: "📺 TVs",
  laptop: "💻 Laptops",
};

export function ResultsPanel({
  results,
  appliedFilters,
  ignoredFilters,
  searchTerm,
  llmResponse,
  lastQuery,
}) {
  const [page, setPage] = useState(1);
  const [showDebug, setShowDebug] = useState(false);

  const paginated = results.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < results.length;

  return (
    <div className="results-panel">
      {/* Results summary bar */}
      <div className="results-meta">
        <div className="results-summary">
          <span className="results-count">{results.length.toLocaleString()}</span>
          <span className="results-label">
            {searchTerm ? CATEGORY_LABELS[searchTerm] : "products"} found
          </span>
          {lastQuery && (
            <span className="results-query">for "{lastQuery}"</span>
          )}
        </div>

        <button
          className="debug-toggle"
          onClick={() => setShowDebug(!showDebug)}
        >
          {showDebug ? "Hide" : "Show"} LLM Response
        </button>
      </div>

      {/* Active filter badges */}
      {appliedFilters.length > 0 && (
        <div className="filter-badges">
          <span className="badges-label">Filters applied:</span>
          {appliedFilters.map((f, i) => (
            <span key={i} className={`filter-badge badge-${f.key}`}>
              {f.key === "price_less_than" && "↓"}
              {f.key === "price_more_than" && "↑"}
              {f.key === "color" && "◉"}
              {" "}{formatFilter(f)}
            </span>
          ))}
        </div>
      )}

      {/* Ignored filters notice */}
      {ignoredFilters.length > 0 && (
        <div className="ignored-filters">
          ⚠️ Some filters were not applied (unsupported keys):{" "}
          {ignoredFilters.map((f) => f.key).join(", ")}
        </div>
      )}

      {/* LLM Debug panel */}
      {showDebug && llmResponse && (
        <div className="debug-panel">
          <div className="debug-header">
            <span className="debug-title">LLM Parsed Response</span>
            <span className="debug-hint">Raw JSON returned by the model</span>
          </div>
          <pre className="debug-json">{JSON.stringify(llmResponse, null, 2)}</pre>
        </div>
      )}

      {/* No results */}
      {results.length === 0 && (
        <div className="no-results">
          <span className="no-results-icon">🔍</span>
          <p>No products match your criteria.</p>
          <p className="no-results-hint">Try adjusting your price range or removing filters.</p>
        </div>
      )}

      {/* Product grid */}
      {results.length > 0 && (
        <>
          <div className="product-grid">
            {paginated.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {hasMore && (
            <div className="load-more-wrapper">
              <button
                className="load-more-btn"
                onClick={() => setPage((p) => p + 1)}
              >
                Load more ({results.length - paginated.length} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
