import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT

export async function GET(req: Request) {
    try {
        
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");
        
        if (!query) {
            return NextResponse.json({ error: "Missing query" }, { status: 400 });
        }
        
        const res = await fetch(`${API_BASE_URL}/notifications/search?query=${query}`);

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 422 });
    }
}