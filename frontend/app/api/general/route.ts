import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT

export async function GET(req: Request) {
    try {
        
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("user_id");
        
        if (!userId) {
            return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
        }
        const authHeader = req.headers.get("authorization");

        const res = await fetch(`${API_BASE_URL}/`,{
            headers:{
                "Content-Type": "application/json",
                "Authorization": authHeader || "",
            }
          });
          if (!res.ok) {
            const errorText = await res.text(); // 
            console.error("Lỗi server:", res.status, errorText);
            throw new Error(`Server error ${res.status}: ${errorText}`);
          }
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 422 });
    }
}