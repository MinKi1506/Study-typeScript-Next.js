// src/pages/api/summarize.ts
import type { NextApiRequest, NextApiResponse } from "next"

// (선택) CORS: 프레이머/다른 도메인에서 호출할 수 있게
function cors(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*") // 필요하면 특정 도메인으로 제한
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  cors(res)
  if (req.method === "OPTIONS") return res.status(200).end()
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  try {
    const { text, prompt, model = "gpt-4o-mini", temperature = 0.3, maxTokens = 600 } = req.body || {}
    if (!text || typeof text !== "string") return res.status(400).json({ error: "Missing text" })

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" })

    const systemPrompt = (prompt && String(prompt)) || "다음 텍스트를 간결하고 핵심 위주로 요약해줘."
    const userContent = String(text).slice(0, 200_000)

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
      }),
    })

    if (!r.ok) {
      const detail = await r.text().catch(() => "")
      return res.status(500).json({ error: `OpenAI error ${r.status}`, detail })
    }

    const data = await r.json()
    const summary = data?.choices?.[0]?.message?.content?.trim?.() || ""
    return res.status(200).json({ summary })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Unknown error" })
  }
}
