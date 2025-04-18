import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;

export async function GET(req: Request) {
  try {
      if (!API_BASE_URL) {
        return NextResponse.json({ error: "Missing API_BASE_URL" }, { status: 500 });
      }

      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("user_id");
      const deviceId = searchParams.get("device_id");

      if (!userId || !deviceId) {
        return NextResponse.json({ error: "Missing user_id or device_id" }, { status: 400 });
      }
      const authHeader = req.headers.get("authorization");
      const res = await fetch(`${API_BASE_URL}/device/status?user_id=${userId}&device_id=${deviceId}`,{
        headers:{
            "Content-Type": "application/json",
            "Authorization": authHeader || "",
        }
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      return NextResponse.json(data);
      
  } catch (error: any) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: error.message }, { status: 422 });
  }
}
