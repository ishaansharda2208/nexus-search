// ─── useSearch Hook ───────────────────────────────────────────────────────────
import { useState, useCallback } from "react";
import { queryLLM } from "../lib/llm";
import { applyFilters } from "../lib/filterEngine";
import { PRODUCTS } from "../data/products";

const IDLE = "idle";
const LOADING = "loading";
const SUCCESS = "success";
const ERROR = "error";

export function useSearch(credentials) {
  const [status, setStatus] = useState(IDLE);
  const [results, setResults] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [ignoredFilters, setIgnoredFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [llmResponse, setLlmResponse] = useState(null);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState("");

  const search = useCallback(
    async (query) => {
      if (!query.trim()) return;
      setLastQuery(query);
      setStatus(LOADING);
      setError(null);
      setLlmResponse(null);

      try {
        const llmResult = await queryLLM({
          provider: credentials.provider,
          apiKey: credentials.apiKey,
          query,
        });

        setLlmResponse(llmResult);

        // Off-topic query — LLM returns null search
        if (llmResult.search === null && llmResult.filter.length === 0) {
          setResults([]);
          setAppliedFilters([]);
          setIgnoredFilters([]);
          setSearchTerm(null);
          setStatus(ERROR);
          setError("I couldn't find any relevant products for that query. Try searching for phones, TVs, or laptops.");
          return;
        }

        const filtered = applyFilters(PRODUCTS, llmResult);
        setResults(filtered.results);
        setAppliedFilters(filtered.appliedFilters);
        setIgnoredFilters(filtered.ignoredFilters);
        setSearchTerm(filtered.searchTerm);
        setStatus(SUCCESS);
      } catch (err) {
        setStatus(ERROR);
        setError(err.message || "Something went wrong. Please try again.");
      }
    },
    [credentials]
  );

  const reset = useCallback(() => {
    setStatus(IDLE);
    setResults([]);
    setAppliedFilters([]);
    setIgnoredFilters([]);
    setSearchTerm(null);
    setLlmResponse(null);
    setError(null);
    setLastQuery("");
  }, []);

  return {
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
    isLoading: status === LOADING,
    isIdle: status === IDLE,
    isSuccess: status === SUCCESS,
    isError: status === ERROR,
  };
}
