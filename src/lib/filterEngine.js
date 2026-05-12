// ─── Filter Engine ────────────────────────────────────────────────────────────
// Applies structured LLM output to the in-memory product catalog.
// Only processes WHITELISTED filter keys — anything else is silently ignored.

const ALLOWED_FILTERS = {
  price_less_than: (product, value) => product.price < Number(value),
  price_more_than: (product, value) => product.price > Number(value),
  color: (product, value) =>
    product.color.toLowerCase().includes(value.toLowerCase()),
};

/**
 * @param {Array} products    - Full product catalog
 * @param {Object} llmResult  - { search: string|null, filter: Array<{key, value}> }
 * @returns {{ results: Array, appliedFilters: Array, ignoredFilters: Array, searchTerm: string|null }}
 */
export function applyFilters(products, llmResult) {
  const { search, filter } = llmResult;

  const appliedFilters = [];
  const ignoredFilters = [];

  // Categorise filters
  (filter || []).forEach((f) => {
    if (ALLOWED_FILTERS[f.key]) {
      appliedFilters.push(f);
    } else {
      ignoredFilters.push(f);
    }
  });

  let results = [...products];

  // 1. Category search
  if (search) {
    results = results.filter((p) => p.category === search);
  }

  // 2. Apply whitelisted filters
  appliedFilters.forEach(({ key, value }) => {
    results = results.filter((product) => ALLOWED_FILTERS[key](product, value));
  });

  return {
    results,
    appliedFilters,
    ignoredFilters,
    searchTerm: search,
  };
}

/**
 * Format a filter for display in the UI
 */
export function formatFilter({ key, value }) {
  switch (key) {
    case "price_less_than":
      return `Under $${Number(value).toLocaleString()}`;
    case "price_more_than":
      return `Over $${Number(value).toLocaleString()}`;
    case "color":
      return value.charAt(0).toUpperCase() + value.slice(1);
    default:
      return `${key}: ${value}`;
  }
}

export const ALLOWED_FILTER_KEYS = Object.keys(ALLOWED_FILTERS);
