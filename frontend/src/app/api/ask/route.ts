import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = await response.text();
    return new Response(text);
  } catch (error) {
    console.error("[API ERROR]", error);
    return new Response("Error: " + (error as any).message, { status: 500 });
  }
}
