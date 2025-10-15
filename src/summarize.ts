// api/summarize.ts
import OpenAI from "openai"
import fs from "fs"
import path from "path"

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405 })
    }

    // ✅ 1️⃣ 사용자로부터 'page' 값 받기
    const { page = 1 } = await req.json()

    // ✅ 2️⃣ 전체 페이지 수 (프로토타입에서는 고정값)
    const TOTAL_PAGES = 20 // 예: 텍스트를 20페이지 분량으로 간주

    // 페이지 값이 유효한 범위인지 확인
    const currentPage = Math.min(Math.max(page, 1), TOTAL_PAGES)

    // ✅ 3️⃣ txt 파일 읽기
    const filePath = path.join(process.cwd(), "public", "texts", "novel.txt")
    const fullText = fs.readFileSync(filePath, "utf-8")

    // ✅ 4️⃣ 페이지 비율 계산 후, 그만큼 텍스트 추출
    const percent = (currentPage / TOTAL_PAGES) * 100
    const cutLength = Math.floor((fullText.length * currentPage) / TOTAL_PAGES)
    const slicedText = fullText.slice(0, cutLength)

    // ✅ 5️⃣ 요약 프롬프트 구성
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const prompt = `
      아래 글은 작품 전체의 약 ${percent.toFixed(1)}% (페이지 ${currentPage}/${TOTAL_PAGES}) 지점까지의 내용입니다.
      이 구간까지만 간결하게 요약해줘.

      ${slicedText}
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful summarizer." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    })

    const summary = completion.choices?.[0]?.message?.content ?? ""

    return new Response(
      JSON.stringify({ summary, currentPage, totalPages: TOTAL_PAGES }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (e: any) {
    console.error(e)
    return new Response(
      JSON.stringify({ error: "server_error", details: e.message }),
      { status: 500 }
    )
  }
}
