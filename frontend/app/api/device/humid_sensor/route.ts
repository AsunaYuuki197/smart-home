import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("user_id");

      if (!userId) {
        return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
      }

      const res = await fetch(`http://localhost:8000/device/humid_sensor/statistics?user_id=${userId}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 422 });
  }
}