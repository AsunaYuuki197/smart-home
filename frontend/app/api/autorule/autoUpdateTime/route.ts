import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;
export async function POST(req: Request) {
  try {
    const text = await req.text();
    const body = JSON.parse(text);

    const { status, timeLeft, token } = body;

    const res = await fetch(`${API_BASE_URL}/autorule/save/countdown`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
      },
      body: JSON.stringify({ "user_id": 1 ,"status":status, "time":timeLeft }),
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 422 });
  }
}
