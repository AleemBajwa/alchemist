import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const res = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("✅ Response from backend:", data); // Log for debugging

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error while fetching from backend:", error);
    return NextResponse.json({ error: 'Failed to fetch response' }, { status: 500 });
  }
}
