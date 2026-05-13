import { useState, useCallback } from "react";
import { applyFilters } from "../lib/filterEngine";
import { PRODUCTS } from "../data/products";

const SYSTEM_PROMPT = `You are a product search query parser for an electronics store. You parse natural language queries into structured JSON for filtering phones, TVs, and laptops. You MUST respond with ONLY a valid JSON object. ALLOWED categories: phone, tv, laptop. ALLOWED filter keys: price_less_than, price_more_than, color. Response format: {"search": "<category or null>", "filter": [{"key": "<allowed_key>", "value": "<value>"}]}. Rules: 1. If not about electronics return {"search": null, "filter": []}. 2. prices are plain integers. 3. colors are lowercase. Examples: "phone under 500" gives {"search":"phone","filter":[{"key":"price_less_than","value":"500"}]}.`;

async function callGroq(query) {
  const response = await fetch("/api/groq", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-groq-key": "server" },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      max_tokens: 256,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: query }],
      response_format: { type: "json_object" },
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Search failed: " + response.status);
  }
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);
  const result = { search: null, filter: [] };
  if (["phone", "tv", "laptop"].includes(parsed.search)) result.search = parsed.search;
  const ALLOWED = ["price_less_than", "price_more_than", "color"];
  if (Array.isArray(parsed.filter)) result.filter = parsed.filter.filter((f) => f && ALLOWED.includes(f.key) && f.value !== undefined);
  return result;
}

export function useSearch() {
  const [status, setStatus] = useState("idle");
  const [results, setResults] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [ignoredFilters, setIgnoredFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [llmResponse, setLlmResponse] = useState(null);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState("");

  const search = useCallback(async (query) => {
    if (!query.trim()) return;
    setLastQuery(query);
    setStatus("loading");
    setError(null);
    try {
      const llmResult = await callGroq(query);
      setLlmResponse(llmResult);
      if (llmResult.search === null && llmResult.filter.length === 0) {
        setResults([]); setAppliedFilters([]); setIgnoredFilters([]); setSearchTerm(null);
        setStatus("error");
        setError("I couldn't find relevant products for that query. Try searching for phones, TVs, or laptops.");
        return;
      }
      const filtered = applyFilters(PRODUCTS, llmResult);
      setResults(filtered.results);
      setAppliedFilters(filtered.appliedFilters);
      setIgnoredFilters(filtered.ignoredFilters);
      setSearchTerm(filtered.searchTerm);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle"); setResults([]); setAppliedFilters([]); setIgnoredFilters([]);
    setSearchTerm(null); setLlmResponse(null); setError(null); setLastQuery("");
  }, []);

  return { search, reset, status, results, appliedFilters, ignoredFilters, searchTerm, llmResponse, error, lastQuery, isLoading: status === "loading", isIdle: status === "idle", isSuccess: status === "success", isError: status === "error" };
}
