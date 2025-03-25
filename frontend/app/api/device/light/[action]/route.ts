import { NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_ENDPOINT
export async function GET(req: Request, context: { params: Promise<{ action: string }> }) {
  const params = await context.params;
  try {
    if (params.action === "statistics") {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("user_id");

      if (!userId) {
        return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
      }

      const res = await fetch(`${API_BASE_URL}/device/light/usage?user_id=${userId}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid GET action" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 422 });
  }
}

export async function POST(req: Request, context : { params: Promise<{ action: string }> }) {
  const params = await context.params;
  try {
    const body = await req.json();
    let apiUrl = "";

    if (params.action === "on") apiUrl = `${API_BASE_URL}/device/light/on`;
    else if (params.action === "off") apiUrl = `${API_BASE_URL}/device/light/off`;
    else if (params.action === "level") apiUrl = `${API_BASE_URL}/device/light/level`;
    else if (params.action === "color") apiUrl = `${API_BASE_URL}/device/light/color`;

    else return NextResponse.json({ error: "Invalid POST action" }, { status: 404 });

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 422 });
  }
}
