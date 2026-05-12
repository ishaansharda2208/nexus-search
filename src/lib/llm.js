// ─── LLM Abstraction ─────────────────────────────────────────────────────────
// Supports both Claude (Anthropic) and OpenAI.
// Sends ONLY the user query — product catalog never leaves the client.

const SYSTEM_PROMPT = `You are a product search query parser for an electronics store.
You parse natural language queries into structured JSON for filtering phones, TVs, and laptops.

You MUST respond with ONLY a valid JSON object — no explanation, no markdown, no extra text.

ALLOWED categories (use for the "search" field): phone, tv, laptop
ALLOWED filter keys (use ONLY these, no others):
  - price_less_than  (numeric, USD)
  - price_more_than  (numeric, USD)
  - color            (string, e.g. "black", "white", "blue")

Response format:
{
  "search": "<category or null>",
  "filter": [
    { "key": "<allowed_key>", "value": "<value>" }
  ]
}

Rules:
1. If the query is NOT about electronics/phones/TVs/laptops, return: {"search": null, "filter": []}
2. If no filters apply, return an empty array for filter.
3. NEVER invent filter keys outside the allowed list.
4. "search" must be one of: "phone", "tv", "laptop", or null.
5. Extract price numbers as plain integers (no $ signs).
6. Extract colors as lowercase single words.

Examples:
  "I want a phone under $500" → {"search": "phone", "filter": [{"key": "price_less_than", "value": "500"}]}
  "Show me black laptops over $1000" → {"search": "laptop", "filter": [{"key": "color", "value": "black"}, {"key": "price_more_than", "value": "1000"}]}
  "What is the weather today?" → {"search": null, "filter": []}`;

// ── Claude (Anthropic) ───────────────────────────────────────────────────────
async function queryClaudeAPI(apiKey, userQuery) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userQuery }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "";
  return parseJSON(text);
}

// ── OpenAI ───────────────────────────────────────────────────────────────────
async function queryOpenAIAPI(apiKey, userQuery) {
  const response = await fetch("/api/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-openai-key": apiKey,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 256,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userQuery },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  return parseJSON(text);
}

// ── JSON Parser with guardrails ───────────────────────────────────────────────
function parseJSON(raw) {
  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    // Enforce shape
    const result = {
      search: null,
      filter: [],
    };

    if (["phone", "tv", "laptop"].includes(parsed.search)) {
      result.search = parsed.search;
    }

    const ALLOWED_FILTER_KEYS = ["price_less_than", "price_more_than", "color"];
    if (Array.isArray(parsed.filter)) {
      result.filter = parsed.filter.filter(
        (f) => f && ALLOWED_FILTER_KEYS.includes(f.key) && f.value !== undefined
      );
    }

    return result;
  } catch {
    throw new Error("Failed to parse LLM response as JSON.");
  }
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function queryLLM({ provider, apiKey, query }) {
  if (!apiKey?.trim()) throw new Error("API key is required.");
  if (!query?.trim()) throw new Error("Query cannot be empty.");

  if (provider === "claude") return queryClaudeAPI(apiKey.trim(), query.trim());
  if (provider === "openai") return queryOpenAIAPI(apiKey.trim(), query.trim());
  throw new Error(`Unknown provider: ${provider}`);
}
