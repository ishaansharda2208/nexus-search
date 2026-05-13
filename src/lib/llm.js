const SYSTEM_PROMPT = `You are a product search query parser for an electronics store. You parse natural language queries into structured JSON for filtering phones, TVs, and laptops. You MUST respond with ONLY a valid JSON object. ALLOWED categories: phone, tv, laptop. ALLOWED filter keys: price_less_than, price_more_than, color. Response format: {"search": "<category or null>", "filter": [{"key": "<allowed_key>", "value": "<value>"}]}. Rules: 1. If not about electronics return {"search": null, "filter": []}. 2. search must be phone, tv, laptop, or null. 3. prices are plain integers. 4. colors are lowercase. Examples: "phone under 500" gives {"search":"phone","filter":[{"key":"price_less_than","value":"500"}]}. "black laptops over 1000" gives {"search":"laptop","filter":[{"key":"color","value":"black"},{"key":"price_more_than","value":"1000"}]}.`;

async function queryClaudeAPI(apiKey, userQuery) {
  const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 256, system: SYSTEM_PROMPT, messages: [{ role: "user", content: userQuery }] }) });
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e?.error?.message || "Claude error: " + r.status); }
  const d = await r.json(); return parseJSON(d.content?.[0]?.text || "");
}

async function queryOpenAIAPI(apiKey, userQuery) {
  const r = await fetch("/api/openai", { method: "POST", headers: { "Content-Type": "application/json", "x-openai-key": apiKey }, body: JSON.stringify({ model: "gpt-4o-mini", max_tokens: 256, messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: userQuery }], response_format: { type: "json_object" } }) });
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e?.error?.message || "OpenAI error: " + r.status); }
  const d = await r.json(); return parseJSON(d.choices?.[0]?.message?.content || "");
}

async function queryGroqAPI(apiKey, userQuery) {
  const r = await fetch("/api/groq", { method: "POST", headers: { "Content-Type": "application/json", "x-groq-key": apiKey }, body: JSON.stringify({ model: "llama3-8b-8192", max_tokens: 256, messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: userQuery }], response_format: { type: "json_object" } }) });
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e?.error?.message || "Groq error: " + r.status); }
  const d = await r.json(); return parseJSON(d.choices?.[0]?.message?.content || "");
}

async function queryGeminiAPI(apiKey, userQuery) {
  const prompt = SYSTEM_PROMPT + "\n\nUser query: " + userQuery + "\n\nRespond with ONLY the JSON object:";
  const r = await fetch("/api/gemini", { method: "POST", headers: { "Content-Type": "application/json", "x-gemini-key": apiKey }, body: JSON.stringify({ prompt }) });
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e?.error?.message || "Gemini error: " + r.status); }
  const d = await r.json(); return parseJSON(d.candidates?.[0]?.content?.parts?.[0]?.text || "");
}

function parseJSON(raw) {
  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    const result = { search: null, filter: [] };
    if (["phone", "tv", "laptop"].includes(parsed.search)) result.search = parsed.search;
    const ALLOWED = ["price_less_than", "price_more_than", "color"];
    if (Array.isArray(parsed.filter)) result.filter = parsed.filter.filter((f) => f && ALLOWED.includes(f.key) && f.value !== undefined);
    return result;
  } catch { throw new Error("Failed to parse LLM response as JSON."); }
}

export async function queryLLM({ provider, apiKey, query }) {
  if (!apiKey?.trim()) throw new Error("API key is required.");
  if (!query?.trim()) throw new Error("Query cannot be empty.");
  if (provider === "claude") return queryClaudeAPI(apiKey.trim(), query.trim());
  if (provider === "openai") return queryOpenAIAPI(apiKey.trim(), query.trim());
  if (provider === "groq")   return queryGroqAPI(apiKey.trim(), query.trim());
  if (provider === "gemini") return queryGeminiAPI(apiKey.trim(), query.trim());
  throw new Error("Unknown provider: " + provider);
}
