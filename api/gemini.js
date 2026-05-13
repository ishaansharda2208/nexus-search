export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const apiKey = req.headers["x-gemini-key"];
  if (!apiKey) return res.status(400).json({ error: "Missing API key" });
  try {
    const { prompt } = req.body;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0, maxOutputTokens: 256 } }),
    });
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) { return res.status(500).json({ error: err.message }); }
}
