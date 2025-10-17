// pages/api/summarize.ts
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })
  try {
    const { text, prompt, model = "gpt-4o-mini", temperature = 0.3, maxTokens = 600 } = req.body || {}
    if (!text || typeof text !== "string") return res.status(400).json({ error: "Missing text" })

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" })

    const sys = (prompt && String(prompt)) || "다음 텍스트를 간결하고 핵심 위주로 요약하세요."
    const user = text.slice(0, 200000) // 안전 가드

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
      }),
    })

    if (!r.ok) {
      const err = await r.text().catch(() => "")
      return res.status(500).json({ error: `OpenAI error ${r.status}`, detail: err })
    }

    const data = await r.json()
    const summary = data?.choices?.[0]?.message?.content?.trim?.() || ""
    return res.status(200).json({ summary })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Unknown error" })
  }
}
