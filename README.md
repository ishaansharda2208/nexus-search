# ⚡ Nexus — AI Product Search

A natural language product recommendation engine powered by Claude or GPT-4o.  
Search 1,000 electronics (phones, TVs, laptops) with plain English.

---

## Features

- 🤖 **LLM-powered parsing** — Every search goes through Claude or GPT-4o
- 🔒 **Privacy-first** — Product catalog stays in memory, only your query is sent to the LLM
- ⚡ **Instant filtering** — Results filtered client-side in milliseconds
- 🛡️ **Guardrails** — LLM strictly returns structured JSON; only whitelisted filter keys are applied
- 📱 **Responsive** — Works on desktop and mobile

---

## Stack

- **React 18** + Vite
- **No backend** — pure client-side SPA
- **LLM**: Anthropic Claude (claude-sonnet-4-20250514) or OpenAI GPT-4o-mini

---

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173, enter your API key, and start searching.

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option B — GitHub + Vercel Dashboard

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Framework preset: **Vite**
5. Build command: `npm run build`
6. Output directory: `dist`
7. Click **Deploy**

No environment variables required — users provide their own API keys at runtime.

---

## Architecture

```
User query
  │
  ▼
LLM (Claude / GPT-4o)
  │  System prompt with strict JSON schema + guardrails
  ▼
Parsed JSON: { search, filter[] }
  │
  ▼
Filter Engine (client-side)
  │  Whitelisted keys: price_less_than, price_more_than, color
  │  Unknown keys → silently ignored
  ▼
In-memory product catalog (1,000 products)
  │
  ▼
Results grid
```

---

## Supported Filter Keys

| Key | Example |
|---|---|
| `price_less_than` | "phones under $500" |
| `price_more_than` | "laptops over $1000" |
| `color` | "white TVs" |

Any other key the LLM might return is **ignored** by the JS application.

---

## Example Queries

- "I want a phone under $500"
- "Show me black laptops over $1000"
- "TVs under $800"
- "White phones"
- "Gaming laptops over $1500"

---

## Product Catalog

Generated deterministically at runtime (no external data needed):

| Category | Count |
|---|---|
| Phones | 400 |
| TVs | 300 |
| Laptops | 300 |
| **Total** | **1,000** |
